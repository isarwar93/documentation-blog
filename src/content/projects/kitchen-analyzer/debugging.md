---
title: "Diagnostics & Debugging Guide"
description: "Serial logs, sensor verification procedures, and hardware troubleshooting."
project: "kitchen-analyzer"
section: "debugging"
order: 10
---

# Diagnostics & Debugging Guide

## Serial Console Output
The firmware emits status information at 115200 baud during boot and sensor read cycles:

```text
Kitchen Analyzer starting...
DHT sensor initialized
MQ2 sensor initialized
I2C initialized with custom pins
Wake up configured on motion sensor pin and timer
LCD initialized
Setup complete
Motion sensor: HIGH
Gas: 120.45, Temp: 23.60, Hum: 45.20
LCD updated with sensor values
```

## Troubleshooting Matrix

| Issue | Potential Cause | Verification / Solution |
| :--- | :--- | :--- |
| **"Sensor Error" on LCD** | DHT22 disconnected or pull-up missing | Check wiring on `GPIO 13`, verify 3.3V supply and 10k pullup resistor if module lacks one. |
| **LCD displays blank rectangles** | Incorrect I2C address or contrast setting | Adjust potentiometer on PCF8574 backpack. Confirm address is `0x27`. |
| **Device never sleeps** | PIR sensitivity set too high or noise on `GPIO 34` | Adjust potentiometer on PIR sensor module. Verify threshold in code (`> 1000`). |
| **Device wakes immediately after sleep** | PIR output bouncing or re-trigger jumper set improperly | Set PIR jumper to non-repeatable trigger (L mode) or adjust delay pot. |
