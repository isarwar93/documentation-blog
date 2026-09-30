---
title: "Hardware"
description: "The TMS320F28379D resources this project depends on, and the board details not recorded."
project: "ti-microcontroller-flasher"
section: "architecture"
order: 4
---

# Hardware

This project programs a single device family, the Texas Instruments TMS320F28379D Delfino. This
page lists what the flashing flow runs on, and the device resources it depends on.

## Bill of materials

| Part | Interface | Notes |
| --- | --- | --- |
| TMS320F28379D Delfino target | SCI-A and onboard flash | dual C28x core at 200 MHz |
| Host computer | COM port | Windows or Linux, runs the flasher |
| USB to serial connection | to the device SCI pins | the adapter and the board wiring are not recorded |

## Device resources used by the tooling

| Resource | Detail | Why it matters here |
| --- | --- | --- |
| C28x CPU1 | 200 MHz, 32-bit | receives the flash kernel and the application over SCI |
| C28x CPU2 | 200 MHz, 32-bit | has no external SCI boot pins, so it is started by CPU1 |
| SCI-A | serial boot interface | the transport between the host flasher and the device |
| Onboard flash | 1024 KB in two physical banks | bank 0 runs, bank 1 stages a live update |
| Shared message RAM | CPU1 to CPU2 channel | carries the CPU2 flash kernel and the boot command |
| IPC registers | `IPC_BOOT_STS`, `IPC_COMMAND` | CPU1 signals CPU2 to start programming its sectors |

The device also carries hardware accelerators that this project does not use directly: the
trigonometric math unit, the VCU-II complex-math and CRC unit, and two control law accelerators.

## Flash bank division

| Bank | Contents | Role |
| --- | --- | --- |
| Bank 0 | sectors A to N | the bank the device executes from |
| Bank 1 | mirror partition | holds the staged image during a live update |

Each bank in the repository holds its own pair of images, `SCI_CAN_Interfaces_CPU1` and
`SCI_CAN_Interfaces_CPU2`, so a firmware pair is versioned per bank.

## Host connection

The flasher talks to the device over a serial port. The device must be attached to a COM port and
already be running the SCI boot loader, which is the condition stated in the tool's own README.
The application binary in the repository is the SCI CAN interface pair, which matches the
CAN-bus direction the project description mentions.

## Not recorded

The repository does not document the target board, so these are **unknown**:

- the exact C2000 board or launchpad used, and its SCI pin assignments
- the USB to serial adapter and its driver
- the supply voltage, clock configuration and boot mode switch settings
- the debugger model, if one is used alongside the serial path

The device datasheet and technical reference manual in `TI/documents/` are the authority for the
part itself.
