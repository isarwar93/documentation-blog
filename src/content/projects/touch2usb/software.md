---
title: "Software"
description: "The two firmware implementations, the shared signal processing pipeline, and how to choose between them."
project: "touch2usb"
section: "architecture"
order: 7
---

# Software

The repository ships two firmware builds from the same hardware. They differ in the USB HID class
they present, which is the only thing that decides where they work.

## Choosing a target

Use `pico_platformio_touch_mouse` when:

- the host application expects a standard USB mouse
- relative movement is acceptable or preferred
- you want the simplest possible build environment, since PlatformIO handles the toolchain

Use `pico_sdk_touch` when:

- the host runs LVGL through the evdev or libinput backend and needs a real touchscreen device
- absolute coordinates are required, for a kiosk, an embedded HMI or a drawing tablet
- the HID descriptor needs full control

## The two implementations

| | `pico_platformio_touch_mouse` | `pico_sdk_touch` |
| --- | --- | --- |
| Framework | PlatformIO, Arduino core | Pico SDK with TinyUSB |
| Language | C++ | C |
| USB class | HID Mouse | HID Digitizer |
| Coordinates | relative delta | absolute |
| Sources | `src/`, `include/`, `platformio.ini` | `main.c`, `usb_descriptors.c` |

## Signal processing

Resistive panels are electrically noisy, so the readings are cleaned before they reach the host.
The Pico SDK digitizer build has the fuller pipeline:

1. **5-sample median filter**, which removes single-sample spikes before anything else runs
2. **exponential moving average**, low-pass filtering the mapped coordinates to smooth motion
   while staying responsive
3. **jitter suppression threshold**, which suppresses HID reports when the smoothed position has
   not moved meaningfully, so a held contact does not tremble
4. **release guard timer**, which debounces PENIRQ on lift-off so a drag does not end early

The mouse build keeps a smaller filter, since a relative cursor tolerates more noise than an
absolute digitizer does. See
[Signal filtering](/projects/touch2usb/pico-sdk/) and
[USB HID descriptors](/projects/touch2usb/usb-hid/).

## Build commands

```bash
# PlatformIO mouse target
cd pico_platformio_touch_mouse && pio run --target upload

# Pico SDK digitizer target
cd ../pico_sdk_touch && mkdir -p build && cd build && cmake .. && make
```

Both targets read the calibration constants from their own source file, so a panel change means
editing both.
