---
title: "Configuring the workflow: variables, secrets and the role ARN"
description: "Keeping deployment configuration out of the workflow YAML with repository variables and secrets, and what the final deploy.yml looks like."
series: "aws-s3-cloudfront-deployment"
order: 6
tags: ["GitHub Actions", "CI/CD", "Security"]
---

## Don't put the bucket name directly in the workflow

One improvement I made was to avoid hard-coding deployment-specific configuration into the workflow.

Instead of:

```yaml
run: aws s3 sync dist/ s3://some-specific-bucket --delete
```

I use GitHub Actions configuration.

There are two useful categories:

### GitHub Actions Secrets

Use **Secrets** for sensitive values.

For example:

```text
AWS_ROLE_ARN
```

can be stored as a secret if I don't want the role ARN visible in the workflow configuration.

### GitHub Actions Variables

Use **Variables** for non-sensitive configuration.

For example:

```text
AWS_REGION
S3_BUCKET
CLOUDFRONT_DISTRIBUTION_ID
```

A bucket name is generally not a secret, but keeping it in a variable makes the workflow reusable.

## Configure GitHub Actions variables

In the repository:

```text
Settings
    ↓
Secrets and variables
    ↓
Actions
```

Create repository variables such as:

```text
AWS_REGION
S3_BUCKET
CLOUDFRONT_DISTRIBUTION_ID
```

Example values:

```text
AWS_REGION = eu-central-1
S3_BUCKET = my-astro-blog-production
CLOUDFRONT_DISTRIBUTION_ID = E123456789ABC
```

These values are examples only.

Use the actual region, bucket and CloudFront distribution belonging to your deployment.

## Configure the AWS role ARN

The role ARN can also be stored as a GitHub Actions variable:

```text
AWS_ROLE_ARN
```

For example:

```text
arn:aws:iam::123456789012:role/GitHubActionsAstroDeployment
```

An IAM role ARN is not equivalent to an AWS secret key; it identifies the role. It is therefore reasonable to store it as a repository variable rather than treating it like a password.

The important security boundary is still the IAM trust policy.

## The GitHub Actions workflow

The final workflow becomes:

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
```

This is much cleaner than embedding deployment-specific values directly into the YAML.

## Why there are no AWS access keys

Notice that the workflow does **not** contain:

```text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

There is also no:

```yaml
aws-access-key-id:
aws-secret-access-key:
```

Instead:

```yaml
permissions:
  id-token: write
```

allows the workflow to request an OIDC identity token.

Then:

```yaml
role-to-assume: ${{ vars.AWS_ROLE_ARN }}
```

tells the AWS credentials action which IAM role to assume.

The resulting process is:

```text
GitHub workflow
      │
      │ OIDC
      ▼
AWS STS
      │
      ▼
IAM role
      │
      ▼
Temporary credentials
      │
      ▼
AWS S3
```

This is one of the most important security improvements in the entire setup.

