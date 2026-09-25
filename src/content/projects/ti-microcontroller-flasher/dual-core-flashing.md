---
title: "Synchronized Dual-Core Flashing"
description: "Kernel injection, CPU1-to-CPU2 IPC synchronization, and bank switching."
project: "ti-microcontroller-flasher"
section: "flashing"
order: 3
---

# Synchronized Dual-Core Flashing

Programming both cores of the TMS320F28379D requires a carefully choreographed sequence across host software, CPU1, and CPU2.

```text
[ Host Machine ] (serial_flash_programmer)
      │
      │ 1. Download CPU1 Flash Kernel into CPU1 RAM via SCI
      v
[ CPU1 RAM ] ──(Starts executing Flash Kernel)
      │
      │ 2. Download CPU2 Flash Kernel into shared Message RAM
      v
[ Shared RAM ]
      │
      │ 3. CPU1 triggers IPC interrupt to boot CPU2
      v
[ CPU2 RAM ] ──(Starts executing Flash Kernel)
      │
      │ 4. Stream CPU1 Application Binary ──> Programs Bank 0 / 1 (CPU1)
      │ 5. Stream CPU2 Application Binary ──> Programs Bank 0 / 1 (CPU2)
      v
[ Verification & Reset ]
```

## Flashing Automation Scripts
The repository includes dedicated automation scripts under `TI/scripts/`:
- `serial_flash_bank0.sh`: Flashes kernel and application images into Bank 0 partitions.
- `serial_flash_bank1.sh`: Flashes images into alternate Bank 1 partitions for zero-risk updates.
- `bank_change_flash.py`: Configures the Flash configuration registers to swap active boot execution between banks.
