---
title: "Overview"
description: "RP2040 bridge turning an XPT2046 resistive panel into a USB HID mouse or touchscreen."
project: "touch2usb"
section: "overview"
order: 1
---

# Overview

Firmware for the Raspberry Pi Pico that reads an XPT2046 resistive touch controller over SPI and
republishes the touch as a native USB HID device, so no host driver is needed.

## Core features

- **Two USB classes from one board**: an HID mouse for desktops, or a HID digitizer for touchscreens
- **Driverless on every host**: Linux, Windows and macOS see an ordinary input device
- **12-bit touch reads** over SPI0 at 1 MHz, mode 0
- **Calibrated coordinates** mapped from raw ADC values to the panel's screen range
- **Noise rejection**: median filter, moving average, jitter threshold and a release guard
- **Optional UART telemetry** on GPIO 0 at 115200 baud for calibration

## In this project

| Chapter | What it covers |
| --- | --- |
| [Source repository](/projects/touch2usb/git-repository/) | repository link, both targets, build commands |
| [Hardware interfacing and signal flow](/projects/touch2usb/architecture/) | block diagram and the SPI path |
| [Hardware](/projects/touch2usb/hardware/) | bill of materials, pin map, calibration constants |
| [XPT2046 controller and calibration](/projects/touch2usb/xpt2046/) | reads, coordinate mapping, how to recalibrate |
| [USB HID descriptors](/projects/touch2usb/usb-hid/) | mouse against digitizer, and host behaviour |
| [Software](/projects/touch2usb/software/) | both implementations and how to choose one |
| [Signal filtering and noise suppression](/projects/touch2usb/pico-sdk/) | the four-stage filter chain |
| [PlatformIO Arduino mouse target](/projects/touch2usb/platformio/) | the simpler of the two builds |
| [Results](/projects/touch2usb/results/) | what each target achieves, and known figures |
| [Diagnostics and serial debugging](/projects/touch2usb/common-problems/) | UART output and troubleshooting |
