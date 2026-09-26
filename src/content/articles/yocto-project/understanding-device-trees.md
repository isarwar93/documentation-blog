---
title: "Understanding Device Trees"
description: "How a device tree describes UARTs, I2C, SPI, GPIO, regulators and interrupts to the kernel, and what Yocto deploys with it."
series: "yocto-project"
order: 14
tags: ["Yocto", "Device Tree"]
---
## Device Tree

The Linux kernel cannot simply assume that every ARM board contains the same hardware.

The device tree describes hardware to the kernel.

For example, it can describe:

* UART
* Ethernet
* I²C
* SPI
* GPIO
* MMC
* USB
* Display
* Regulators
* Interrupts

A simplified device-tree fragment might look like:

```dts
uart1 {
    compatible = "vendor,uart";
    status = "okay";
};
```

The exact syntax and hardware definitions depend on the processor and board.

Yocto can build and deploy the appropriate device-tree files together with the kernel.
