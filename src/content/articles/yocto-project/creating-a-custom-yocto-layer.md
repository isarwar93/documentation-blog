---
title: "Creating a Custom Yocto Layer"
description: "Creating a product layer, and why vendor layers should stay untouched across BSP updates."
series: "yocto-project"
order: 11
tags: ["Yocto", "Layers", "BSP"]
---
## Creating your own Yocto layer

For serious projects, we should avoid modifying vendor layers directly.

Instead, create a custom layer.

For example:

```text
meta-my-project/
├── conf/
│   └── layer.conf
├── recipes-apps/
├── recipes-core/
├── recipes-kernel/
└── recipes-images/
```

The custom layer can contain project-specific modifications.

For example:

```text
meta-my-project
      |
      +-- custom application
      |
      +-- configuration
      |
      +-- patches
      |
      +-- image recipe
      |
      +-- systemd services
```

This keeps our modifications separate from vendor code.

## Why not modify vendor layers?

Suppose we directly modify:

```text
meta-vendor/
```

Everything works.

Six months later we update the vendor BSP.

Our modifications may be overwritten or become difficult to merge.

Instead:

```text
Vendor Layers
      +
Custom Layer
      |
      v
Our Product
```

This makes upgrades much easier.
