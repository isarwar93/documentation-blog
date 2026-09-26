---
title: "Modifying the Linux Kernel"
description: "What the kernel does on an embedded board, and how to patch or extend a vendor recipe with a .bbappend."
series: "yocto-project"
order: 13
tags: ["Yocto", "Linux Kernel"]
---
## Linux kernel

The Linux kernel is the central component of the operating system.

It provides:

* CPU scheduling
* Memory management
* Device drivers
* Networking
* Filesystems
* Process management
* Hardware abstraction

For an embedded board, the kernel must also know about the board hardware.

This is where the **device tree** becomes important.

## Modifying an existing recipe

Yocto provides mechanisms such as:

```text
.bbappend
```

A `.bbappend` file allows us to modify an existing recipe without changing the original recipe.

For example:

```text
recipes-kernel/
└── linux/
    └── linux-%.bbappend
```

This can be used to:

* Add patches
* Add configuration
* Add files
* Modify variables
* Change behavior

This is a very useful mechanism for maintaining product-specific modifications.
