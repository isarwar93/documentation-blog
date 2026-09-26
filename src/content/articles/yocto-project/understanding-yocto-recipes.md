---
title: "Understanding Yocto Recipes"
description: "Anatomy of a .bb recipe: where the source comes from, how it compiles and where the files are installed."
series: "yocto-project"
order: 5
tags: ["Yocto", "BitBake", "Recipes"]
---
## Recipes

A Yocto recipe normally has a `.bb` extension.

For example:

```text
example_1.0.bb
```

A recipe describes how a piece of software should be built and installed.

A simplified recipe might look like:

```bitbake
SUMMARY = "Example application"
DESCRIPTION = "Simple example application"

LICENSE = "MIT"

SRC_URI = "file://example.c"

S = "${WORKDIR}"

do_compile() {
    ${CC} example.c -o example
}

do_install() {
    install -d ${D}${bindir}
    install -m 0755 example ${D}${bindir}/example
}
```

The recipe tells Yocto:

1. Where the source code comes from.
2. What license applies.
3. How the software is compiled.
4. Where the resulting files should be installed.

This is one of the fundamental concepts in Yocto.
