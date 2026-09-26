---
title: "PICO-IMX7 with Yocto"
description: "What a BSP provides for a board like the PICO-IMX7, and how Yocto assembles U-Boot, kernel and root filesystem into a bootable image."
series: "yocto-project"
order: 9
tags: ["Yocto", "i.MX7", "BSP"]
---
## BSP — Board Support Package

A **BSP**, or Board Support Package, provides the hardware-specific configuration required to build Linux for a particular board.

A BSP can contain:

* Machine configuration
* Linux kernel configuration
* Device trees
* Bootloader configuration
* Hardware-specific recipes
* Firmware
* Patches

For example, when working with an NXP i.MX board, vendor-provided layers provide much of the hardware support needed to build Linux.

This saves us from having to implement all hardware support ourselves.

## PICO-IMX7

One of the boards used in this work is the **PICO-IMX7**.

The board provides an embedded platform around the i.MX7 processor.

Instead of manually assembling a Linux system, Yocto can be used to generate a complete bootable system for the board.

The overall architecture is:

```text
                 Yocto
                   |
        +----------+----------+
        |                     |
      BSP                  Custom Layer
        |                     |
        +----------+----------+
                   |
              BitBake
                   |
        +----------+----------+
        |          |          |
     U-Boot     Kernel      RootFS
        |          |          |
        +----------+----------+
                   |
             Bootable Image
                   |
                   v
              PICO-IMX7
```

## Bootloader

Before Linux starts, an embedded processor needs boot software.

For many ARM embedded platforms this is **U-Boot**.

The boot sequence can be simplified as:

```text
Power On
   |
   v
Boot ROM
   |
   v
Bootloader
   |
   v
Linux Kernel
   |
   v
Device Tree
   |
   v
Root Filesystem
   |
   v
User Space
```

The exact boot sequence depends on the SoC and board configuration.

Yocto can build the bootloader as part of the overall image-generation process.
