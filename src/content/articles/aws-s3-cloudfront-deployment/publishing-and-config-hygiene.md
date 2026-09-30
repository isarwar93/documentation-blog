---
title: "Publishing an article and keeping configuration clean"
description: "What happens after an article is written, the repository structure, and why secrets and variables are not hard-coded into the workflow."
series: "aws-s3-cloudfront-deployment"
order: 7
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

This repository holds two secrets:

```text
AWS_ACCOUNT_ID
AWS_S3_BUCKET
```

The workflow composes the role ARN from the account number, reads the bucket from the environment
in the deploy step, and writes the region directly into the YAML. Nothing infrastructure-specific
is hard-coded, and nothing sensitive is printed in the log.

## Variables vs Secrets

The distinction that matters is masking. A **secret** is replaced with `***` in the log; a
**variable** is printed as it is, because GitHub echoes a `run:` script with its expressions
already expanded.

So the rule for this deployment is: anything that should not appear in a build log is a secret,
even when it is not a credential. The bucket name qualifies.

The full reasoning, and the exact YAML for both the secret and the environment binding, is in
[Configuring the workflow](/articles/aws-s3-cloudfront-deployment/configuring-the-deploy-workflow/).

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

