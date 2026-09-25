---
title: "TMS320F28379D Dual-Core Architecture"
description: "Delfino C28x dual-core MCU, IPC registers, and flash memory bank division."
project: "ti-microcontroller-flasher"
section: "architecture"
order: 2
---

# TMS320F28379D Dual-Core Architecture

The Texas Instruments **TMS320F28379D Delfino™** MCU is an ultra-high performance dual-core 32-bit microcontroller engineered for advanced industrial drives, solar inverters, and digital power supplies.

## Core Processing Engines
- **CPU1 & CPU2:** Dual independent 200 MHz C28x 32-bit DSP cores.
- **Trigonometric Math Units (TMU):** Hardware accelerators for sine, cosine, arctan, and 1/x calculations.
- **Viterbi, Complex Math, and CRC (VCU-II):** Hardware accelerators for signal processing and communications.
- **Control Law Accelerators (CLA):** Dual independent 32-bit floating-point math co-processors operating asynchronously from the main cores.

## Memory Architecture & Flash Banks
The microcontroller contains 1024 KB (1 MB) of onboard flash organized into two physical banks:
- **Flash Bank 0:** Sectors A through N.
- **Flash Bank 1:** Mirror partition enabling live firmware staging while the active core executes out of Bank 0.

## Inter-Processor Communication (IPC)
Because CPU2 has no direct physical external SCI boot pins, CPU1 acts as the master host coordinator:
1. CPU1 receives kernel and application binaries over the primary SCI-A interface.
2. CPU1 transfers the CPU2 flash kernel into shared message RAM using hardware IPC registers (`IPC_BOOT_STS`, `IPC_COMMAND`).
3. CPU1 triggers an IPC interrupt to signal CPU2 to boot and program its local Flash sectors.
