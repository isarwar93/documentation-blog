---
title: "C++ High-Performance Backend"
description: "oatpp REST + WebSocket server, BlueZ D-Bus integration, and threading model."
project: "fitness-band"
section: "backend"
order: 4
---

# C++20 oatpp Backend Service

The Pulzaura backend is written in modern **C++20** using the zero-dependency **oatpp 1.4.0** framework to guarantee deterministic low-latency processing of biosignal telemetry.

## BLE Hardware Acquisition via BlueZ & D-Bus

Instead of third-party wrapper runtimes, the backend interfaces directly with Linux's kernel Bluetooth daemon via D-Bus:
- Uses GLib main loop and D-Bus IPC to inspect Bluetooth adapters.
- Auto-discovers and connects to the wearable device advertising the Pulzaura UUID.
- Registers for notifications on characteristic `0000f00d-0000-1000-8000-00805f9b34fb`.

## Concurrency & Thread Isolation

```text
[ BLE / BlueZ Thread ] ──> [ Raw Packet Unpack ]
                                   │
                 +-----------------+-----------------+
                 |                                   |
                 v                                   v
        [ Ring Buffer Queue ]               [ InfluxWriter Queue ]
                 │                                   │
                 v                                   v
     [ WebSocket Broadcast Thread ]        [ HTTP Worker Thread ]
```

- **Ring Buffer:** Locks are avoided using lock-free ring buffers between network acquisition and WebSocket broadcasters.
- **WebSocket Serialization:** Converts parsed 9-channel floats into compact JSON frames streamed to connected browser clients at 50–100 Hz.
