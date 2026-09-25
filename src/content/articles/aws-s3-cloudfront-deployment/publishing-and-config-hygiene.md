---
title: "Publishing an article and keeping configuration clean"
description: "What happens after an article is written, the repository structure, and why secrets and variables are not hard-coded into the workflow."
series: "aws-s3-cloudfront-deployment"
order: 8
tags: ["GitHub Actions", "CI/CD"]
---

## Publishing an article

Now publishing an article is extremely simple.

I create or edit a Markdown file:

```text
src/content/articles/my-new-project.md
```

Then:

```bash
git add .
```

```bash
git commit -m "Add new project article"
```

```bash
git push origin main
```

That's it.

GitHub Actions takes over.

## What GitHub Actions does automatically

The workflow performs:

```text
git push
   ↓
Checkout source
   ↓
Install Node.js
   ↓
npm ci
   ↓
npm run build
   ↓
Generate dist/
   ↓
Authenticate to AWS using OIDC
   ↓
Assume IAM role
   ↓
Sync dist/ to S3
   ↓
CloudFront serves the new files
```

No manual upload is required.

## A complete example repository structure

A production repository can look like:

```text
documentation-blog/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── public/
│   ├── favicon.svg
│   └── images/
│
├── src/
│   ├── components/
│   ├── content/
│   │   └── blog/
│   ├── layouts/
│   └── pages/
│
├── astro.config.mjs
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

The workflow is part of the repository itself:

```text
.github/workflows/deploy.yml
```

This means the deployment process is version-controlled together with the application.

## Useful GitHub Actions configuration

The repository can contain these variables:

```text
AWS_ROLE_ARN
AWS_REGION
S3_BUCKET
CLOUDFRONT_DISTRIBUTION_ID
```

For example:

```text
AWS_ROLE_ARN
    ↓
arn:aws:iam::123456789012:role/GitHubActionsAstroDeployment

AWS_REGION
    ↓
eu-central-1

S3_BUCKET
    ↓
my-astro-blog-production

CLOUDFRONT_DISTRIBUTION_ID
    ↓
E123456789ABC
```

The exact values are environment-specific.

This means the workflow doesn't need to contain personal infrastructure identifiers.

## Variables vs Secrets

A useful rule is:

### Use a GitHub variable for non-sensitive configuration

Examples:

```text
AWS_REGION
S3_BUCKET
CLOUDFRONT_DISTRIBUTION_ID
AWS_ROLE_ARN
```

### Use GitHub Secrets for sensitive values

Examples:

```text
API keys
private tokens
passwords
third-party credentials
```

For this architecture, the goal is actually to avoid having AWS access keys altogether.

That's one of the main benefits of OIDC.

So instead of:

```text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

I have:

```text
GitHub OIDC
        ↓
AWS IAM Role
        ↓
Temporary credentials
```

## Why I don't put secrets directly into YAML

Never do this:

```yaml
aws-secret-access-key: "MY_SECRET"
```

and don't commit things like:

```text
.env
credentials.json
aws-credentials.txt
```

to Git.

Even if a repository is private, secrets should be handled through an appropriate secret-management mechanism.

For AWS specifically, OIDC eliminates the need for long-lived AWS credentials in this deployment architecture.

