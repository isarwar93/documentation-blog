---
title: "Setting up a Yocto Build Environment"
description: "Initialising the build directory, setting MACHINE in local.conf, listing layers in bblayers.conf and building the first image."
series: "yocto-project"
order: 7
tags: ["Yocto", "BitBake"]
---
## Setting up a Yocto build environment

A typical Yocto project is initialized from a source tree.

After obtaining the appropriate Yocto/OpenEmbedded sources, the environment can be initialized with:

```bash
source oe-init-build-env
```

This command prepares the shell environment and normally creates a build directory.

For example:

```text
build/
├── conf/
│   ├── local.conf
│   └── bblayers.conf
```

Two files are particularly important.

## local.conf

`local.conf` contains local build configuration.

For example:

```text
MACHINE = "my-machine"
```

Other configuration options can control:

* Parallel compilation
* Package selection
* Download directories
* Build directories
* Image features
* Debug configuration

For example:

```text
DL_DIR ?= "${TOPDIR}/../downloads"
```

This can keep downloaded source archives outside the build directory.

## bblayers.conf

`bblayers.conf` defines which layers are available to BitBake.

Conceptually:

```text
BBLAYERS = " \
    /path/to/meta-layer1 \
    /path/to/meta-layer2 \
    /path/to/meta-custom \
"
```

If a recipe belongs to a layer that is not included in `BBLAYERS`, BitBake will not be able to use it.

This is one of the first things to check when BitBake reports that it cannot find a recipe.

## Building the first image

Once the environment is configured, we can build an image.

A common minimal image is:

```bash
bitbake core-image-minimal
```

The first build can take a long time.

This is normal.

Yocto may need to:

1. Download source code
2. Extract sources
3. Apply patches
4. Configure packages
5. Compile the software
6. Package the software
7. Create the root filesystem
8. Build the kernel
9. Build bootloader components
10. Generate the final image

After the first build, many components are cached, so subsequent builds can be significantly faster.
