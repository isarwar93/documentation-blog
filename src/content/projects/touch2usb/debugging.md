---
title: "Diagnostics & Serial Debugging"
description: "UART0 telemetry monitoring at 115200 baud, terminal tools, and troubleshooting."
project: "touch2usb"
section: "debugging"
order: 7
---

# Diagnostics & Serial Debugging

## Real-Time UART Telemetry
The firmware streams raw and mapped coordinate data over **UART0 TX** on `GPIO 0` at 115200 8N1.

```bash
# Connect with tio, minicom, or screen
tio /dev/ttyUSB0 -b 115200
```

Example debug output:
```text
[TOUCH ACTIVE] RawX: 1842, RawY: 2210 -> ScreenX: 412, ScreenY: 248 [EMA Smooth]
[TOUCH ACTIVE] RawX: 1840, RawY: 2214 -> ScreenX: 412, ScreenY: 248 [Deadband HOLD]
[TOUCH LIFT] Releasing contact, timer started.
```

## Troubleshooting Matrix

| Symptom | Root Cause | Solution |
| :--- | :--- | :--- |
| **No touch response on host** | SPI chip select wiring or reversed MOSI/MISO | Verify Pico `GPIO 16` to `DOUT` and `GPIO 19` to `DIN`. Check `GPIO 17` (`CS`). |
| **Cursor jumps to corners erratically** | Calibration limits inverted or ADC noise | Invert `X_MIN`/`X_MAX` in code or increase median filter window size. |
| **Cursor stutters when finger held still** | Jitter deadband threshold too low | Increase the minimum pixel delta threshold (`abs(dx) >= 10`). |
| **Host does not recognize USB device** | Micro-USB cable is power-only | Replace with a certified data cable. |
