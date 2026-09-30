---
title: "Source Repository"
description: "Repository link, TI folder layout, device documents and the CCS coding theme."
project: "ti-microcontroller-flasher"
section: "overview"
order: 2
---

# Source Repository

The repository holds the flashing tooling, the reference documents and a Code Composer Studio
theme for the TMS320F28379D.

| Item | Value |
| --- | --- |
| Repository | [isarwar93/TI-Microcontroller-Flasher](https://github.com/isarwar93/TI-Microcontroller-Flasher) |
| Clone | `git clone https://github.com/isarwar93/TI-Microcontroller-Flasher.git` |
| Platform | Windows and Linux, C++ and shell |

## Repository layout

```text
TI-Microcontroller-Flasher/
├── TI/
│   ├── sci_flasher/    host flasher, serial_flash_programmer
│   │   ├── serial_flash_programmer.cpp
│   │   ├── CMakeLists.txt, CMake/
│   │   ├── include/, source/, utils/
│   │   ├── linux_macros.h
│   │   └── serial_flash_programmer.vcxproj   Visual Studio project
│   ├── scripts/        flash kernel and firmware build scripts
│   │   ├── 2_cp_flash_kernel.sh
│   │   ├── bank_change_flash.py
│   │   ├── firmware_builder.sh
│   │   ├── firmware_builder_cpu2.sh
│   │   ├── F2837xD_sci_flash_kernels_cpu01.txt
│   │   ├── F2837xD_sci_flash_kernels_cpu02.txt
│   │   ├── blinky_dc_cpu01.txt
│   ├── FLASH_BANK_0/   binaries for bank 0
│   ├── FLASH_BANK_1/   binaries for bank 1
│   ├── Bootloader/
│   │   └── Smallbootloader
│   └── documents/      vendor reference PDFs
└── coding_theme/       Code Composer Studio theme
```

## Reference documents

`TI/documents/` keeps the vendor documentation this project is built on:

| Document | Used for |
| --- | --- |
| `tms320f28379d_datasheet.pdf` | device pinout, memory and peripherals |
| `technical_reference_manual.pdf` | peripheral behaviour |
| `flash_apis.pdf` | flash API used by the kernel |
| `sciflashing.pdf` | serial flashing procedure |
| `live_device_firmware_update.pdf` | live update flow |
| `live_firmware_update_without_reset.pdf` | update without a reset |
| `module_overview.pdf` | module level overview |
| `can_bus.pdf` | CAN-bus expansion work |
| `spruhm8k.pdf` | C2000 memory and resource guide |
| `C2000Ware_v5.02.00.00_Release_Notes.pdf` | toolchain version notes |
| `C2000 MCU 1-Day Workshop - C28x_Microcontroller_ODW_4-2.pdf` | workshop material |

## The coding theme

`coding_theme/` is a drop-in Eclipse theme for Code Composer Studio. It ships the theme
definition, the Spectrum and Eclipse colour theme jars, and the mappings and schemas the editor
needs. See [CCS coding theme](/projects/ti-microcontroller-flasher/ccs-theme/).
