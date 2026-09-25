---
title: "Building, uploading to S3 and serving through CloudFront"
description: "The build and upload steps, why CloudFront sits in front of S3, and using a CloudFront Function to serve clean URLs without index.html."
series: "aws-s3-cloudfront-deployment"
order: 7
tags: ["AWS", "CloudFront", "S3"]
---

## Build the website

The build section is intentionally simple:

```yaml
- name: Install dependencies
  run: npm ci

- name: Build Astro
  run: npm run build
```

If everything works, Astro produces:

```text
dist/
```

For example:

```text
dist/
├── index.html
├── about/
│   └── index.html
├── projects/
│   └── index.html
├── blog/
│   └── ...
└── assets/
```

The CI system does not deploy the source project.

It deploys this generated output.

## Deploy the build to S3

The deployment command is:

```bash
aws s3 sync dist/ "s3://${{ vars.S3_BUCKET }}" --delete
```

The important part is:

```text
dist/
```

on the left.

That's the local build output.

The right side is:

```text
s3://${{ vars.S3_BUCKET }}
```

which comes from GitHub Actions configuration.

Therefore the workflow itself remains generic.

## Configure CloudFront

Next, create a CloudFront distribution.

The origin should point to the S3 bucket.

For the S3 REST endpoint, the origin will look similar to:

```text
YOUR_S3_BUCKET.s3.YOUR_AWS_REGION.amazonaws.com
```

For example:

```text
my-astro-blog-production.s3.eu-central-1.amazonaws.com
```

The exact endpoint depends on the bucket's region.

For a private S3 origin, CloudFront should be configured with **Origin Access Control (OAC)** so that CloudFront can access the bucket without making the bucket public.

## Why CloudFront?

CloudFront provides several useful things:

* Global content delivery
* HTTPS
* Caching
* Custom domains
* Integration with AWS origins
* Edge processing through CloudFront Functions

The resulting architecture is:

```text
User
 │
 │ HTTPS
 ▼
CloudFront
 │
 │ private origin access
 ▼
S3
```

The user doesn't need direct access to the S3 bucket.

## The clean URL problem

After deploying the website, I encountered an interesting problem.

The homepage worked:

```text
/
```

but clicking a link such as:

```text
/projects
```

returned:

```xml
<Error>
  <Code>AccessDenied</Code>
  <Message>Access Denied</Message>
</Error>
```

At first this looked like an S3 permissions problem.

But the actual problem was URL resolution.

Astro had generated:

```text
dist/projects/index.html
```

while the browser requested:

```text
/projects
```

S3 doesn't automatically interpret the request in the same way as a traditional web server configured with directory indexes.

The desired transformation was:

```text
/projects
        ↓
/projects/index.html
```

## Solving the clean URL problem with CloudFront Functions

I created a CloudFront Function.

For example:

```text
astro-url-rewrite
```

The function code is:

```javascript
function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // If the request already points to a file, leave it unchanged
    if (uri.includes('.')) {
        return request;
    }

    // Remove trailing slash
    if (uri.endsWith('/')) {
        uri = uri.slice(0, -1);
    }

    // Root
    if (uri === '') {
        request.uri = '/index.html';
    } else {
        request.uri = uri + '/index.html';
    }

    return request;
}
```

CloudFront Functions can modify viewer requests before they are sent to the origin. AWS documents URL rewriting patterns for this type of static-site routing. [AWS CloudFront URL rewrite example](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/example_cloudfront_functions_url_rewrite_single_page_apps_section.html)

## Attach the function to CloudFront

In the CloudFront distribution:

```text
Behaviors
    ↓
Default behavior
    ↓
Edit
    ↓
Function associations
```

Associate the function with:

```text
Viewer request
```

The flow is then:

```text
Browser
   │
   │ /projects
   ▼
CloudFront
   │
   │ Function
   │
   │ /projects → /projects/index.html
   ▼
S3
   │
   ▼
projects/index.html
```

## How the URL rewriting works

The function produces these mappings:

```text
/                     → /index.html

/projects             → /projects/index.html

/projects/            → /projects/index.html

/about                → /about/index.html
```

But files remain unchanged:

```text
/assets/main.css      → /assets/main.css

/images/logo.svg      → /images/logo.svg

/favicon.svg          → /favicon.svg
```

The reason is this condition:

```javascript
if (uri.includes('.')) {
    return request;
}
```

A URL containing a file extension is assumed to already point to a file.

## The complete deployment flow

At this point the entire pipeline is:

```text
                      ┌───────────────┐
                      │   Developer   │
                      └───────┬───────┘
                              │
                         git push
                              │
                              ▼
                      ┌───────────────┐
                      │    GitHub     │
                      └───────┬───────┘
                              │
                              ▼
                   ┌────────────────────┐
                   │  GitHub Actions    │
                   │                    │
                   │ checkout           │
                   │ npm ci              │
                   │ npm run build      │
                   └─────────┬──────────┘
                             │
                             │ OIDC
                             ▼
                   ┌────────────────────┐
                   │      AWS STS       │
                   └─────────┬──────────┘
                             │
                             ▼
                   ┌────────────────────┐
                   │     IAM Role       │
                   └─────────┬──────────┘
                             │
                             ▼
                   ┌────────────────────┐
                   │        S3          │
                   │                    │
                   │     dist/          │
                   └─────────┬──────────┘
                             │
                             ▼
                   ┌────────────────────┐
                   │    CloudFront      │
                   │                    │
                   │ URL rewrite        │
                   │ CDN                │
                   │ HTTPS              │
                   └─────────┬──────────┘
                             │
                             ▼
                         Website
```

