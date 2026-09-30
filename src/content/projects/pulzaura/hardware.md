---
title: "Hardware"
description: "Wearable sensor set, BLE transport and the hardware work still outstanding."
project: "pulzaura"
section: "architecture"
order: 4
---

# Hardware

The wearable is an ESP32 board carrying a set of biosignal sensors. The repository tracks this in
`hardware/README.md`, which mixes what the design already uses with what it still plans. This page
keeps those two apart.

## Bill of materials

| Part | Interface | Role |
| --- | --- | --- |
| ESP32 (WROOM or LOLIN32) | — | Wi-Fi and BLE connectivity, GATT services |
| MAX3010x pulse oximeter module | I2C | SpO2 and pulse rate |
| ECG front-end amplifier | Analog → ADC | ECG channel |
| Pulse sensor, optical or Hall effect | Digital or analog → pin | pulse detection |
| NTC thermistor divider | Analog → ADC | body temperature |
| Respiration sensor, piezo, strain or microphone | Analog channel | optional respiration channel |
| LiPo battery with fuel gauge | Power | supply, charged through a TP4056 |
| Native ESP32 BLE peripheral | — | exposes the sensor characteristics |

The firmware README names the fitted module as a **SparkFun MAX3010x** pulse oximeter, while
`hardware/README.md` lists a **MAX30105**. Both names are recorded here rather than silently
picking one; the part number should be confirmed against the board before it is published.

## The nine channels

Each BLE notification carries nine 32-bit floats, 36 bytes in total:

| Index | Channel | Unit |
| --- | --- | --- |
| 0 | ECG | mV |
| 1 | Pulse | ADC |
| 2 | Blood pressure, diastolic | mmHg |
| 3 | Blood pressure, systolic | mmHg |
| 4 | Pulse rate | bpm |
| 5 | SpO2 | % |
| 6 | Reserved | — |
| 7 | Body temperature | C |
| 8 | Respiration | bpm |

A value of `32767.0f` means the channel is unavailable, and the backend filters it out.

## Transport

The ESP32 runs a BLE GATT server and notifies one custom characteristic,
`0000f00d-0000-1000-8000-00805f9b34fb`, with one notification per frame. The backend connects over
BlueZ, so the host must be Linux with Bluetooth support.

## Still planned, not built

`hardware/README.md` lists the hardware work that is **not** finished:

1. finalising the analog front end for ECG and pulse, and validating its linearity
2. stabilising the temperature calibration
3. adding JST headers so sensors can be swapped without soldering
4. battery voltage monitoring, a low-battery warning and deep-sleep power modes
5. a PCB and case prototype that can be worn as a patch or chest strap
6. publishing wiring diagrams, a bill of materials and measured signal characteristics

The prototype is therefore a documented design, not a finished board.
