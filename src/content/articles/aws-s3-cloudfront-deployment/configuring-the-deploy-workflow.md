---
title: "Configuring the workflow: secrets and the role ARN"
description: "Why this deployment stores its configuration as GitHub secrets rather than variables, and what the final deploy.yml looks like."
series: "aws-s3-cloudfront-deployment"
order: 5
tags: ["GitHub Actions", "CI/CD", "Security"]
---

## Don't put the bucket name directly in the workflow

One improvement I made was to avoid hard-coding deployment-specific configuration into the workflow.

Instead of:

```yaml
run: aws s3 sync dist/ s3://some-specific-bucket --delete
```

I use GitHub Actions configuration.

## Secrets and variables are not the same thing

GitHub has two stores, and the difference matters more than it looks:

| | Secret | Variable |
| --- | --- | --- |
| Masked in the logs | **yes** | **no** |
| Readable in the workflow as | `${{ secrets.NAME }}` | `${{ vars.NAME }}` |

Only a **secret** is replaced with `***` in the log output. A **variable** is printed as it is.

That matters because GitHub echoes the body of a `run:` step into the log with the expressions
already expanded. A line like this prints the bucket name in plain text:

```yaml
run: aws s3 sync dist/ "s3://${{ vars.S3_BUCKET }}" --delete
```

So for anything that should not appear in a build log, this deployment stores a **secret**, even
when the value itself is not a credential such as a bucket name.

## The secrets this repository creates

In the repository:

```text
Settings
    ↓
Secrets and variables
    ↓
Actions
    ↓
New repository secret
```

Create these two secrets:

```text
AWS_ACCOUNT_ID
AWS_S3_BUCKET
```

`AWS_ACCOUNT_ID` is only the twelve-digit account number, for example `123456789012`. The role ARN
is then composed from it in the workflow, so the full identifier never has to be stored or written
out. `AWS_S3_BUCKET` is the bucket that holds the generated site.

These values are examples only. Use the real account and bucket of the deployment.

The region is not a secret, so it is written directly into the workflow as `eu-north-1`. It could
equally be a variable, because nothing about it needs hiding.

## The role ARN is composed, not stored

The credentials action takes the full role ARN, and the workflow builds it from the account id
secret and a fixed role name:

```yaml
role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/GitHubActionsDocumentationBlog
```

An IAM role ARN is not a credential. It names a role, and the role's trust policy plus the OIDC
subject claim are what actually decide who may assume it. Storing the account number as a secret
keeps the assembled ARN out of the file, and it means the workflow can be copied to another
account by changing one secret.

The important security boundary is still the IAM trust policy, not the storage choice.

## Passing a secret to a shell command

A secret used inside `run:` would still be echoed with the value visible, because the log prints
the script before it runs. Bind it to an environment variable instead, and let the script reference
the shell variable:

```yaml
- name: Deploy to S3
  env:
    AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
  run: |
    aws s3 sync ./dist "s3://${AWS_S3_BUCKET}" --delete --only-show-errors
```

The echoed script now shows `${AWS_S3_BUCKET}`, and the secret is masked wherever it would
otherwise be printed. `--only-show-errors` keeps the sync output quiet, so the upload listing does
not echo the bucket back either.

Two habits follow from this: never interpolate a secret into a command line, and never turn on
`set -x` or step debug logging in a step that reads one.

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
        uses: actions/checkout@v7

      - name: Setup Node.js
        uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci --no-audit --no-fund

      - name: Build Astro
        run: npm run build

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v6
        with:
          role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/GitHubActionsDocumentationBlog
          aws-region: eu-north-1
          mask-aws-account-id: true

      - name: Deploy to S3
        env:
          AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
        run: |
          aws s3 sync ./dist "s3://${AWS_S3_BUCKET}" --delete --only-show-errors
```

This is much cleaner than embedding deployment-specific values directly into the YAML, and it
keeps them out of the log.

The action versions are the Node 24 releases: `checkout@v7` and `setup-node@v7` run on Node 24, and
`configure-aws-credentials@v6` is the first version of that action on Node 24, since `@v5` still
runs on Node 20. `mask-aws-account-id: true` masks the account id in the step's own output, which
would otherwise appear in the AssumeRoleWithWebIdentity response.

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
role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/GitHubActionsDocumentationBlog
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

