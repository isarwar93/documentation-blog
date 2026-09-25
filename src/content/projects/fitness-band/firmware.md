---
title: "ESP32 Firmware Architecture"
description: "NimBLE GATT server, 9-channel float struct, and MAX3010x pulse oximeter integration."
project: "fitness-band"
section: "firmware"
order: 3
---

# ESP32 Wearable Firmware

The primary wearable firmware target runs on the **ESP32 LOLIN32** platform (240 MHz dual-core Xtensa LX6) built using PlatformIO and the Arduino framework.

## Bluetooth Low Energy (BLE) Stack

The firmware employs **NimBLE-Arduino 2.x** for an optimized memory footprint and high notification throughput:
- **Service UUID:** Custom 128-bit biosensor service.
- **Characteristic UUID:** `0000f00d-0000-1000-8000-00805f9b34fb` (Notify property enabled).

## 36-Byte Payload Structure

Every transmission contains 9 contiguous 32-bit single-precision floats (36 bytes total):

| Byte Offset | Float Index | Metric / Channel | Unit | Fallback Value |
| :--- | :--- | :--- | :--- | :--- |
| `0x00 - 0x03` | `0` | ECG Signal | mV | `32767.0f` |
| `0x04 - 0x07` | `1` | Pulse Waveform | Raw ADC | `32767.0f` |
| `0x08 - 0x0B` | `2` | Diastolic BP | mmHg | `32767.0f` |
| `0x0C - 0x0F` | `3` | Systolic BP | mmHg | `32767.0f` |
| `0x10 - 0x13` | `4` | Heart / Pulse Rate | BPM | `32767.0f` |
| `0x14 - 0x17` | `5` | Blood Oxygen (SpO2) | % | `32767.0f` |
| `0x18 - 0x1B` | `6` | Reserved | — | `32767.0f` |
| `0x1C - 0x1F` | `7` | Body Temperature | °C | `32767.0f` |
| `0x20 - 0x23` | `8` | Respiration Rate | BPM | `32767.0f` |

When a channel is unmeasured or sensor contact is broken, the firmware populates `32767.0f`, alerting backend pipelines to filter the channel gracefully.
