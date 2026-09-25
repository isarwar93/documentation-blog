---
title: "Grafana Analytics & Telemetry"
description: "Auto-provisioned biosensor dashboards and real-time refresh configuration."
project: "fitness-band"
section: "grafana"
order: 7
---

# Grafana Real-Time Analytics

Grafana serves as the engineering operations dashboard, auto-provisioned out of the box via Docker Compose.

## Provisioned Dashboards
Located in `grafana/provisioning/dashboards/`:
- **Dashboard Name:** *Pulzaura Biosensors*
- **Refresh Frequency:** Auto-refreshes every 5 seconds.
- **Panels:**
  - Real-time ECG and PPG pulse wave series.
  - SpO2 % gauge with abnormal threshold alerts (<92%).
  - Systolic and Diastolic blood pressure trend corridors.
  - Core body temperature timeline.

## Data Source Provisioning
The InfluxDB v2 datasource is configured automatically upon launch with access token authentication, eliminating any manual UI setup.
