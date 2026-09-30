---
title: "Results"
description: "What the flashing toolchain does today, the known payload figures, and what is unverified."
project: "ti-microcontroller-flasher"
section: "outcome"
order: 9
---

# Results

The toolchain is assembled and the payloads are in the repository. This page records what is
confirmed and what still needs a board to verify.

## Confirmed

| Item | State |
| --- | --- |
| Host flasher builds on CMake and on Visual Studio | source present, `linux_macros.h` included for Linux |
| Device support covers f2837xD | listed in the tool's own parameter list |
| CPU1 and CPU2 flash kernels | `F2837xD_sci_flash_kernels_cpu01.txt` and `..._cpu02.txt` |
| Application payloads for both cores | `SCI_CAN_Interfaces_CPU1` and `..._CPU2`, per flash bank |
| Example payload to prove the flow | `blinky_dc_cpu01.txt` |
| Bank switching script | `bank_change_flash.py` |
| Small bootloader source | `Bootloader/Smallbootloader/` |

## Known figures

| Figure | Value | Source |
| --- | --- | --- |
| Onboard flash | 1024 KB across two banks | architecture notes |
| Core clock | 200 MHz per C28x core | architecture notes |
| Example baud rate | 9600 | the tool's README example |
| CPU1 flash kernel payload | 716 lines of hex | the payload file |
| Payload sync word | `AA 08` | the first two bytes of every payload |

## Not verified

The repository contains no captured session output, so the following are **unknown**:

- a successful end-to-end flash on hardware, and the elapsed time it took
- whether the dual-core sequence, that is kernel then application for CPU1 and CPU2, completed on
  a real device
- measured flash and erase times per sector
- the behaviour of a live update across banks on a running device
- CAN-bus behaviour of the flashed application

Verifying these needs the board attached to a COM port with the SCI boot loader running, which is
the precondition the tool documents. Until a session is captured, the numbers stay unknown rather
than estimated.
