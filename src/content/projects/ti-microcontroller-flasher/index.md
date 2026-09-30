---
title: "Overview"
description: "Flashing toolchain for the TI C2000 TMS320F28379D dual-core MCU, with bootloader and CCS theme."
project: "ti-microcontroller-flasher"
section: "overview"
order: 1
---

# Overview

A programming and flashing toolchain for the Texas Instruments C2000 TMS320F28379D dual-core
microcontroller: a host-side serial flash programmer, the scripts that drive a dual-core flash, a
small bootloader, and a Code Composer Studio theme.

## Core features

- **Dual-core flashing** of CPU1 and CPU2 over a single SCI link, coordinated through IPC
- **Dual-bank live update**: the image is staged in the inactive bank and switched in, so the
  device does not stop for a long reflash
- **Host flash programmer** written in C++, building with CMake or Visual Studio, on Linux and
  Windows
- **Ready-made payloads** in TI's SCI boot format for both cores and both banks
- **Small bootloader** project that can be built and linked in Code Composer Studio
- **Modern CCS theme**, a drop-in VS Code-like colour scheme for the editor

## In this project

| Chapter | What it covers |
| --- | --- |
| [Source repository](/projects/ti-microcontroller-flasher/git-repository/) | repository link, folder layout, device documents |
| [Dual-core architecture](/projects/ti-microcontroller-flasher/architecture/) | block diagram, cores, flash banks, IPC |
| [Hardware](/projects/ti-microcontroller-flasher/hardware/) | the device resources the flow depends on |
| [Software](/projects/ti-microcontroller-flasher/software/) | the flasher, its flags, the payload format |
| [Host SCI flasher tool](/projects/ti-microcontroller-flasher/flashing/) | `serial_flash_programmer` in practice |
| [Synchronized dual-core flashing](/projects/ti-microcontroller-flasher/dual-core-flashing/) | kernel staging and the CPU2 handover |
| [CCS modern coding theme](/projects/ti-microcontroller-flasher/ccs-theme/) | installing the theme in Code Composer Studio |
| [Results](/projects/ti-microcontroller-flasher/results/) | what the toolchain does, and what is unverified |
| [Common problems](/projects/ti-microcontroller-flasher/common-problems/) | boot constraints and the pitfalls that bite |
