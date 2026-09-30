---
title: "Overview"
description: "BLE biosignal monitoring platform: ESP32 wearable, C++ backend, React dashboard and InfluxDB."
project: "pulzaura"
section: "overview"
order: 1
---

# Overview

A real-time biosignal platform. A wearable ESP32 device streams nine sensor channels over BLE, a
C++ backend bridges them to WebSocket clients, and InfluxDB with Grafana keeps the history.

## Core features

- **Nine biosignal channels** in one 36-byte BLE notification, including ECG, pulse rate, SpO2 and
  body temperature
- **Unavailable channels filtered out**, using the `32767.0f` sentinel value
- **C++20 backend** that subscribes to the device over BlueZ and processes each characteristic in
  its own thread
- **Live React dashboard** fed by WebSocket frames
- **Long-term storage** in InfluxDB, read back through Grafana
- **One command deployment**: four services start with `docker compose up -d`

## In this project

| Chapter | What it covers |
| --- | --- |
| [Source repository](/projects/pulzaura/git-repository/) | repository link, monorepo layout, run command |
| [System architecture](/projects/pulzaura/architecture/) | block diagram, from wearable to Grafana |
| [Hardware](/projects/pulzaura/hardware/) | sensor set, the nine channels, outstanding work |
| [ESP32 firmware architecture](/projects/pulzaura/software/) | GATT service, notification layout, build |
| [C++ high-performance backend](/projects/pulzaura/backend/) | BlueZ, per-characteristic threads, WebSocket |
| [React 19 frontend dashboard](/projects/pulzaura/frontend/) | live charts over WebSocket |
| [InfluxDB time-series storage](/projects/pulzaura/database/) | line protocol writes, retention |
| [Grafana analytics and telemetry](/projects/pulzaura/grafana/) | provisioned dashboards |
| [Docker Compose deployment](/projects/pulzaura/deployment/) | the four services and their configuration |
| [Results](/projects/pulzaura/results/) | what works end to end, and what is unmeasured |
| [Diagnostics and troubleshooting](/projects/pulzaura/common-problems/) | D-Bus, frame and container checks |
