---
title: "Firmware Build & Architecture"
description: "PlatformIO configuration, library dependencies, and build instructions."
project: "kitchen-analyzer"
section: "firmware"
order: 9
---

# Firmware & PlatformIO Build

## Project Structure
```text
kitchenAnalyzer/
├── include/
│   └── config.h         # Hardware pin definitions & timeouts
├── src/
│   └── main.cpp         # Main setup, loop, sensing, and sleep logic
└── platformio.ini       # PlatformIO configuration
```

## PlatformIO Configuration (`platformio.ini`)
```ini
[env:lolin32]
platform = espressif32
board = lolin32
framework = arduino
lib_deps = 
    liquidcrystal_i2c
    adafruit/DHT sensor library@^1.4.4
    https://github.com/miguel5612/MQSensorsLib.git
```

## Compilation & Upload
```bash
# Build firmware
pio run

# Flash to ESP32 board
pio run --target upload

# Monitor serial output
pio device monitor -b 115200
```
