---
title: "PlatformIO Arduino Mouse Target"
description: "Arduino-Pico core, PlatformIO environment, and relative mouse emulation."
project: "touch2usb"
section: "platformio"
order: 6
---

# PlatformIO Arduino Mouse Target

The `pico_platformio_touch_mouse` target uses the community-standard **Arduino-Pico** (`earlephilhower`) core via PlatformIO.

## `platformio.ini` Configuration
```ini
[env:raspberry-pi-pico]
platform = https://github.com/maxgerhardt/platform-raspberrypi.git
board = pico
framework = arduino
board_build.core = earlephilhower
monitor_speed = 115200
```

## Compilation and Flashing

```bash
cd pico_platformio_touch_mouse

# Build firmware binary (.uf2)
pio run

# Automatic flash (with Pico in BOOTSEL mode)
pio run --target upload
```

The compiled UF2 is placed in `.pio/build/raspberry-pi-pico/firmware.uf2`.

## Behavior & Feedback
- On first contact, the cursor smoothly synchronizes with screen bounds.
- Moving fingers generate relative velocity vectors sent to the host via `Mouse.move(dx, dy)`.
- The onboard LED on `GPIO 25` dynamically dims via hardware PWM when pressure is applied, giving physical feedback to the user.
