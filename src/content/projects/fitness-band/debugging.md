---
title: "Diagnostics & Troubleshooting"
description: "BlueZ D-Bus debugging, WebSocket frame inspection, and container health verification."
project: "fitness-band"
section: "debugging"
order: 9
---

# Diagnostics & Troubleshooting

## Verifying Host Bluetooth Daemon
Before launching the backend container, ensure the BlueZ service is running on the Linux host:

```bash
sudo systemctl status bluetooth
# If inactive:
sudo systemctl start bluetooth
```

Scan for the advertising device to confirm signal presence:
```bash
bluetoothctl scan on
```

## Inspecting Container Logs
```bash
# Stream backend logs
docker compose logs -f backend

# Stream InfluxDB ingestion logs
docker compose logs -f influxdb
```

## Common Issues & Mitigations

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **Backend fails on D-Bus connection** | BlueZ stopped or socket unmounted | Check `systemctl status bluetooth` and ensure `/var/run/dbus` is mounted. |
| **GATT characteristic read fails** | BLE peripheral disconnected or low battery | Check ESP32 power rail and verify advertising packets via `bluetoothctl`. |
| **WebSocket disconnects immediately** | Port 8000 blocked or frontend misconfigured | Check `docker ps` to verify backend container is healthy on host network. |
