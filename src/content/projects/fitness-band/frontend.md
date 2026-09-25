---
title: "React 19 Frontend Dashboard"
description: "Real-time biosignal waveform rendering with Vite, TypeScript, and Tailwind CSS."
project: "fitness-band"
section: "frontend"
order: 5
---

# React 19 Biosignal Dashboard

The frontend application provides clinical-grade real-time waveform visualization and session management.

## Tech Stack
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS + custom glassmorphic HUD theme
- **Visualization:** HTML5 Canvas (`react-konva`) and SVG plotting (`recharts` / `apexcharts`) for jitter-free 60 FPS waveform scrolling.
- **State Management:** Zustand for lightweight, decoupled telemetry state updates.

## WebSocket Telemetry Consumer
```typescript
interface BiosignalPacket {
  ecg: number;
  pulse: number;
  bp_low: number;
  bp_high: number;
  pulse_rate: number;
  spo2: number;
  body_temp: number;
  respiration: number;
  timestamp: number;
}
```
The client maintains a rolling 10-second ring buffer in browser memory, allowing smooth physiological wave rendering without causing garbage collection spikes.
