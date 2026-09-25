---
title: "Why I automated publishing my blog"
description: "The requirements behind the deployment, the end-to-end architecture from git push to CloudFront, and why no AWS access key is stored in GitHub."
series: "aws-s3-cloudfront-deployment"
order: 2
tags: ["CI/CD", "Astro", "AWS"]
---

I wanted to build a personal engineering blog where I could document projects, experiments, embedded-systems development, FPGA work, Linux troubleshooting, software projects, and everything else I learn along the way.

But I didn't want publishing an article to involve manually building the website, uploading files to a server, or logging into AWS every time.

I wanted the deployment process to be completely automated.

The goal was:

```text
Write article
    ↓
git commit
    ↓
git push
    ↓
GitHub Actions
    ↓
Build Astro website
    ↓
Deploy generated files to Amazon S3
    ↓
CloudFront
    ↓
Website
```

The final architecture uses:

* Astro
* GitHub
* GitHub Actions
* GitHub OpenID Connect (OIDC)
* AWS IAM
* Amazon S3
* Amazon CloudFront
* CloudFront Functions
* A custom domain

The most important security decision was that I **did not store a permanent AWS access key and secret key in GitHub**.

Instead, GitHub Actions authenticates to AWS using OIDC and assumes a restricted IAM role.

## The goal

The requirements were straightforward:

1. Build the blog with Astro.
2. Keep all source code in GitHub.
3. Automatically deploy after pushing to `main`.
4. Build the Astro project inside GitHub Actions.
5. Upload only the generated `dist/` directory to S3.
6. Serve the website through CloudFront.
7. Keep the S3 bucket private.
8. Use a custom domain.
9. Support clean URLs such as:

```text
https://example.com/projects
```

instead of:

```text
https://example.com/projects/index.html
```

10. Avoid storing permanent AWS credentials in GitHub.

The final architecture looks like this:

```text
                         ┌──────────────────────┐
                         │      Developer       │
                         │                      │
                         │  Edit Astro content  │
                         └──────────┬───────────┘
                                    │
                               git push
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       GitHub         │
                         │    Source Code       │
                         └──────────┬───────────┘
                                    │
                              GitHub Actions
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      Astro Build     │
                         │                      │
                         │      npm ci          │
                         │   npm run build      │
                         └──────────┬───────────┘
                                    │
                                  dist/
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Amazon S3      │
                         │   Static Web Files   │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     CloudFront       │
                         │      CDN / HTTPS     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                              Custom Domain
                                    │
                                    ▼
                                  Users
```

