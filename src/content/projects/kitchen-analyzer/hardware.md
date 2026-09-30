---
title: "Hardware"
description: "Bill of materials, pin map and power wiring for the ESP32 kitchen monitoring device."
project: "kitchen-analyzer"
section: "architecture"
order: 4
---

# Hardware

The device is an ESP32 LOLIN32 with four sensors and a display. This page lists what is in the
bill of materials and how it is wired. Each peripheral has its own chapter further down.

## Bill of materials

| Part | Interface | Chapter |
| --- | --- | --- |
| ESP32 LOLIN32 board | — | [ESP32 & pin configuration](/projects/kitchen-analyzer/esp32/) |
| MQ-2 gas sensor module | Analog out → GPIO 32 | [MQ-2 sensing](/projects/kitchen-analyzer/mq2-gas-sensor/) |
| DHT22 temperature and humidity sensor | 1-Wire → GPIO 13 | [DHT22 climate monitoring](/projects/kitchen-analyzer/dht22/) |
| PIR motion sensor | Digital out → GPIO 34 | [PIR sensing and wakeup](/projects/kitchen-analyzer/pir-motion/) |
| 16x2 I2C LCD with PCF8574 backpack | I2C → GPIO 17 / 19 | [LCD interface](/projects/kitchen-analyzer/lcd/) |
| 3.7 V LiPo battery with charging circuit | Power → VIN | [Low-power architecture](/projects/kitchen-analyzer/low-power/) |

## Pin map

Every pin is defined as a macro in `include/config.h`.

| Macro | Pin | Signal |
| --- | --- | --- |
| `PIN_GAS_SENSOR` | GPIO 32 | MQ-2 analog output (ADC1_CH4) |
| `PIN_TEMP_HUM_SENSOR` | GPIO 13 | DHT22 data line |
| `PIN_MOTION_SENSOR` | GPIO 34 | PIR output, also the deep-sleep wake source |
| LCD SDA | GPIO 17 | I2C data |
| LCD SCL | GPIO 19 | I2C clock |
| Status LED | GPIO 22 | digital output |

GPIO 34 is input-only and has no internal pull-up, which is why the PIR is powered from the
board's 5 V rail and its output is read directly.

## Wiring

```text
3.3V  ──> MQ-2 VCC, DHT22 VCC, LCD VCC
GND   ──> common ground for every module
VIN   ──> battery positive (through a regulator if the cell needs one)
5V    ──> PIR VCC, soldered on the board

MQ-2 A0  ──> GPIO 32
DHT22    ──> GPIO 13
PIR OUT  ──> GPIO 34
LCD SDA  ──> GPIO 17
LCD SCL  ──> GPIO 19
```

## Power

The device is battery operated. It spends nearly all of its time in deep sleep, wakes on motion,
reads the sensors, updates the display and sleeps again. The LCD backlight is switched off while
the device sleeps. See [Low-power architecture](/projects/kitchen-analyzer/low-power/) for the wake
timing and the 20 second idle window.
