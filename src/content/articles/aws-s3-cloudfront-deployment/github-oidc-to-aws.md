---
title: "Authenticating GitHub Actions to AWS with OIDC"
description: "Creating the GitHub OIDC identity provider in AWS and an IAM role restricted to this repository and branch, so the workflow assumes a role instead of storing access keys."
series: "aws-s3-cloudfront-deployment"
order: 5
tags: ["AWS", "OIDC", "IAM", "Security"]
---

## Creating the GitHub OIDC provider

The next problem is authentication.

A common approach is to create an AWS access key and put it into GitHub Secrets.

That would look like:

```text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

But those are long-lived credentials.

Instead, I used GitHub OpenID Connect.

The authentication flow becomes:

```text
GitHub Actions
       │
       │ OIDC token
       ▼
AWS STS
       │
       │ AssumeRoleWithWebIdentity
       ▼
IAM Role
       │
       ▼
Temporary AWS credentials
       │
       ▼
S3
```

GitHub documents OIDC authentication with AWS specifically as a way to avoid storing long-lived AWS credentials in GitHub. [GitHub OIDC with AWS](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws)

## Add the GitHub OIDC identity provider in AWS

In AWS IAM:

```text
IAM
 └── Identity providers
      └── Add provider
```

Select:

```text
OpenID Connect
```

Use:

**Provider URL**

```text
https://token.actions.githubusercontent.com
```

**Audience**

```text
sts.amazonaws.com
```

The resulting provider is:

```text
token.actions.githubusercontent.com
```

This establishes trust between AWS and GitHub's OIDC identity system.

## Create the IAM role

Next, create an IAM role for GitHub Actions.

For example:

```text
GitHubActionsAstroDeployment
```

The role is responsible for two things:

1. Deciding **who can assume the role**.
2. Deciding **what the role can do after it is assumed**.

These are controlled separately.

The first is the **trust policy**.

The second is the **permissions policy**.

## Restrict the role to the GitHub repository

The role should not be available to every GitHub repository.

The trust policy should identify the repository and, if appropriate, branch that is allowed to assume the role.

For a repository named:

```text
YOUR_GITHUB_OWNER/YOUR_GITHUB_REPOSITORY
```

the standard subject pattern is:

```text
repo:YOUR_GITHUB_OWNER/YOUR_GITHUB_REPOSITORY:ref:refs/heads/main
```

A trust policy can look like:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_AWS_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:YOUR_GITHUB_OWNER/YOUR_GITHUB_REPOSITORY:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

Replace:

```text
YOUR_AWS_ACCOUNT_ID
YOUR_GITHUB_OWNER
YOUR_GITHUB_REPOSITORY
```

with your own values.

This is an important security control.

I don't want:

```text
any GitHub repository
```

to be able to assume my deployment role.

I want:

```text
specific GitHub repository
        +
specific branch
        ↓
AWS deployment role
```

GitHub recommends restricting the OIDC trust relationship to the intended repository/workflow identity rather than using an unrestricted wildcard. [GitHub OIDC with AWS](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws)

### Important: verify the current `sub` claim

GitHub has evolved its OIDC subject-claim behavior. Depending on repository configuration and when the repository was created, the subject claim can differ from older examples.

Therefore, don't blindly copy an old `sub` value if AWS rejects the role assumption.

The trust policy must match the actual OIDC claims emitted by the GitHub workflow.

## Give the role S3 permissions

The deployment role only needs enough permission to synchronize the generated website.

A least-privilege policy can look like:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListBucket",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::YOUR_S3_BUCKET"
    },
    {
      "Sid": "ManageWebsiteObjects",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::YOUR_S3_BUCKET/*"
    }
  ]
}
```

Replace:

```text
YOUR_S3_BUCKET
```

with your bucket name.

This allows the deployment process to:

```text
List objects
Upload objects
Read objects
Delete objects
```

It does not grant permission to create or delete arbitrary S3 buckets.

## Why `DeleteObject` is required

The deployment command will use:

```bash
aws s3 sync dist/ s3://YOUR_S3_BUCKET --delete
```

Suppose the website previously contained:

```text
projects/
old-project/
about/
```

and I remove:

```text
old-project/
```

from the source project.

Without `--delete`, the old object might remain in S3.

With:

```bash
--delete
```

the destination is synchronized with the current build.

Therefore:

```text
dist/
```

becomes the source of truth for the deployed website.

