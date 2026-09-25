---
title: "InfluxDB Time-Series Storage"
description: "Line protocol persistence, retention policies, and schema design."
project: "fitness-band"
section: "database"
order: 6
---

# InfluxDB Time-Series Storage

All physiological metrics emitted from the wearable device are stored in InfluxDB for longitudinal health trend analysis.

## Influx Line Protocol Schema
Data is ingested over HTTP Line Protocol via the backend's background worker:

```text
biosignals,device=pulzaura_lolin32 ecg=0.45,pulse=512.0,spo2=98.5,pulse_rate=72.0,temp=36.6 1727211500000000000
```

- **Measurement:** `biosignals`
- **Tag Set:** `device=pulzaura_lolin32`, `session_id=<uuid>`
- **Field Set:** `ecg`, `pulse`, `spo2`, `pulse_rate`, `bp_low`, `bp_high`, `body_temp`, `respiration`
- **Timestamp:** Nanosecond Unix timestamp generated on packet arrival.

## Retention Policy
Configured with an 8-week hot retention policy for raw 50 Hz waveforms, alongside continuous downsampling into 1-minute bucket aggregates for multi-month health reviews.
