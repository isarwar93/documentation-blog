/**
 * Shared project metadata.
 *
 * Kept in one module so the header navigation, sidebar, landing pages and
 * search index always describe the projects with the same wording.
 */
export interface ProjectMeta {
  /** Folder name inside `src/content/projects/` and URL segment. */
  slug: string;
  /** Full display name. */
  name: string;
  /** Short label for compact navigation. */
  shortName: string;
  /** One-line technical positioning statement. */
  tagline: string;
  /** Two-sentence summary used on cards. */
  summary: string;
  /** Technology badges shown on cards. */
  badges: string[];
}

export const PROJECTS: ProjectMeta[] = [
  {
    slug: 'kitchen-analyzer',
    name: 'KitchenAnalyzer',
    shortName: 'KitchenAnalyzer',
    tagline: 'Ultra-low-power ESP32 kitchen safety monitor',
    summary:
      'Battery-powered ESP32 LOLIN32 device that tracks combustible gas, temperature and humidity in a kitchen, waking on PIR motion to save power and reporting readings on a 16x2 I2C LCD.',
    badges: ['ESP32', 'MQ-2', 'DHT22', 'Low-Power'],
  },
  {
    slug: 'fitness-band',
    name: 'PulseAura Fitness Band',
    shortName: 'PulseAura',
    tagline: 'Full-stack biosignal monitoring platform',
    summary:
      'End-to-end biosignal platform: ESP32 wearable firmware streaming to a C++ backend, a React frontend for live sessions, InfluxDB time-series storage and Grafana dashboards.',
    badges: ['ESP32', 'C++', 'React', 'InfluxDB', 'Grafana'],
  },
  {
    slug: 'touch2usb',
    name: 'Touch2USB',
    shortName: 'Touch2USB',
    tagline: 'RP2040 resistive touch to USB HID bridge',
    summary:
      'Raspberry Pi Pico firmware that reads an XPT2046 resistive touch controller over SPI and converts raw 12-bit coordinates into driverless USB HID digitizer and relative mouse reports.',
    badges: ['RP2040', 'SPI', 'TinyUSB', 'HID'],
  },
  {
    slug: 'ti-microcontroller-flasher',
    name: 'TI Microcontroller Flasher',
    shortName: 'TI Flasher',
    tagline: 'TMS320F28379D firmware flasher and bootloader',
    summary:
      'Firmware flasher and custom bootloader for the TI TMS320F28379D dual-core C2000 microcontroller, with dual-core flashing scripts and a customised Code Composer Studio theme.',
    badges: ['TMS320F28379D', 'C2000', 'Dual-Core', 'CCS'],
  },
];

const PROJECT_MAP = new Map(PROJECTS.map((project) => [project.slug, project]));

/** Returns the display name for a project slug, falling back to the slug. */
export function projectTitle(slug: string): string {
  return PROJECT_MAP.get(slug)?.name ?? slug;
}

/** Returns the full metadata record for a project slug, if it is known. */
export function getProject(slug: string): ProjectMeta | undefined {
  return PROJECT_MAP.get(slug);
}

/** A content entry slug resolved into its project folder and chapter parts. */
export interface DocRoute {
  /** Project folder slug, e.g. `kitchen-analyzer`. */
  project: string;
  /** Chapter slug inside the project; `index` for the landing chapter. */
  chapter: string;
  /** Canonical URL of the chapter. */
  href: string;
}

/**
 * Splits a content collection slug into project and chapter parts.
 *
 * Astro slugs a folder's `index.md` as the folder itself (`kitchen-analyzer`),
 * while every other chapter keeps its relative path (`kitchen-analyzer/esp32`).
 * Both shapes are normalised to the same `index` chapter key here, so the
 * sidebar, breadcrumbs, pagination and search index always agree.
 */
export function resolveDocSlug(slug: string): DocRoute {
  const [project, ...rest] = slug.split('/');
  const chapter = rest.join('/') || 'index';

  return {
    project,
    chapter,
    href:
      chapter === 'index' ? `/projects/${project}/` : `/projects/${project}/${chapter}/`,
  };
}

/** True when a content entry is the landing chapter of its project folder. */
export function isProjectIndex(slug: string): boolean {
  return !slug.includes('/');
}
