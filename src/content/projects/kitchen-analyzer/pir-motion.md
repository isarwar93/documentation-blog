---
title: "PIR Motion Sensing & Wakeup"
description: "Motion-based activation and ESP32 EXT0 RTC interrupt configuration."
project: "kitchen-analyzer"
section: "power"
order: 6
---

# PIR Motion Sensor & EXT0 Wakeup

## Human Presence Detection
A passive infrared (PIR) sensor monitors infrared radiation shifts caused by moving human bodies in the kitchen.

## Firmware Detection & Wake Logic
1. **Active Polling:** The sensor's signal is sampled on `GPIO 34`. If `analogRead(PIN_MOTION_SENSOR) > 1000`, active status is confirmed and `lastMotionTime` is refreshed.
2. **RTC Deep Sleep Wakeup:** Before entering deep sleep, the ESP32 configures external interrupt wakeup 0 (EXT0):
```cpp
esp_sleep_enable_ext0_wakeup((gpio_num_t)WAKEUP_PIN, 1); // Trigger wake on HIGH logic level
```
This enables the RTC controller to restart the processor immediately when someone enters the kitchen.
