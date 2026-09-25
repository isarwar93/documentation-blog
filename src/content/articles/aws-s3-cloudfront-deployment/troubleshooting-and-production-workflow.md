---
title: "Troubleshooting, invalidation and the final workflow"
description: "The failures that actually happen in CI: lock file errors, OIDC AssumeRoleWithWebIdentity errors, S3 access denied and region mismatches, plus automatic CloudFront invalidation."
series: "aws-s3-cloudfront-deployment"
order: 9
tags: ["Troubleshooting", "GitHub Actions", "AWS"]
---

## Troubleshooting: lock file errors

One of the first errors I encountered was:

```text
Error: Dependencies lock file is not found
```

The relevant configuration was:

```yaml
cache: npm
```

The solution was to make sure the repository contained:

```text
package-lock.json
```

Then:

```bash
npm ci
```

worked.

If you encounter this problem:

```bash
npm install
git add package-lock.json
git commit -m "Add package lock"
git push
```

Then rerun the workflow.

## Troubleshooting: OIDC `AssumeRoleWithWebIdentity` errors

Another important failure looked like:

```text
Could not assume role with OIDC:
Not authorized to perform sts:AssumeRoleWithWebIdentity
```

This is different from an S3 permissions error.

It means GitHub successfully reached AWS, but AWS rejected the attempt to assume the IAM role.

The first things to check are:

```text
GitHub OIDC provider
        ↓
Provider URL
        ↓
Audience
        ↓
IAM trust policy
        ↓
OIDC subject claim
```

The IAM permissions policy is not the first thing to troubleshoot.

The trust relationship controls:

> Who can assume this role?

The permissions policy controls:

> What can the role do after it has been assumed?

## Troubleshooting: S3 AccessDenied

If the deployment itself fails with S3 access errors, check:

```text
IAM role permissions
S3 bucket policy
S3 bucket name
AWS region
CloudFront origin configuration
```

But if the homepage loads while internal links return:

```text
AccessDenied
```

then don't immediately assume the IAM policy is wrong.

It may instead be a URL-routing problem.

In this setup, the solution was a CloudFront Function that converts:

```text
/projects
```

to:

```text
/projects/index.html
```

## Troubleshooting: AWS region

The AWS region must be consistent.

The GitHub Action uses:

```yaml
aws-region: ${{ vars.AWS_REGION }}
```

The S3 bucket exists in a specific region.

CloudFront then references the S3 origin.

If the region is incorrect, deployment or origin access can fail.

So check the S3 bucket's actual region and use that value for:

```text
AWS_REGION
```

## Optional improvement: automatic CloudFront invalidation

CloudFront caches content.

After uploading new files to S3, cached objects can remain available at CloudFront until they expire or are invalidated.

A deployment can therefore optionally perform a cache invalidation after the S3 sync.

The command is:

```bash
aws cloudfront create-invalidation \
  --distribution-id "${{ vars.CLOUDFRONT_DISTRIBUTION_ID }}" \
  --paths "/*"
```

The workflow can therefore become:

```yaml
- name: Deploy to S3
  run: |
    aws s3 sync dist/ "s3://${{ vars.S3_BUCKET }}" --delete

- name: Invalidate CloudFront
  run: |
    aws cloudfront create-invalidation \
      --distribution-id "${{ vars.CLOUDFRONT_DISTRIBUTION_ID }}" \
      --paths "/*"
```

If this is used, the IAM role needs permission for CloudFront invalidation.

For example:

```json
{
  "Effect": "Allow",
  "Action": [
    "cloudfront:CreateInvalidation"
  ],
  "Resource": "arn:aws:cloudfront::YOUR_AWS_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
}
```

Astro's AWS deployment documentation also demonstrates S3 synchronization followed by CloudFront invalidation. [Astro AWS deployment documentation](https://docs.astro.build/en/guides/deploy/aws/)

## Final production workflow

With CloudFront invalidation included, the complete workflow becomes:

```yaml
name: Deploy Astro to S3

on:
  push:
    branches:
      - main

permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build Astro
        run: npm run build

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ vars.AWS_ROLE_ARN }}
          aws-region: ${{ vars.AWS_REGION }}

      - name: Deploy to S3
        run: |
          aws s3 sync dist/ "s3://${{ vars.S3_BUCKET }}" --delete

      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id "${{ vars.CLOUDFRONT_DISTRIBUTION_ID }}" \
            --paths "/*"
```

This workflow contains no:

```text
AWS account ID
AWS access key
AWS secret access key
personal bucket name
personal domain
```

The infrastructure-specific values are supplied through GitHub Actions configuration.

## The final architecture

The completed system can be summarized as:

```text
┌───────────────────────────────────────────────────────────┐
│                       DEVELOPMENT                         │
│                                                           │
│  Local machine                                            │
│       │                                                   │
│       │ git push                                          │
│       ▼                                                   │
│  GitHub repository                                        │
└────────────────────────────┬──────────────────────────────┘
                             │
                             ▼
┌───────────────────────────────────────────────────────────┐
│                         CI/CD                             │
│                                                           │
│  GitHub Actions                                           │
│                                                           │
│  1. Checkout                                              │
│  2. Setup Node.js                                         │
│  3. npm ci                                                │
│  4. npm run build                                         │
│                                                           │
│             │                                             │
│             │ OIDC                                        │
│             ▼                                             │
│       AWS STS                                             │
│             │                                             │
│             ▼                                             │
│       IAM deployment role                                 │
│                                                           │
└────────────────────────────┬──────────────────────────────┘
                             │
                             ▼
┌───────────────────────────────────────────────────────────┐
│                         HOSTING                           │
│                                                           │
│  Amazon S3                                                │
│       │                                                   │
│       │ static files                                      │
│       ▼                                                   │
│  Amazon CloudFront                                        │
│       │                                                   │
│       ├── HTTPS                                           │
│       ├── CDN                                             │
│       ├── caching                                         │
│       └── URL rewriting                                   │
│       │                                                   │
│       ▼                                                   │
│  Custom domain                                            │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

## The developer experience

The infrastructure may look complicated when written out.

But from the developer's perspective, it is extremely simple.

I write an article.

```text
src/content/articles/new-article.md
```

Then:

```bash
git add .
```

```bash
git commit -m "Add new article"
```

```bash
git push origin main
```

And the deployment process takes over.

```text
git push
    ↓
GitHub
    ↓
GitHub Actions
    ↓
Astro build
    ↓
OIDC authentication
    ↓
AWS IAM role
    ↓
S3 deployment
    ↓
CloudFront
    ↓
Website
```

No FTP.

No manual upload.

No SSH.

No manually running the build on a server.

No permanent AWS credentials stored in GitHub.

## Lessons learned

The most useful part of this project was not simply getting an Astro site running.

It was understanding how the individual components fit together.

### GitHub

GitHub is the source of truth for the project.

### GitHub Actions

GitHub Actions automates the build and deployment.

### Astro

Astro converts the source project into static web files.

### OIDC

OIDC establishes an identity relationship between GitHub and AWS without requiring long-lived AWS access keys.

### IAM

IAM controls both:

```text
Who can assume the deployment role?
```

and:

```text
What can that role do?
```

### S3

S3 stores the generated website.

### CloudFront

CloudFront provides the public distribution layer, caching and HTTPS.

### CloudFront Functions

CloudFront Functions can modify incoming URLs before they reach S3, which solves the clean URL problem for Astro's generated `index.html` pages.

## The most important security principle

The final architecture follows a simple principle:

> Give the deployment system exactly the permissions it needs, and nothing more.

GitHub Actions does not receive administrator access to AWS.

It receives a specific role.

That role is restricted by:

```text
Repository
    +
Branch
    +
OIDC identity
    +
Specific AWS permissions
    +
Specific S3 bucket
```

This is much better than giving a CI system broad AWS permissions.

## Final result

What started as:

```text
"I want an engineering blog."
```

became a complete CI/CD system:

```text
                   ┌───────────────┐
                   │     Astro     │
                   │     Blog      │
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
                 ┌───────────────────┐
                 │  GitHub Actions   │
                 │                   │
                 │ npm ci            │
                 │ npm run build     │
                 └─────────┬─────────┘
                           │
                          OIDC
                           │
                           ▼
                 ┌───────────────────┐
                 │    AWS IAM/STS    │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │        S3         │
                 │                   │
                 │   Static files    │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │    CloudFront     │
                 │                   │
                 │ CDN / HTTPS       │
                 │ URL rewriting     │
                 └─────────┬─────────┘
                           │
                           ▼
                       Website
```

And publishing an article is now simply:

```bash
git push
```

That is the part I like most about the setup.

The infrastructure is doing its job in the background, while the development workflow stays simple.

* [GitHub — OpenID Connect with AWS](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws)
* [GitHub — OpenID Connect documentation](https://docs.github.com/en/actions/concepts/security/openid-connect)
* [AWS — CloudFront Functions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-functions.html)
* [AWS — CloudFront URL rewriting example](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/example_cloudfront_functions_url_rewrite_single_page_apps_section.html)
* [Astro — Deploying to AWS](https://docs.astro.build/en/guides/deploy/aws/)
* [AWS — configure-aws-credentials GitHub Action](https://github.com/aws-actions/configure-aws-credentials)

