---
title: "Creating a private S3 bucket"
description: "Creating the S3 bucket that holds the generated website and keeping it private so only CloudFront can read it."
series: "aws-s3-cloudfront-deployment"
order: 4
tags: ["AWS", "S3", "Security"]
---

## Creating the S3 bucket

I created an S3 bucket specifically for the **generated website**.

The bucket name in this article is intentionally generic:

```text
YOUR_S3_BUCKET
```

For example, it could be something like:

```text
my-astro-blog-production
```

but the actual name is up to you.

The important distinction is that S3 is **not being used as a Git repository backup**.

GitHub contains the source:

```text
Astro source
Markdown
Components
Configuration
package.json
```

while S3 contains the generated website:

```text
index.html
projects/index.html
assets/...
```

The deployment pipeline is therefore:

```text
Source
  ↓
Astro build
  ↓
dist/
  ↓
S3
```

## Keep the S3 bucket private

I don't want the S3 bucket to be the public-facing website.

Instead, the architecture is:

```text
Internet
    │
    ▼
CloudFront
    │
    ▼
Private S3 bucket
```

This gives CloudFront control over the public distribution layer.

The S3 bucket itself doesn't need to be directly accessible from the public internet.

For a CloudFront distribution using the S3 REST endpoint, CloudFront can be configured to access the bucket using Origin Access Control (OAC).

