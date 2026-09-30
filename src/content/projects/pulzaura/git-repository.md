---
title: "Source Repository"
description: "Repository link, monorepo layout and run command for the Pulzaura platform."
project: "pulzaura"
section: "overview"
order: 2
---

# Source Repository

Pulzaura is a monorepo. The firmware, the backend, the dashboard and the deployment files all live
in one public repository next to this documentation.

| Item | Value |
| --- | --- |
| Repository | [isarwar93/pulzaura](https://github.com/isarwar93/pulzaura) |
| Clone | `git clone https://github.com/isarwar93/pulzaura.git` |
| Contents | firmware, backend, frontend, InfluxDB and Grafana config, hardware notes |

## Repository layout

```text
pulzaura/
├── backend/          C++20 server: BLE bridge, WebSocket, InfluxDB writer
├── frontend/         React 19 dashboard built with Vite
├── firmware/         ESP32 firmware
│   ├── platformio-esp32/   primary target, Arduino framework
│   └── Zephyr-esp32/       alternative Zephyr RTOS port
├── grafana/
│   └── provisioning/       dashboards provisioned into the container
├── hardware/
│   └── README.md           sensor board notes and future goals
├── docker/
│   └── nginx.conf
├── docker-compose.yml
└── local/             agent and editor helper notes
```

## Running the stack

Docker and Docker Compose are the only prerequisites:

```bash
docker compose up -d
```

| Service | Address | Container |
| --- | --- | --- |
| Frontend dashboard | http://localhost:5173 | `pulzaura-frontend` |
| Backend API | http://localhost:8000 | `pulzaura-backend` |
| InfluxDB | bundled service, image `influxdb:2.7` | `pulzaura-influxdb` |
| Grafana | bundled service, image `grafana/grafana:10.2.3` | `pulzaura-grafana` |

## Building the backend without Docker

The backend builds out-of-source with CMake:

```bash
sudo apt-get install -y build-essential cmake pkg-config \
    libbluetooth-dev libglib2.0-dev libdbus-1-dev libcurl4-openssl-dev

bash backend/utility/install-oatpp-modules.sh   # first time only
make -C backend/build -j$(nproc) backend-server-exe
```

## Flashing the firmware

```bash
cd firmware/platformio-esp32
python3 -m venv .venv && source .venv/bin/activate
pip install platformio
pio run --target upload
```
