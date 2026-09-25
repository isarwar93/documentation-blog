---
title: "16x2 I2C Display Interface"
description: "Custom I2C bus wiring, PCF8574 backpack, and diagnostic matrix layout."
project: "kitchen-analyzer"
section: "display"
order: 7
---

# 16x2 I2C LCD Interface

## Custom Bus Configuration
To optimize PCB and jumper routing, the I2C bus is bound to custom GPIOs instead of the ESP32 defaults (GPIO 21/22):
- **SDA:** `GPIO 17`
- **SCL:** `GPIO 19`
- **I2C Address:** `0x27`

```cpp
Wire.begin(LCD_SDA_PIN, LCD_SCL_PIN);
lcd.init();
```

## Screen Layout Matrix
```text
Row 0: [G][a][s][:][ ][1][4][5][ ][T][:][2][3][.][8]
Row 1: [H][:][4][8][.][2][ ][ ][ ][M][:][1][ ][ ][1][8]
```
- **Line 1:** Real-time Gas measurement followed by Temperature in °C.
- **Line 2:** Relative Humidity %, Motion flag (`1` active, `0` idle), and the 20-second sleep countdown timer (`18`, `17`, ... `00`).
