---
title: "Understanding BitBake"
description: "The ecosystem around BitBake, how one build target expands into a dependency tree, and the task lifecycle behind every recipe."
series: "yocto-project"
order: 4
tags: ["Yocto", "BitBake"]
---
## Yocto is not a single program

Another important concept is that Yocto is an ecosystem rather than one executable.

Several components work together.

The most important concepts are:

```text
Yocto Project
     |
     +-- BitBake
     |
     +-- OpenEmbedded
     |
     +-- Metadata
     |      |
     |      +-- Recipes
     |      +-- Classes
     |      +-- Configuration
     |      +-- Layers
     |
     +-- BSPs
```

Let's look at these individually.

## BitBake

**BitBake** is the task execution engine used by Yocto.

It reads recipes and configuration files and determines what needs to be built.

For example:

```bash
bitbake core-image-minimal
```

This tells BitBake to build the `core-image-minimal` image.

BitBake then determines the dependencies required to create that image.

Conceptually:

```text
core-image-minimal
        |
        +-- root filesystem
        |
        +-- packages
        |
        +-- libc
        |
        +-- kernel
        |
        +-- bootloader
        |
        +-- machine configuration
        |
        +-- dependencies
```

BitBake builds the required components in the correct order.

## Understanding the build process

One of the most useful things to understand is what happens internally.

A simplified recipe lifecycle looks like:

```text
do_fetch
    |
    v
do_unpack
    |
    v
do_patch
    |
    v
do_configure
    |
    v
do_compile
    |
    v
do_install
    |
    v
do_package
```

Finally, packages can be combined into a root filesystem.

For example:

```text
Source
  |
  v
Fetch
  |
  v
Unpack
  |
  v
Patch
  |
  v
Configure
  |
  v
Compile
  |
  v
Install
  |
  v
Package
  |
  v
Root Filesystem
  |
  v
Final Image
```

Understanding this sequence is extremely useful when debugging Yocto.
