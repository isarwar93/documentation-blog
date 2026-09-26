---
title: "Yocto Project"
description: "A written series on the Yocto Project: what it is, how BitBake, recipes and layers work, and how to build a customized, reproducible embedded Linux image for an NXP i.MX7 board and a Raspberry Pi 3."
series: "yocto-project"
order: 1
tags: ["Yocto", "Embedded Linux", "BitBake", "i.MX7"]
---

When working with embedded Linux, installing a complete desktop-oriented Linux distribution is often unnecessary.

An embedded device usually needs only a small set of components:

* A bootloader
* A Linux kernel
* Device-tree files
* Hardware drivers
* A root filesystem
* A few system services
* The applications required by the product

Everything else consumes storage, memory, CPU resources, and development time.

This is where the **Yocto Project** becomes useful.

Yocto provides a framework for building customized Linux distributions for embedded systems. Instead of downloading a ready-made Linux distribution and trying to remove everything that is unnecessary, we can describe what our embedded device needs and build an image specifically for that device.

This makes Yocto particularly useful for platforms such as:

* NXP i.MX processors
* Raspberry Pi
* BeagleBone
* TI processors
* STM32MP1
* Custom ARM boards
* Industrial embedded systems
* IoT gateways

In this series, I use Yocto to understand how embedded Linux is assembled and how it can be customized for different hardware platforms.

The examples focus particularly on **NXP i.MX7**, including the **PICO-IMX7**, as well as the **Raspberry Pi 3**.

## What this series covers

- [What is Yocto?](/articles/yocto-project/what-is-yocto/) — Why Yocto is a build system rather than a distribution, and what a customized embedded image actually contains.
- [Buildroot vs Yocto](/articles/yocto-project/buildroot-vs-yocto/) — The alternatives to Yocto, and what each build system optimizes for when choosing between them.
- [Understanding BitBake](/articles/yocto-project/understanding-bitbake/) — The ecosystem around BitBake, how one build target expands into a dependency tree, and the task lifecycle behind every recipe.
- [Understanding Yocto Recipes](/articles/yocto-project/understanding-yocto-recipes/) — Anatomy of a .bb recipe: where the source comes from, how it compiles and where the files are installed.
- [Understanding Yocto Layers](/articles/yocto-project/understanding-yocto-layers/) — Why metadata is split into layers, what a layer may contain, and how a product layer keeps changes separate.
- [Setting up a Yocto Build Environment](/articles/yocto-project/setting-up-a-yocto-build-environment/) — Initialising the build directory, setting MACHINE in local.conf, listing layers in bblayers.conf and building the first image.
- [Building Linux for i.MX7](/articles/yocto-project/building-linux-for-imx7/) — How MACHINE connects the generic build system to an NXP i.MX7 board, and what the first build for that platform looks like.
- [PICO-IMX7 with Yocto](/articles/yocto-project/pico-imx7-with-yocto/) — What a BSP provides for a board like the PICO-IMX7, and how Yocto assembles U-Boot, kernel and root filesystem into a bootable image.
- [Setting up Wi-Fi in Yocto](/articles/yocto-project/setting-up-wifi-in-yocto/) — From the Wi-Fi chip to a network interface: driver, firmware, wpa_supplicant and a bottom-up debugging order.
- [Creating a Custom Yocto Layer](/articles/yocto-project/creating-a-custom-yocto-layer/) — Creating a product layer, and why vendor layers should stay untouched across BSP updates.
- [Adding Applications to a Yocto Image](/articles/yocto-project/adding-applications-to-a-yocto-image/) — Extending an image with packages, writing a recipe for a custom application and enabling its systemd service at boot.
- [Modifying the Linux Kernel](/articles/yocto-project/modifying-the-linux-kernel/) — What the kernel does on an embedded board, and how to patch or extend a vendor recipe with a .bbappend.
- [Understanding Device Trees](/articles/yocto-project/understanding-device-trees/) — How a device tree describes UARTs, I2C, SPI, GPIO, regulators and interrupts to the kernel, and what Yocto deploys with it.
- [Raspberry Pi 3 with Yocto](/articles/yocto-project/raspberry-pi-3-with-yocto/) — The same Yocto concepts on a different board: machine configuration, BSP layers, and what Raspberry Pi is convenient for.
- [Debugging Yocto Builds](/articles/yocto-project/debugging-yocto-builds/) — Reading a large BitBake failure from the first real error, the useful commands, the build directory and the dependency-graph mental model.
- [Building a Production Embedded Linux Image](/articles/yocto-project/building-a-production-embedded-linux-image/) — Reproducible builds, SSTATE caches, CI, common beginner mistakes, a practical workflow and taking a board to a product.

Each part is a self-contained write-up, so read them in order or jump straight to the one you need.
