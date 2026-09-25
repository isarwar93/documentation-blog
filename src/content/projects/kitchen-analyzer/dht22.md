---
title: "DHT22 Climate Monitoring"
description: "Precision temperature and relative humidity measurement on GPIO 13."
project: "kitchen-analyzer"
section: "sensors"
order: 5
---

# DHT22 (AM2302) Temperature & Humidity

## Protocol & Timing
The DHT22 uses a custom single-wire serial transmission protocol over `GPIO 13`. Readings are acquired non-blockingly at 1-second intervals.

## Measurement Tolerances
- **Temperature Range:** -40°C to +80°C (±0.5°C accuracy)
- **Humidity Range:** 0% to 100% RH (±2–5% accuracy)

## Implementation & Safeguards
```cpp
temperature = dht.readTemperature();
humidity = dht.readHumidity();

if (isnan(temperature) || isnan(humidity)) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Sensor Error");
}
```
The firmware validates reading integrity using `isnan()` checks to gracefully notify users on the LCD if sensor wires disconnect.
