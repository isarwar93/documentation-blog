---
title: "Overview"
description: "Battery-powered ESP32 kitchen monitor: gas, climate and motion sensing with deep sleep."
project: "kitchen-analyzer"
section: "overview"
order: 1
---

# Overview

An ultra-low-power environmental monitor for a home kitchen, built on an ESP32 LOLIN32. It tracks
combustible gas, temperature and humidity, wakes on motion, and sleeps again to save battery.

## Core features

- **Combustible gas and smoke** measured through an analog MQ-2 module
- **Climate monitoring** of temperature and relative humidity with a DHT22
- **On-demand activation**: the device wakes only when the PIR detects motion
- **Live readings** on a 16x2 character LCD over I2C
- **Deep sleep** after 20 seconds without motion, woken by an RTC GPIO interrupt
- **Battery operation** from a single LiPo cell

## In this project

| Chapter | What it covers |
| --- | --- |
| [Source repository](/projects/kitchen-analyzer/git-repository/) | repository link, layout, build commands |
| [System architecture](/projects/kitchen-analyzer/architecture/) | block diagram, state machine, signal flow |
| [Hardware](/projects/kitchen-analyzer/hardware/) | full pin map, wiring and power notes |
| [ESP32 LOLIN32 and pin configuration](/projects/kitchen-analyzer/esp32/) | board resources and the pins in use |
| [MQ-2 gas and smoke sensing](/projects/kitchen-analyzer/mq2-gas-sensor/) | analog reading and interpretation |
| [DHT22 climate monitoring](/projects/kitchen-analyzer/dht22/) | 1-Wire protocol and sampling |
| [PIR motion sensing and wakeup](/projects/kitchen-analyzer/pir-motion/) | interrupt source and debounce |
| [16x2 I2C display interface](/projects/kitchen-analyzer/lcd/) | addressing, backlight, display format |
| [Low-power and deep sleep architecture](/projects/kitchen-analyzer/low-power/) | wake sources and the idle window |
| [Firmware build and architecture](/projects/kitchen-analyzer/software/) | PlatformIO setup and dependencies |
| [Results](/projects/kitchen-analyzer/results/) | what works, and what is not measured |
| [Diagnostics and debugging guide](/projects/kitchen-analyzer/common-problems/) | serial logs and sensor checks |

