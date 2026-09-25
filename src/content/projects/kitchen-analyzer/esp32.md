---
title: "ESP32 LOLIN32 & Pin Configuration"
description: "Hardware pin mapping, GPIO allocation, and board configuration."
project: "kitchen-analyzer"
section: "hardware"
order: 3
---

# ESP32 LOLIN32 Hardware Configuration

The system uses the ESP32 LOLIN32 board due to its integrated LiPo battery management circuitry, low-power sleep modes, and flexible GPIO multiplexing.

## Pinout Mapping

| Signal Name | Macro in `config.h` | GPIO | Function | Description |
| :--- | :--- | :--- | :--- | :--- |
| Gas Sensor Analog | `PIN_GAS_SENSOR` | `GPIO 32` | ADC1_CH4 | Analog voltage readout from MQ-2 sensor |
| Temperature / Humidity | `PIN_TEMP_HUM_SENSOR` | `GPIO 13` | Digital I/O | Single-bus data line for DHT22 |
| PIR Motion Sensor | `PIN_MOTION_SENSOR` | `GPIO 34` | GPI / EXT0 | Input-only pin; active-high motion & wake trigger |
| Status LED | `PIN_LED` | `GPIO 22` | Output | Visual status indicator |
| LCD I2C SDA | `LCD_SDA_PIN` | `GPIO 17` | Open-Drain | Custom Software/Hardware I2C Data bus |
| LCD I2C SCL | `LCD_SCL_PIN` | `GPIO 19` | Open-Drain | Custom Software/Hardware I2C Clock bus |
