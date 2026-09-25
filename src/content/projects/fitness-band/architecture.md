---
title: "System Architecture"
description: "Microservices, BLE telemetry stream, C++ backend, InfluxDB, and Grafana."
project: "fitness-band"
section: "architecture"
order: 2
---

# Pulzaura System Architecture

Pulzaura is designed around an end-to-end telemetry pipeline streaming real-time biosignals from embedded wearable sensors to web dashboards and time-series analytics databases.

```text
+-------------------+       BLE GATT Notify       +---------------------+
|   ESP32 Wearable  |  ========================>  |     Backend (C++)   |
|   (MAX3010x/AD8232|   UUID: 0000f00d-...        |  (oatpp + BlueZ)    |
+-------------------+                             +----------+----------+
                                                             |
                   +-----------------------------------------+--------------------+
                   | WebSocket (JSON Frames)                                      | HTTP Line Protocol
                   v                                                              v
+------------------------------------+                         +------------------------------------+
|         Frontend (React 19)        |                         |         InfluxDB Storage           |
|      Vite + Real-time Graphs       |                         |      Continuous Persistence        |
+------------------------------------+                         +------------------+-----------------+
                                                                                  |
                                                                                  v
                                                               +------------------------------------+
                                                               |         Grafana Dashboards         |
                                                               |       Auto-provisioned, 5s         |
                                                               +------------------------------------+
```

## Architectural Tenets

1. **Low-Latency Streaming:** Sensor packets bypass disk write cycles on the front path, routing directly from the BlueZ Bluetooth subsystem to client WebSockets.
2. **Resilient Long-Term Persistence:** Every packet received is buffered and written to InfluxDB in batches using Influx Line Protocol.
3. **Decoupled Visualization:** React delivers responsive, sub-50ms live waveform rendering, while Grafana delivers aggregate historical trends and multi-hour session analytics.
