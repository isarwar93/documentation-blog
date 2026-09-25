---
title: "System Architecture"
description: "Hardware interfacing, operational state machine, and communication architecture."
project: "kitchen-analyzer"
section: "architecture"
order: 2
---

# System Architecture

## Block Diagram

```text
               +-------------------------------------------+
               |             ESP32 LOLIN32 MCU             |
               |                                           |
 [PIR Sensor] ----> GPIO 34 (EXT0 / ADC)                   |
 [MQ-2 Gas]   ----> GPIO 32 (ADC1_CH4)                     |
 [DHT22 Temp] <---> GPIO 13 (1-Wire Bidirectional)         |
 [Status LED] <---- GPIO 22 (Digital Out)                  |
               |                                           |
               |   I2C Controller (GPIO 17 SDA / 19 SCL)   |
               +---------------------+---------------------+
                                     |
                                     v
                       +---------------------------+
                       |   16x2 I2C LCD (0x27)     |
                       |  (PCF8574 I/O Expander)   |
                       +---------------------------+
```

## Operational State Machine
1. **DEEP SLEEP:** CPU and peripherals are unpowered. RTC controller listens on GPIO 34 (`ext0` high level).
2. **WAKE & INITIALIZE:** PIR detects movement. MCU boots, configures I2C, initializes LCD backlight, calibrates MQ-2 sensor, and queries DHT22.
3. **ACTIVE SENSING LOOP:** Every 1,000 ms, sensor values are read, formatted, and written to the 16x2 LCD. The 20-second countdown timer resets upon motion.
4. **TIMEOUT & SLEEP PREPARATION:** If no motion is detected for 20 seconds, LCD backlight is turned off, EXT0 interrupt is armed, and deep sleep is entered.
