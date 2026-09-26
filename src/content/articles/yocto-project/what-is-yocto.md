---
title: "What is Yocto?"
description: "Why Yocto is a build system rather than a distribution, and what a customized embedded image actually contains."
series: "yocto-project"
order: 2
tags: ["Yocto", "Embedded Linux"]
---
## What is Yocto?

Yocto is commonly misunderstood as a Linux distribution.

It is not.

Yocto is a **build system and collection of tools and metadata used to create customized Linux-based systems**.

The important idea is:

> Yocto builds the Linux system that you want instead of giving you a fixed Linux system.

For example, imagine that we have an embedded device with:

* an ARM processor
* 512 MB RAM
* eMMC storage
* Ethernet
* Wi-Fi
* a touchscreen
* one custom application

A normal Linux distribution may contain hundreds or thousands of packages that our device does not need.

With Yocto, we can build an image containing only the components required by our system.

Conceptually:

```text
                 Yocto Project
                       |
          +------------+------------+
          |            |            |
       Kernel       Bootloader    Root FS
          |            |            |
          +------------+------------+
                       |
                 Embedded Image
                       |
              +--------+--------+
              |                 |
          Target Board      Target Board
```

The final result can be an image that is flashed onto the embedded device.
