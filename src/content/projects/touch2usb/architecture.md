---
title: "Hardware Interfacing & Signal Flow"
description: "SPI0 pinout, PENIRQ interrupt timing, and bus electrical characteristics."
project: "touch2usb"
section: "architecture"
order: 2
---

# Hardware Interfacing & Signal Flow

Both firmware targets share an identical hardware pinout on the Raspberry Pi Pico.

```text
               +-------------------------------------------+
               |            Raspberry Pi Pico              |
               |                 (RP2040)                  |
               |                                           |
 [Touch Event] ----> GPIO 20 (PENIRQ - Active Low)         |
               |                                           |
               |   [SPI0 Bus - 1 MHz, Mode 0]              |
 [MOSI / DIN]  <---- GPIO 19                               |
 [MISO / DOUT] ----> GPIO 16                               |
 [SCK / CLK]   <---- GPIO 18                               |
 [CS / CSB]    <---- GPIO 17 (Chip Select)                 |
               |                                           |
 [PWM Output]  ----> GPIO 25 (Onboard LED Feedback)        |
 [UART0 TX]    ----> GPIO 00 (115200 8N1 Debug)            |
               +---------------------+---------------------+
                                     |
                                     v USB Full Speed (12 Mbps)
                       +---------------------------+
                       |      Host Computer /      |
                       |      Embedded System      |
                       +---------------------------+
```

## Physical Pin Connection Matrix

| Pico GPIO | Physical Pin | XPT2046 Pin | Signal Type | Function & Notes |
| :--- | :--- | :--- | :--- | :--- |
| **GPIO 18** | Pin 24 | `CLK / DCLK` | SPI0 SCK | 1 MHz SPI serial clock |
| **GPIO 19** | Pin 25 | `DIN` | SPI0 MOSI | Master Out Slave In (Control Byte) |
| **GPIO 16** | Pin 21 | `DOUT` | SPI0 MISO | Master In Slave Out (12-bit ADC data) |
| **GPIO 17** | Pin 22 | `CS / CSB` | SPI0 CS | Active-low chip select, driven by firmware |
| **GPIO 20** | Pin 26 | `PENIRQ` | Interrupt | Active-low touch detection with internal pullup |
| **GPIO 25** | Pin 25 (internal) | — | LED | PWM brightness feedback proportional to touch |
| **GPIO 0** | Pin 1 | — | UART0 TX | Serial telemetry stream at 115200 baud |

> **Power Supply:** Connect XPT2046 `VCC` to Pico 3.3V (Pin 36). Connect `GND` to any Pico ground pin.
