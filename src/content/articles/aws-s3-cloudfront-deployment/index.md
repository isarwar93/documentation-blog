---
title: "Overview"
description: "A written series on deploying an Astro site to Amazon S3 behind CloudFront from GitHub Actions, without long-lived AWS access keys: OIDC, IAM, a private bucket, clean URLs and the failures you will hit."
series: "aws-s3-cloudfront-deployment"
order: 1
tags: ["AWS", "S3", "CloudFront", "GitHub Actions", "CI/CD", "Astro"]
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

## What this series covers

- [Building the Astro site in GitHub Actions](/articles/aws-s3-cloudfront-deployment/building-astro-in-github-actions/) — Why Astro fits a static engineering blog, what the repository must contain for CI to work, and why the workflow installs dependencies with npm ci.
- [Creating a private S3 bucket](/articles/aws-s3-cloudfront-deployment/creating-a-private-s3-bucket/) — Creating the S3 bucket that holds the generated website and keeping it private so only CloudFront can read it.
- [Authenticating GitHub Actions to AWS with OIDC](/articles/aws-s3-cloudfront-deployment/github-oidc-to-aws/) — Creating the GitHub OIDC identity provider in AWS and an IAM role restricted to this repository and branch, so the workflow assumes a role instead of storing access keys.
- [Configuring the workflow: secrets and the role ARN](/articles/aws-s3-cloudfront-deployment/configuring-the-deploy-workflow/) — Why the configuration is stored as GitHub secrets rather than variables, and what the final deploy.yml looks like.
- [Building, uploading to S3 and serving through CloudFront](/articles/aws-s3-cloudfront-deployment/deploying-to-s3-and-cloudfront/) — The build and upload steps, why CloudFront sits in front of S3, and using a CloudFront Function to serve clean URLs without index.html.
- [Publishing an article and keeping configuration clean](/articles/aws-s3-cloudfront-deployment/publishing-and-config-hygiene/) — What happens after an article is written, the repository structure, and why secrets and variables are not hard-coded into the workflow.
- [Troubleshooting and the production workflow](/articles/aws-s3-cloudfront-deployment/troubleshooting-and-production-workflow/) — The failures that actually happen in CI: lock file errors, OIDC AssumeRoleWithWebIdentity errors, S3 access denied and region mismatches, plus how to add cache invalidation.

Each part is a self-contained write-up, so read them in order or jump straight to the one you need.
