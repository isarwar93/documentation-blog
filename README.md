# EngineerExperiences Documentation & Project Blog

A modern, responsive static engineering documentation website and project blog built with **Astro**. It serves technical documentation, architecture deep dives, and firmware specifications for embedded hardware, IoT devices, and biosignal platforms.

## Live Website

The production static build is hosted on AWS (S3 + CloudFront):
- **Live URL:** [EngineerExperiences](https://engineerexperiences.link/)

---

## Documented Projects

- **KitchenAnalyzer:** Ultra-low-power ESP32 LOLIN32 environmental monitor (MQ-2 gas, DHT22 climate, PIR motion, 16x2 I2C LCD, deep sleep).
- **PulseAura / Fitness Band:** Full-stack biosignal monitoring platform (ESP32 firmware, C++ backend, React frontend, InfluxDB, Grafana).
- **Touch2USB:** RP2040 XPT2046 resistive touch-to-USB HID bridge.
- **TI Microcontroller Flasher:** TI TMS320F28379D dual-core firmware flasher and bootloader.

---

## Running Locally

### Prerequisites

- **Node.js:** v18.14.1 or higher (Node v20+ recommended)
- **npm:** v9+ or equivalent package manager

### 1. Install Dependencies

From inside the `documentation-blog/` directory:

```bash
npm install
```

### 2. Start the Local Development Server

```bash
npm run dev
```

The Astro development server will start with hot-module reloading at:
- **Local:** `http://localhost:4321/`

### 3. Build for Production

To compile the static HTML/CSS/JS site for deployment:

```bash
npm run build
```

The generated static website is emitted into the `dist/` directory.

### 4. Preview the Production Build Locally

To test the compiled production build locally before uploading to AWS:

```bash
npm run preview
```

---

## Deploying to AWS S3 / CloudFront

Since this is an Astro static build (`output: 'static'`), deploying the latest changes to AWS is done by syncing the `dist/` directory to your S3 bucket:

```bash
# 1. Build the static site
npm run build

# 2. Sync to AWS S3 (replace with your bucket name)
aws s3 sync dist/ s3://YOUR-S3-BUCKET-NAME --delete

# 3. Invalidate CloudFront cache (if applicable)
aws cloudfront create-invalidation --distribution-id YOUR-DISTRIBUTION-ID --paths "/*"
```

