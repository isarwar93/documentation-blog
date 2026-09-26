---
title: "Understanding Yocto Layers"
description: "Why metadata is split into layers, what a layer may contain, and how a product layer keeps changes separate."
series: "yocto-project"
order: 6
tags: ["Yocto", "Layers"]
---
## Layers

Yocto uses **layers** to organize metadata.

A layer can contain:

* Recipes
* Configuration
* Classes
* Machine definitions
* Distribution configuration
* Patches
* Image definitions

Instead of putting everything into one huge directory, functionality can be separated into layers.

For example:

```text
meta/
meta-openembedded/
meta-freescale/
meta-my-product/
```

A custom product may have its own layer:

```text
meta-my-product/
├── conf/
├── recipes-core/
├── recipes-apps/
├── recipes-kernel/
└── recipes-images/
```

This makes the system easier to maintain.
