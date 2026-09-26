---
title: "Raspberry Pi 3 with Yocto"
description: "The same Yocto concepts on a different board: machine configuration, BSP layers, and what Raspberry Pi is convenient for."
series: "yocto-project"
order: 15
tags: ["Yocto", "Raspberry Pi"]
---
## Raspberry Pi 3

The same general Yocto concepts apply to the **Raspberry Pi 3**.

The hardware is different, but the architecture remains:

```text
Yocto
  |
  +-- Machine configuration
  |
  +-- Raspberry Pi BSP
  |
  +-- Kernel
  |
  +-- Bootloader
  |
  +-- Root filesystem
  |
  v
Raspberry Pi 3
```

This is an important advantage of learning Yocto.

Once the basic concepts are understood, moving between supported hardware platforms becomes much easier.

## Raspberry Pi machine configuration

For Raspberry Pi, the appropriate BSP layer provides machine configurations for supported Raspberry Pi boards.

The exact machine identifier depends on the BSP version.

For example, the configuration conceptually looks like:

```text
MACHINE = "<raspberry-pi-3-machine>"
```

Then an image can be built:

```bash
bitbake core-image-minimal
```

The resulting artifacts can then be written to the appropriate boot media according to the board and image format.

## i.MX7 vs Raspberry Pi

The two platforms are useful for learning different aspects of embedded Linux.

#### i.MX7

The i.MX7 environment is particularly useful for understanding:

* NXP BSPs
* ARM embedded processors
* Vendor kernel trees
* Device trees
* Embedded hardware
* Custom product boards
* Industrial embedded Linux

#### Raspberry Pi 3

Raspberry Pi is convenient for:

* Rapid experimentation
* Networking
* GPIO
* Prototyping
* Learning Linux
* Testing custom applications

The underlying Yocto concepts remain largely the same.
