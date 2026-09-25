---
title: "KitchenAnalyzer: Ultra-Low-Power Kitchen Environmental Monitor"
description: "Overview, hardware specs, and features of the ESP32 LOLIN32 kitchen monitor."
project: "kitchen-analyzer"
section: "overview"
order: 1
---

# KitchenAnalyzer Overview

The **KitchenAnalyzer** is an ultra-low-power environmental monitoring device engineered specifically for home kitchens. Powered by an ESP32 LOLIN32, it continuously evaluates kitchen safety and ambient comfort by tracking combustible gas concentrations, temperature, and humidity, while utilizing motion activation to extend battery life.

## Core Features
- **Combustible Gas & Smoke Detection:** Monitored via an analog MQ-2 sensor module.
- **Climate Monitoring:** High-accuracy ambient temperature and relative humidity via DHT22.
- **On-Demand Human Presence Activation:** PIR motion sensor automatically activates the system when an occupant enters.
- **Real-Time Visual Diagnostics:** High-contrast 16x2 character LCD with custom I2C routing.
- **Ultra-Low-Power Deep Sleep:** ESP32 drops to deep sleep after 20 seconds of inactivity, waking instantaneously via RTC GPIO interrupt.
- **Battery-Operated Design:** Optimized to run for months on a single LiPo battery charge.

## Bill of Materials
- **MCU:** ESP32 LOLIN32 Development Board
- **Gas Sensor:** MQ-2 Combustible Gas & Smoke Sensor
- **Climate Sensor:** DHT22 (AM2302) Temperature & Humidity Sensor
- **Motion Sensor:** PIR Motion Sensor (HC-SR501 or similar)
- **Display:** 16x2 Character LCD with PCF8574 I2C Backpack
- **Power Source:** 3.7V LiPo Battery with charge regulator
