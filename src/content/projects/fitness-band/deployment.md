---
title: "Docker Compose Deployment"
description: "Multi-service orchestration, host networking, and BlueZ D-Bus socket sharing."
project: "fitness-band"
section: "deployment"
order: 8
---

# Multi-Container Deployment

The entire Pulzaura infrastructure launches with a single terminal command using Docker Compose.

## Architecture Orchestration (`docker-compose.yml`)

```yaml
services:
  influxdb:
    image: influxdb:2.7
    ports: ["8086:8086"]
    volumes: [influxdb_data:/var/lib/influxdb2]

  backend:
    build: ./backend
    network_mode: host
    privileged: true
    volumes:
      - /var/run/dbus:/var/run/dbus
    depends_on:
      influxdb:
        condition: service_healthy

  frontend:
    build: ./frontend
    ports: ["5173:80"]

  grafana:
    image: grafana/grafana:10.4.0
    ports: ["3000:3000"]
    volumes:
      - ./grafana/provisioning:/etc/grafana/provisioning
```

## Critical BlueZ Host Requirements
Because the backend talks to host Bluetooth controllers, it requires:
1. `network_mode: host`
2. `privileged: true`
3. `/var/run/dbus` mounted into the container to access the host's system message bus.
