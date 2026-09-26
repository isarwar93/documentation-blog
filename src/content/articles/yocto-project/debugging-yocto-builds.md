---
title: "Debugging Yocto Builds"
description: "Reading a large BitBake failure from the first real error, the useful commands, the build directory and the dependency-graph mental model."
series: "yocto-project"
order: 16
tags: ["Yocto", "BitBake", "Debugging"]
---
## Debugging Yocto

Yocto builds can sometimes produce very large error messages.

The most important thing is to find the **first meaningful error**.

For example:

```text
ERROR: Task (...do_compile) failed
```

is not necessarily the root cause.

Look above it for:

```text
fatal error:
```

or:

```text
configure: error:
```

or:

```text
No such file or directory
```

or:

```text
command not found
```

The first actual failure is usually more useful than the final BitBake summary.

## Useful BitBake commands

List available recipes:

```bash
bitbake-layers show-recipes
```

Show configured layers:

```bash
bitbake-layers show-layers
```

Show the environment:

```bash
bitbake -e
```

Build a recipe:

```bash
bitbake <recipe>
```

Clean a recipe:

```bash
bitbake -c clean <recipe>
```

Clean more aggressively:

```bash
bitbake -c cleansstate <recipe>
```

Run a specific task:

```bash
bitbake -c compile <recipe>
```

These commands are extremely useful when investigating how Yocto is processing a recipe.

## Understanding the build directory

A Yocto build directory contains a large amount of generated information.

Typical directories include:

```text
build/
├── conf/
├── downloads/
├── sstate-cache/
├── tmp/
└── ...
```

#### downloads

Downloaded source archives.

#### sstate-cache

Shared-state cache used to avoid rebuilding things unnecessarily.

#### tmp

The main generated build output.

The `tmp` directory can become very large.

This is normal.

## Common mistakes when starting with Yocto

### Mistake 1 — Treating Yocto like Ubuntu

Yocto is not primarily a distribution that you install.

It is a system for **building** a distribution.

### Mistake 2 — Modifying vendor layers directly

Avoid changing vendor layers whenever possible.

Create a custom layer.

### Mistake 3 — Installing everything manually

If a package or configuration is required for the product, put it into the Yocto configuration.

Do not rely on manual commands after every boot.

### Mistake 4 — Ignoring the BSP

Hardware support is often strongly connected to the BSP.

Before debugging a hardware problem, verify that the correct BSP and machine configuration are being used.

### Mistake 5 — Cleaning everything immediately

Yocto builds can be very large.

Do not immediately delete caches whenever something fails.

First understand the error.

Cleaning everything can turn a five-minute rebuild into a several-hour build.

## The most important mental model

The most important thing I learned while working with Yocto is that you should think of it as a **dependency graph**, not as a collection of shell commands.

For example:

```text
                 Image
                   |
        +----------+----------+
        |          |          |
      Kernel    Packages   Bootloader
        |          |
    Device Tree   |
        |          |
        +----+-----+
             |
           Recipes
             |
           Sources
```

Every component depends on other components.

When something fails, trace the dependency backwards.

For example:

```text
Application doesn't start
        ↓
Is application installed?
        ↓
Is package included?
        ↓
Is recipe correct?
        ↓
Was recipe successfully built?
        ↓
Was source fetched?
```

This way of thinking makes Yocto much easier to debug.

## Quick Reference

### Initialize environment

```bash
source oe-init-build-env
```

### Build an image

```bash
bitbake <image>
```

### List layers

```bash
bitbake-layers show-layers
```

### List recipes

```bash
bitbake-layers show-recipes
```

### Inspect environment

```bash
bitbake -e <recipe>
```

### Clean recipe

```bash
bitbake -c clean <recipe>
```

### Run a task

```bash
bitbake -c <task> <recipe>
```

### Check network interfaces

```bash
ip link
```

### Check wireless devices

```bash
iw dev
```

### Inspect kernel messages

```bash
dmesg
```
