---
title: "MQ-2 Gas & Smoke Sensing"
description: "Sensor operating principles, calibration parameters, and regression curve calculation."
project: "kitchen-analyzer"
section: "sensors"
order: 4
---

# MQ-2 Gas & Smoke Sensor

## Sensing Principle
The MQ-2 sensor relies on a Tin Dioxide ($SnO_2$) sensitive layer with low conductivity in clean air. In the presence of combustible gases (LPG, propane, methane, hydrogen, smoke), conductivity rises proportionally to gas concentration.

## Firmware Calibration & Calculation
The firmware uses `MQUnifiedsensor` configured for 3.3V supply and 12-bit ADC resolution:

```cpp
MQUnifiedsensor MQ2("ESP-32", 3.3, 12, PIN_GAS_SENSOR, "MQ-2");
MQ2.init();
MQ2.setVCC(3.3);
MQ2.setRegressionMethod(1); // Exponential regression
MQ2.setA(574.25); 
MQ2.setB(-2.222);
MQ2.setR0(10.0);
```

Concentration is calculated using exponential power regression:
$$\text{PPM} = A \cdot \left(\frac{R_S}{R_0}\right)^B$$
- **A:** `574.25`
- **B:** `-2.222`
- **Baseline Sensor Resistance ($R_0$):** `10.0 kΩ`
