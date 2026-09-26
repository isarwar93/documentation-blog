---
title: "Building Linux for i.MX7"
description: "How MACHINE connects the generic build system to an NXP i.MX7 board, and what the first build for that platform looks like."
series: "yocto-project"
order: 8
tags: ["Yocto", "i.MX7", "NXP"]
---
## Machine configuration

One of the most important variables in Yocto is:

```text
MACHINE
```

`MACHINE` describes the target hardware.

For example, the build system needs to know:

* Which CPU is being used
* Which board is being used
* Which kernel configuration is required
* Which device tree should be used
* Which bootloader configuration applies
* Which hardware-specific packages are required

The machine configuration connects the generic Yocto build system with the actual target board.

Conceptually:

```text
Generic Yocto
     |
     +------ MACHINE ------+
                           |
                       Target Board
                           |
                  +--------+--------+
                  |        |        |
                CPU      Kernel    Device Tree
```

## The i.MX7 platform

The **NXP i.MX7** is an ARM-based application processor family designed for embedded applications.

It is particularly interesting for embedded Linux because it combines:

* ARM processing
* Hardware peripherals
* Networking
* Storage interfaces
* Display capabilities
* USB
* Serial interfaces
* Other embedded peripherals

The exact features depend on the specific i.MX7 variant and board.

The important point from a Yocto perspective is that the generic Yocto build system needs hardware-specific information.

That information comes from the BSP layers and machine configuration.

## Building Linux for an i.MX7 board

The exact machine name depends on the BSP version and board.

Once the appropriate BSP layers are configured, the general process is:

```bash
source oe-init-build-env
```

Configure the machine:

```text
MACHINE = "<your-imx7-machine>"
```

Then build an image:

```bash
bitbake core-image-minimal
```

For a graphical or more feature-rich system, a different image target can be used.

The important thing is that the machine configuration determines which hardware-specific components are included.
