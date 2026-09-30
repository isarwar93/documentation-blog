---
title: "Source Repository"
description: "Repository link, the two firmware targets and build commands for Touch2USB."
project: "touch2usb"
section: "overview"
order: 2
---

# Source Repository

Touch2USB holds two independent firmware implementations in one repository, because the two use
cases need different USB HID classes.

| Item | Value |
| --- | --- |
| Repository | [isarwar93/Touch2USB](https://github.com/isarwar93/Touch2USB) |
| Clone | `git clone https://github.com/isarwar93/Touch2USB.git` |

## Repository layout

```text
Touch2USB/
├── pico_platformio_touch_mouse/
│   ├── platformio.ini
│   ├── include/
│   ├── src/
│   └── README.md
├── pico_sdk_touch/
│   ├── CMakeLists.txt
│   ├── main.c
│   ├── usb_descriptors.c
│   ├── usb_descriptors.h
│   ├── build/
│   └── README.md
└── README.md
```

## The two targets

| Firmware | Framework | USB class | Coordinates | Host compatibility |
| --- | --- | --- | --- | --- |
| `pico_platformio_touch_mouse` | PlatformIO with Arduino | HID Mouse | relative delta | any OS with a generic HID mouse |
| `pico_sdk_touch` | Pico SDK with TinyUSB | HID Digitizer | absolute | Linux evdev and LVGL, Windows, macOS |

## Building

```bash
# Mouse target, simplest toolchain
cd pico_platformio_touch_mouse
pio run --target upload

# Digitizer target
cd ../pico_sdk_touch
mkdir -p build && cd build
cmake .. && make
```

## Where to look in the code

- `pico_sdk_touch/main.c` holds the SPI reads, the filter chain and the HID report
- `pico_sdk_touch/usb_descriptors.c` holds the digitizer descriptor, see
  [USB HID descriptors](/projects/touch2usb/usb-hid/)
- each target keeps its own copy of the calibration constants, see
  [XPT2046 calibration](/projects/touch2usb/xpt2046/)
