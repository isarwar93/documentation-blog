---
title: "Code Composer Studio Modern Coding Theme"
description: "Modernizing TI's Eclipse-based IDE with VS Code-like typography and dark color schemes."
project: "ti-microcontroller-flasher"
section: "ide"
order: 5
---

# Code Composer Studio Modern Coding Theme

Embedded developers using Texas Instruments C2000 devices frequently rely on **Code Composer Studio (CCS)**, TI's Eclipse-based IDE. To reduce eye fatigue and modernize the development experience, this project includes a custom **VS Code-inspired dark color scheme**.

## Included Theme Features
- **Modern Dark Background:** Soft contrast dark background (`#1e1e1e`) replacing harsh default Eclipse themes.
- **Syntactic Highlighting:** Distinct, high-visibility color tokens for C/C++ keywords, preprocessor macros, register structs, and pointers.
- **Cross-Platform Plugin:** Packaged as an Eclipse color theme plugin (`coding_theme/`) compatible with CCS 9.x, 10.x, 11.x, and 12.x on both Linux and Windows.

## Installation Instructions
1. In Code Composer Studio, navigate to **Window → Preferences → General → Appearance → Color Theme**.
2. Click **Import Theme...** and select `coding_theme/coding_theme.xml`.
3. Apply and restart the editor view for the styling to take immediate effect.
