---
title: "Host SCI Flasher Tool (`serial_flash_programmer`)"
description: "C++ cross-platform host programmer utility, packet structure, and CLI usage."
project: "ti-microcontroller-flasher"
section: "flashing"
order: 4
---

# Host SCI Flasher Utility

The host utility located in `TI/sci_flasher/` is a high-speed C++ flashing tool compatible with both Linux and Windows.

## Building the Tool with CMake
```bash
cd TI/sci_flasher
mkdir -p build && cd build
cmake ..
make -j$(nproc)
```

## Command Line Invocation
```bash
./serial_flash_programmer \
  -d f2837xD \
  -k F2837xD_sci_flash_kernels_cpu01.txt \
  -a firmware_cpu1.txt \
  -p /dev/ttyUSB0 \
  -b 115200
```

## Communication Protocol
- **Auto-Baud Handshake:** Host transmits character `'A'` repeatedly until the MCU boot ROM locks phase-locked loops and echoes the character back.
- **Checksum Verification:** Every packet payload is protected by a 16-bit summation checksum to guard against transmission noise over noisy industrial serial buses.
