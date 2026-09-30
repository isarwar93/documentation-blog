---
title: "Source Repository"
description: "Repository link, layout and build commands for the Kitchen Analyzer firmware."
project: "kitchen-analyzer"
section: "overview"
order: 2
---

# Source Repository

The firmware lives in a public repository next to this documentation.

| Item | Value |
| --- | --- |
| Repository | [isarwar93/kitchenAnalyzer](https://github.com/isarwar93/kitchenAnalyzer) |
| Clone | `git clone https://github.com/isarwar93/kitchenAnalyzer.git` |
| Platform | PlatformIO, `espressif32` platform |
| Board | `lolin32` (ESP32) |
| Framework | Arduino |

## Repository layout

```text
kitchenAnalyzer/
├── include/
│   ├── config.h        pin macros and device configuration
│   └── README          placeholder kept for the include folder
├── src/
│   └── main.cpp        the whole device firmware
├── lib/
│   └── README          placeholder for project-local libraries
├── test/
├── platformio.ini      board, framework and library dependencies
└── README.md
```

The firmware is small on purpose. Almost all behaviour lives in `src/main.cpp`, and every pin
number lives in `include/config.h`, so a board change is a one-file edit. See the
[Software](/projects/kitchen-analyzer/software/) chapter.

## Library dependencies

`platformio.ini` pulls three libraries:

| Dependency | Purpose |
| --- | --- |
| `liquidcrystal_i2c` | drives the 16x2 I2C LCD through its PCF8574 backpack |
| `adafruit/DHT sensor library@^1.4.4` | reads the DHT22 temperature and humidity sensor |
| `https://github.com/miguel5612/MQSensorsLib.git` | reads the MQ-2 gas sensor |

## Building and flashing

```bash
cd kitchenAnalyzer
python3 -m venv .venv && source .venv/bin/activate
pip install platformio
pio run                 # build only
pio run --target upload # build, flash and reset
```

PlatformIO installs the ESP32 toolchain on first run, so no separate IDE setup is needed.
