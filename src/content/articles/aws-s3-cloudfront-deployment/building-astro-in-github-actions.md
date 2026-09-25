---
title: "Building the Astro site in GitHub Actions"
description: "Why Astro fits a static engineering blog, what the repository must contain for CI to work, and why the workflow installs dependencies with npm ci."
series: "aws-s3-cloudfront-deployment"
order: 3
tags: ["Astro", "GitHub Actions", "npm"]
---

## Why Astro?

Astro is particularly suitable for a documentation or engineering blog because the majority of the content can be generated as static HTML.

The source project might contain:

```text
src/
├── components/
├── layouts/
├── pages/
└── content/
```

After running:

```bash
npm run build
```

Astro generates a production-ready static website:

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
    └── ...
```

This means I don't need a continuously running application server just to serve the blog.

The generated files can be stored in object storage and distributed through a CDN.

## The repository

The project is stored in GitHub.

A typical structure looks like:

```text
documentation-blog/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── public/
│
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   └── content/
│
├── astro.config.mjs
├── package.json
├── package-lock.json
└── ...
```

The important part for CI/CD is that the repository contains:

```text
package.json
package-lock.json
```

The lock file is especially important because GitHub Actions will use:

```bash
npm ci
```

to install dependencies.

## `npm install` vs `npm ci`

For local development, I can use:

```bash
npm install
```

This can create or update:

```text
package-lock.json
```

The lock file should then be committed:

```bash
git add package.json package-lock.json
git commit -m "Add npm lock file"
git push
```

For CI, I use:

```bash
npm ci
```

instead.

The idea is:

```text
Local development
       ↓
npm install
       ↓
package-lock.json
       ↓
Git commit
       ↓
GitHub Actions
       ↓
npm ci
```

This makes the CI environment reproducible.

