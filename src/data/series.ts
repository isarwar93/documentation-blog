/**
 * Article series metadata.
 *
 * Mirrors `PROJECTS`: the collection holds the prose, this array holds the
 * wording used by the navigation, the sidebar, the card and the search index,
 * so an article series is described identically everywhere.
 */
export interface ArticleSeriesMeta {
  /** Folder name inside `src/content/articles/` and URL segment. */
  slug: string;
  /** Full display name. */
  name: string;
  /** Short label for compact navigation. */
  shortName: string;
  /** One-line technical positioning statement. */
  tagline: string;
  /** Two-sentence summary used on the card. */
  summary: string;
  /** Publication date of the series. */
  pubDate: Date;
  /** Topic labels shown on the card and beside the date. */
  tags: string[];
}

export const ARTICLE_SERIES: ArticleSeriesMeta[] = [
  {
    slug: 'aws-s3-cloudfront-deployment',
    name: 'AWS S3 and CloudFront Deployment',
    shortName: 'S3 + CloudFront',
    tagline: 'Deploying an Astro site to S3 and CloudFront from GitHub Actions with OIDC',
    summary:
      'A written series on deploying an Astro site to Amazon S3 behind CloudFront from GitHub Actions, without storing long-lived AWS credentials: OIDC, IAM, a private bucket, clean URLs, and the failures you hit on the way.',
    pubDate: new Date('2026-09-25'),
    tags: ['AWS', 'S3', 'CloudFront', 'GitHub Actions'],
  },
  {
    slug: 'yocto-project',
    name: 'Yocto Project',
    shortName: 'Yocto',
    tagline: 'Building customized, reproducible embedded Linux with Yocto',
    summary:
      'A written series on the Yocto Project: what it actually is, how BitBake, recipes and layers work, and how to build a customized embedded Linux image for an NXP i.MX7 board and a Raspberry Pi 3.',
    pubDate: new Date('2026-09-25'),
    tags: ['Yocto', 'Embedded Linux', 'BitBake', 'i.MX7'],
  },
];

const SERIES_MAP = new Map(ARTICLE_SERIES.map((series) => [series.slug, series]));

/** Returns the display name for a series slug, falling back to the slug. */
export function seriesTitle(slug: string): string {
  return SERIES_MAP.get(slug)?.name ?? slug;
}

/** Returns the full metadata record for a series slug, if it is known. */
export function getSeries(slug: string): ArticleSeriesMeta | undefined {
  return SERIES_MAP.get(slug);
}