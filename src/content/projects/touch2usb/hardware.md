---
title: "Hardware"
description: "Bill of materials, Pico to XPT2046 pin map, SPI configuration and calibration constants."
project: "touch2usb"
section: "architecture"
order: 4
---

# Hardware

Both firmware targets use the same physical wiring, so this page applies to either build.

## Bill of materials

| Part | Note |
| --- | --- |
| Raspberry Pi Pico, RP2040 | the host USB device |
| XPT2046 resistive touch controller module, or a display panel with an integrated XPT2046 | the touch input |
| USB Micro-B cable | to the host |
| Jumper wires | to the controller |

## Pin map

| Pico GPIO | XPT2046 pin | Signal | Notes |
| --- | --- | --- | --- |
| GPIO 18 | CLK / DCLK | SPI0 SCK | |
| GPIO 19 | DIN | SPI0 MOSI | |
| GPIO 16 | DOUT | SPI0 MISO | |
| GPIO 17 | CS / CSB | SPI0 chip select | active low, driven by firmware |
| GPIO 20 | PENIRQ | touch interrupt | active low, internal pull-up enabled |
| GPIO 25 | — | onboard LED | PWM feedback, optional |
| GPIO 0 | — | UART0 TX | debug output at 115200 baud, optional |
| GPIO 1 | — | UART0 RX | completes the debug pair |

The XPT2046 VCC pin accepts 2.7 V to 5.5 V. The wiring uses the Pico's 3.3 V output on pin 36, and
any Pico ground pin for GND.

## SPI configuration

Both targets configure the controller the same way:

| Setting | Value |
| --- | --- |
| Controller | SPI0 |
| Clock speed | 1 MHz |
| Mode | CPOL 0, CPHA 0, that is mode 0 |
| Word order | MSB first |
| ADC resolution | 12 bits |

## Calibration

The controller returns raw 12-bit ADC values that must be mapped to screen coordinates. The
constants below were measured on a 4-wire resistive panel and are used by both targets:

| Axis | Raw ADC minimum | Raw ADC maximum | Screen range |
| --- | --- | --- | --- |
| X | 150 | 3784 | 0 to 799 |
| Y | 277 | 3784 | 0 to 479 |

A different panel needs different limits. To find them, enable the UART debug output, touch each
screen corner and read the raw values, then update `X_MIN`, `X_MAX`, `Y_MIN` and `Y_MAX` in the
source file of the firmware being built. See
[XPT2046 and calibration](/projects/touch2usb/xpt2046/).
