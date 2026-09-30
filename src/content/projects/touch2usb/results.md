---
title: "Results"
description: "What both firmware targets achieve, the calibration figures that are known, and what is unmeasured."
project: "touch2usb"
section: "outcome"
order: 10
---

# Results

Both targets work from the same wiring. This page records what each achieves and which numbers
are actually known.

## What the mouse target achieves

- a resistive panel appears to the host as an ordinary USB mouse
- movement is reported as relative deltas, so it works on any operating system with a generic
  HID mouse
- no host-side driver or configuration is needed

## What the digitizer target achieves

- the panel appears as a HID digitizer, so Linux evdev and LVGL, Windows and macOS treat it as a
  touchscreen rather than a pointing device
- absolute coordinates are reported, which is what a kiosk, an embedded HMI or a drawing tablet
  needs
- the filter chain removes spikes, smooths motion, stops a held contact from trembling and
  debounces lift-off, see [Signal filtering](/projects/touch2usb/pico-sdk/)

## Known figures

| Figure | Value | Source |
| --- | --- | --- |
| X axis raw range | 150 to 3784 ADC counts, mapped to 0 to 799 | measured on a 4-wire panel |
| Y axis raw range | 277 to 3784 ADC counts, mapped to 0 to 479 | measured on a 4-wire panel |
| SPI clock | 1 MHz, mode 0, MSB first | firmware configuration |
| Controller resolution | 12 bits | XPT2046 datasheet |

The calibration values are the only measured numbers in the project. They are specific to the
panel they were taken on, which is why the firmware keeps them as editable constants.

## What is not recorded

- report rate under sustained movement, and the latency between a touch and a host event
- behaviour at the screen edges, where extrapolation and clamping interact
- how the two targets compare on the same panel with the same noise source
- long-run drift in the calibration, for example after the panel ages

The UART debug output is the intended way to capture these, and the build supports it on GPIO 0
at 115200 baud. See [Diagnostics](/projects/touch2usb/common-problems/).
