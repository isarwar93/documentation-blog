---
title: "USB HID Descriptors: Mouse vs. Digitizer"
description: "USB report descriptor anatomy, HID usage tables, and operating system enumeration."
project: "touch2usb"
section: "usb-hid"
order: 4
---

# USB HID Descriptors: Mouse vs Digitizer

The RP2040 presents two distinct USB device personalities depending on which firmware is flashed.

## 1. HID Mouse Mode (`pico_platformio_touch_mouse`)
In mouse mode, the Pico exposes a standard 3-byte or 4-byte relative mouse HID descriptor:
- **Usage Page:** Generic Desktop (`0x01`)
- **Usage:** Mouse (`0x02`)
- **Report Contents:**
  - Byte 0: Buttons (Bit 0: Left Click / Touch Active)
  - Byte 1: X displacement ($\Delta X$, signed 8-bit integer)
  - Byte 2: Y displacement ($\Delta Y$, signed 8-bit integer)
  - Byte 3: Wheel (optional)

When finger dragging occurs, the firmware calculates relative offset deltas:
$$\Delta X = X_{\text{current}} - X_{\text{previous}}$$
and issues `Mouse.move(dx, dy)`.

## 2. HID Digitizer Mode (`pico_sdk_touch`)
In digitizer mode, the device registers as a single-touch integrated touchscreen:
- **Usage Page:** Digitizers (`0x0D`)
- **Usage:** Touch Screen (`0x04`)
- **Report Contents:**
  - Tip Switch (Contact state: In Contact / Released)
  - In-Range flag
  - Absolute X coordinate (`0x0000` to `0x031F` for 800px)
  - Absolute Y coordinate (`0x0000` to `0x01DF` for 480px)

This mode allows modern Linux desktop window managers (Wayland, X11) and embedded GUI stacks (LVGL) to process direct touch inputs at the exact finger coordinates without needing mouse emulation or software calibration overlays.
