---
title: "Low-Power & Deep Sleep Architecture"
description: "Energy preservation strategies, current consumption minimization, and battery lifecycle."
project: "kitchen-analyzer"
section: "implementation"
order: 10
---

# Low-Power & Deep Sleep Architecture

## Energy Consumption Profile
In standard active mode, the ESP32 with LCD backlight draws approximately 80–120 mA. Operating continuously on a 2000 mAh LiPo battery would drain the device in less than a day.

## Deep Sleep Strategy
Kitchen occupancy is intermittent. The device employs a strict power budget:
1. When motion stops, a 20-second countdown initiates (`NO_MOTION_TIMEOUT_S = 20`).
2. When the timer expires:
   - LCD backlight is deactivated: `lcd.noBacklight()`.
   - ESP32 enters deep sleep: `esp_deep_sleep_start()`.
3. In deep sleep mode:
   - The main dual-core CPU is completely powered down.
   - High-speed peripherals are turned off.
   - Current draw drops into microamps (~10–15 µA for RTC domain).
   - Only the PIR sensor and RTC wakeup pin (`GPIO 34`) remain energized.
