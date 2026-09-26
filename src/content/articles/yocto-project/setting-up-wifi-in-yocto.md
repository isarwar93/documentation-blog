---
title: "Setting up Wi-Fi in Yocto"
description: "From the Wi-Fi chip to a network interface: driver, firmware, wpa_supplicant and a bottom-up debugging order."
series: "yocto-project"
order: 10
tags: ["Yocto", "Wi-Fi", "Networking"]
---
## Configuring Wi-Fi

A common requirement for embedded devices is Wi-Fi.

However, having a Wi-Fi chip on the board does not automatically mean that Linux will be able to use it.

Several components may be required:

```text
Wi-Fi Hardware
      |
      v
Kernel Driver
      |
      v
Firmware
      |
      v
Wireless Interface
      |
      v
wlan0
      |
      v
Network Manager / wpa_supplicant
      |
      v
Network
```

The exact architecture depends on the board and Linux distribution.

## Checking the Wi-Fi interface

After Linux boots, first check the available interfaces:

```bash
ip link
```

or:

```bash
ifconfig
```

A wireless interface may appear as:

```text
wlan0
```

Modern Linux systems can use different predictable interface names, so the actual name may differ.

## Scanning for Wi-Fi networks

Depending on the networking tools installed, Wi-Fi networks can be scanned using:

```bash
iw dev wlan0 scan
```

or through higher-level network management tools.

If the wireless interface does not exist, the problem may be at a lower level.

Possible causes include:

* Missing kernel driver
* Missing firmware
* Incorrect device tree
* Hardware not enabled
* Power-management issue
* Incorrect BSP configuration

This is an important debugging principle:

> Do not assume a networking problem is a network configuration problem. First verify that the hardware and driver are working.

## Connecting using wpa_supplicant

A traditional embedded Linux setup can use `wpa_supplicant`.

A simplified configuration looks like:

```text
ctrl_interface=/var/run/wpa_supplicant
update_config=1

network={
    ssid="MY_WIFI"
    psk="MY_PASSWORD"
}
```

Then:

```bash
wpa_supplicant \
    -B \
    -i wlan0 \
    -c /etc/wpa_supplicant.conf
```

After association, an IP address can be requested:

```bash
dhclient wlan0
```

The exact commands depend on the networking stack used by the image.

## Debugging Wi-Fi

When Wi-Fi does not work, I normally check the problem from the bottom up.

First:

```bash
ip link
```

Is the interface present?

Then:

```bash
dmesg | grep -i wlan
```

and:

```bash
dmesg | grep -i firmware
```

Then inspect:

```bash
iw dev
```

If the interface exists, check whether it can scan.

Finally check IP configuration:

```bash
ip addr
```

and routing:

```bash
ip route
```

This gives a useful troubleshooting sequence:

```text
Hardware
   ↓
Kernel Driver
   ↓
Firmware
   ↓
Wireless Interface
   ↓
Association
   ↓
IP Address
   ↓
Routing
   ↓
Internet
```
