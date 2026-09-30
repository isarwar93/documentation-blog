---
title: "Results"
description: "What the device does today, what has been verified, and what is still unmeasured."
project: "kitchen-analyzer"
section: "outcome"
order: 12
---

# Results

This page separates what the firmware is known to do from what has not been measured yet.

## Implemented behaviour

Every item below is implemented in `src/main.cpp` and listed in the repository README.

| Behaviour | Where it is documented |
| --- | --- |
| MQ-2 gas reading, LPG and smoke | [MQ-2 sensing](/projects/kitchen-analyzer/mq2-gas-sensor/) |
| DHT22 temperature and humidity | [DHT22 climate monitoring](/projects/kitchen-analyzer/dht22/) |
| PIR motion detection and wakeup | [PIR sensing and wakeup](/projects/kitchen-analyzer/pir-motion/) |
| 16x2 I2C display with live sensor values | [LCD interface](/projects/kitchen-analyzer/lcd/) |
| Countdown of seconds remaining before sleep | [LCD interface](/projects/kitchen-analyzer/lcd/) |
| Deep sleep after 20 seconds without motion | [Low-power architecture](/projects/kitchen-analyzer/low-power/) |
| LCD backlight off while asleep | [Low-power architecture](/projects/kitchen-analyzer/low-power/) |
| Battery operation | [Hardware](/projects/kitchen-analyzer/hardware/) |

## Display output

The two display lines are fixed by the firmware:

```text
Line 1:  Gas:XXXX T:XX.X      gas value and temperature
Line 2:  H:XX.X M:X XX        humidity, motion flag, seconds until sleep
```

## What is not measured

The repository does not contain measurement data, so these figures are **unknown**:

- battery life in days or months. The README describes it as *"estimated months on a single
  charge"*, which is an estimate, not a measurement
- MQ-2 response time or sensitivity drift over time
- false wake-up rate from the PIR in a real kitchen
- the current draw in each sleep state

Recording these would need a bench setup with a current meter and a timed run. Until then the
numbers are marked unknown rather than estimated.
