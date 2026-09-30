---
title: "Software"
description: "The host flasher, the payload format it expects, the build scripts, and the bootloader source."
project: "ti-microcontroller-flasher"
section: "architecture"
order: 5
---

# Software

The project is a set of tools rather than an application. It contains the host flasher, the
scripts that prepare payloads, and the bootloader source.

## The host flasher

`sci_flasher/` holds TI's serial flash programmer example package, built from
`serial_flash_programmer.cpp`.

| Item | Detail |
| --- | --- |
| Language | C++ |
| Build | CMake out-of-source, plus a Visual Studio project for Windows |
| Portability | `linux_macros.h` keeps the Windows types available on Linux |
| Device support | f2802x, f2803x, f2805x, f2806x, f2837xD, f2837xS, f2807x |

### Command line

```text
serial_flash_programmer -d <device> -k <kernel> -f <filename> -p COM<num>
                        [-m] <kernel name> [-n] <filename> [-b] <baudrate>
                        [-q] [-w] [-v]
```

| Option | Meaning |
| --- | --- |
| `-d` | device to load, for example `f2837xD` |
| `-k` | flash kernel file, in SCI boot format |
| `-f` / `-a` | file to download, in SCI boot format |
| `-m` | CPU2 flash kernel, for dual-core operations |
| `-n` | CPU2 file to download, for dual-core operations |
| `-p` | COM port |
| `-b` | baud rate |
| `-q`, `-w`, `-v` | quiet, wait for a key press, verbose |

The example given in the tool's README:

```bash
serial_flash_programmer -d f2837xD \
  -k F2837xD_sci_flash_kernels_cpu01.txt \
  -a blinky_cpu01.txt \
  -b 9600 -p COM7
```

## The payload format

Every `.txt` payload is a text file of space separated hexadecimal bytes in TI's SCI boot format.
Each file opens with the `AA 08` sync word, followed by 22-bit address records and 16-bit data
words. The tool parses the text directly, so a payload can be inspected and diffed in a normal
editor.

| Payload | Role |
| --- | --- |
| `F2837xD_sci_flash_kernels_cpu01.txt` | CPU1 flash kernel, 716 lines |
| `F2837xD_sci_flash_kernels_cpu02.txt` | CPU2 flash kernel |
| `blinky_dc_cpu01.txt` | example application used to prove the flow |

## Scripts

| Script | Purpose |
| --- | --- |
| `firmware_builder.sh` | builds the CPU1 image |
| `firmware_builder_cpu2.sh` | builds the CPU2 image |
| `2_cp_flash_kernel.sh` | stages a firmware file for the flash kernel step |
| `bank_change_flash.py` | switches the active flash bank |

## Bootloader source

`Bootloader/Smallbootloader/` is a CCS project with `assembly/`, `headers/`, `linker/`, `src/`
and `targetConfigs/`, that is a small bootloader rather than a full application.
