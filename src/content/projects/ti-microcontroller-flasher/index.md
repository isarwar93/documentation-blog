---
title: "TI TMS320F28379D Microcontroller Flasher & Bootloader"
description: "Firmware flashing toolchain, dual-core architecture, and Code Composer Studio themes for the TI C2000 family."
project: "ti-microcontroller-flasher"
section: "overview"
order: 1
---

# TI Microcontroller Flasher

The **TI Microcontroller Flasher** project provides a complete programming, flashing, and bootloader toolchain for Texas Instruments **C2000 TMS320F28379D** dual-core 32-bit floating-point microcontrollers.

```text
TI-Microcontroller-Flasher/
├── TI/
│   ├── sci_flasher/          # Host-side C++ serial flash programmer utility
│   ├── scripts/              # Automated dual-core flashing & bank-switching scripts
│   ├── Bootloader/           # Secondary bootloader executing from RAM/Flash
│   ├── FLASH_BANK_0/         # Bank 0 firmware images & CPU1/CPU2 interfaces
│   ├── FLASH_BANK_1/         # Bank 1 firmware images for zero-downtime bank swap
│   └── documents/            # Technical reference manuals & flash API specs
└── coding_theme/             # Modern VS Code-like dark theme for Code Composer Studio
```

## System Capabilities
- **Dual-Core Flash Coordination:** Synchronized flashing and booting of both CPU1 and CPU2 over a single Serial Communications Interface (SCI).
- **Dual-Bank Live Updating:** Support for switching execution between Flash Bank 0 and Bank 1 to allow live firmware updates without prolonged device downtime.
- **Host Flashing CLI:** Cross-platform C++ serial flash programmer utility (`serial_flash_programmer`) running on Linux and Windows.
- **Enhanced IDE Developer Experience:** High-contrast, modern editor themes for Code Composer Studio (CCS).
