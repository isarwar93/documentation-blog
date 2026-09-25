---
title: "Touch2USB: RP2040 Resistive Touch to USB HID Bridge"
description: "Hardware bridge translating XPT2046 SPI resistive touch inputs into USB HID mouse and digitizer protocols."
project: "touch2usb"
section: "overview"
order: 1
---

# Touch2USB: RP2040 Touch to USB HID

**Touch2USB** is an open-source embedded bridge firmware for the Raspberry Pi Pico (RP2040) microcontroller. It interfaces with an XPT2046 resistive touch controller over SPI and converts 12-bit analog touch coordinates into driverless USB HID input reports.

The repository provides two distinct firmware architectures tailored to different operating systems and display use cases:

```text
Touch2USB/
├── pico_platformio_touch_mouse/   # USB HID Mouse (relative movement) via PlatformIO & Arduino
└── pico_sdk_touch/               # USB HID Digitizer (absolute touch) via Pico SDK & TinyUSB
```

## Architectural Comparison

| Feature | `pico_platformio_touch_mouse` | `pico_sdk_touch` |
| :--- | :--- | :--- |
| **Framework** | PlatformIO / Arduino-Pico Core | Native Pico SDK + TinyUSB |
| **USB Device Class** | Standard HID Mouse | HID Single-Touch Digitizer |
| **Coordinate Mode** | Relative deltas (`Mouse.move(dx, dy)`) | Absolute coordinates ($0 \le X \le 799$, $0 \le Y \le 479$) |
| **Primary Target** | Desktop OS (Linux, Windows, macOS) | Embedded Linux (LVGL, evdev, libinput, kiosk) |
| **Signal Filtering** | Averaging + 10px Jitter Threshold | 5-Sample Median + Exponential Moving Average (EMA) |
| **Build System** | `pio run` | `cmake` + `make` / `ninja` |

## Hardware Bill of Materials
- **Microcontroller:** Raspberry Pi Pico (RP2040 dual ARM Cortex-M0+ @ 133 MHz)
- **Touch Controller:** XPT2046 4-Wire Resistive Touch Controller
- **Panel Compatibility:** Standard 4-wire resistive touch overlays (3.5", 4.3", 5.0", 7.0")
- **Interface:** USB Micro-B (5V power & USB 1.1 Full Speed 12 Mbps)
