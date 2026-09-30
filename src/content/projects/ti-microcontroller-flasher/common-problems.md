---
title: "Common Problems"
description: "Constraints of the C2000 serial boot flow and the pitfalls this repository already hits."
project: "ti-microcontroller-flasher"
section: "outcome"
order: 10
---

# Common Problems

Most of the friction in this project comes from two device constraints: how the second core boots,
and where the flash kernel has to run from.

## CPU2 cannot be booted over SCI directly

CPU2 has no physical SCI boot pins, so the host flasher cannot reach it on its own. CPU1 has to act
as the coordinator:

1. CPU1 receives both payloads over SCI-A.
2. CPU1 copies the CPU2 flash kernel into shared message RAM.
3. CPU1 writes the IPC registers, `IPC_BOOT_STS` and `IPC_COMMAND`.
4. CPU1 raises an IPC interrupt, and CPU2 boots and programs its own sectors.

This is why the flasher has separate `-m` and `-n` options, and why both flash kernels are needed
for any dual-core run. Flashing only CPU1 works; flashing only CPU2 does not.

## The flash kernel must be copied before it can run

The device is in SCI boot mode, so on-chip flash cannot be read while the kernel needs it. The
kernel has to be staged in RAM first, which is what the `2_cp_flash_kernel.sh` step exists for.
Skipping that step leaves the device unable to program itself.

## The staging script has hard-coded absolute paths

`scripts/2_cp_flash_kernel.sh` currently copies between two absolute paths on one machine:

```bash
cp /home/ismail/IOT-CANBus/TI/FLASH_BANK1/SCI_CAN_Interfaces_CPU1/CPU1_FLASH/SCI_CAN_Interfaces_CPU1.txt \
   /home/ismail/dual_CPU/script/firmware_cpu1.txt
```

On any other machine both paths are missing, so the script fails immediately. It needs to take the
source and destination as arguments or use paths relative to the repository before it can be part
of a repeatable flow.

## Flashing the bank that is running

Code cannot rewrite the flash pages it is executing from. An update therefore has to go into the
inactive bank, and the device only runs the new image after the bank switch, which is what
`bank_change_flash.py` performs. Writing both banks from one session is fine; overwriting the
active bank in place is not.

## The device must already be in SCI boot mode

The flasher's README states the precondition plainly: the microcontroller must be attached to a
COM port **and** must be running the SCI boot loader. A device that boots its own application will
simply not answer, and the tool then appears to hang with no error, since the flow starts by
waiting for the ROM's sync word.

## Payloads must be in SCI boot format

The tool does not accept a raw binary or an ELF file. Every `-k`, `-a`, `-m` and `-n` argument must
be a text file of hex bytes in SCI boot format. Converting an ELF into that layout is a separate
step, which is what the firmware builder scripts are for.
