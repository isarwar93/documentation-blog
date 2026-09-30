---
title: "Results"
description: "What the Pulzaura platform does end to end today, and which figures are not recorded."
project: "pulzaura"
section: "outcome"
order: 11
---

# Results

The platform is assembled end to end. This page records what works and what is still unverified.

## Working end to end

| Stage | State | Chapter |
| --- | --- | --- |
| ESP32 firmware notifies the 9-channel GATT characteristic | implemented | [Software](/projects/pulzaura/software/) |
| Backend subscribes over BlueZ and parses frames per characteristic | implemented | [C++ backend](/projects/pulzaura/backend/) |
| Frames broadcast to the dashboard over WebSocket | implemented | [React dashboard](/projects/pulzaura/frontend/) |
| Every frame persisted to InfluxDB | implemented | [InfluxDB storage](/projects/pulzaura/database/) |
| Grafana reads InfluxDB for history | implemented, dashboards provisioned | [Grafana](/projects/pulzaura/grafana/) |
| All four services start with one command | `docker compose up -d` | [Deployment](/projects/pulzaura/deployment/) |

Unavailable channels are handled rather than sent: the firmware writes `32767.0f` and the backend
drops it, so a missing sensor does not corrupt the stream.

## What is not recorded

The repository contains no measurement data, so these are **unknown**:

- end-to-end latency from sensor read to browser paint
- sustained notification rate and packet loss over a real BLE link
- signal quality of the ECG and respiration channels
- backend throughput ceiling, that is frames per second written to InfluxDB
- battery life of the wearable

`hardware/README.md` also states that the sensor front end is not finalised, so signal-quality
figures would not be meaningful yet. See the outstanding hardware list in the
[Hardware](/projects/pulzaura/hardware/) chapter.
