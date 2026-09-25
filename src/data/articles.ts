import { getCollection } from 'astro:content';
import { ARTICLE_SERIES, seriesTitle, type ArticleSeriesMeta } from './series';

/** A single part of an article series. */
export interface ArticlePart {
  /** Part slug inside the series; `index` for the series landing chapter. */
  slug: string;
  /** Part title taken from frontmatter. */
  title: string;
  /** Part summary taken from frontmatter. */
  description: string;
  /** Frontmatter `order`, defaulting to 99 so unordered parts sort last. */
  order: number;
  /** Topic labels taken from frontmatter. */
  tags: string[];
  /** Canonical URL of the part. */
  href: string;
}

/** An article series together with its parts. */
export interface SeriesDocs {
  meta: ArticleSeriesMeta;
  parts: ArticlePart[];
}

/** A content entry slug resolved into its series and part. */
export interface ArticleRoute {
  /** Series folder slug, e.g. `automated-astro-deployment`. */
  series: string;
  /** Part slug inside the series; `index` for the landing chapter. */
  part: string;
  /** Canonical URL of the part. */
  href: string;
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** Formats a date as `25 Sep 2026` without depending on the build locale. */
export function formatArticleDate(date: Date): string {
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** `YYYY-MM-DD`, for the `datetime` attribute of `<time>`. */
export function articleDateValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Splits a content collection slug into series and part.
 *
 * Astro slugs a folder's `index.md` as the folder itself, while every other
 * part keeps its relative path. Both shapes are normalised to the same `index`
 * part key here, so the sidebar, breadcrumbs, pagination and search index
 * always agree - the same rule `resolveDocSlug()` applies to project chapters.
 */
export function resolveArticleSlug(slug: string): ArticleRoute {
  const [series, ...rest] = slug.split('/');
  const part = rest.join('/') || 'index';

  return {
    series,
    part,
    href: part === 'index' ? `/articles/${series}/` : `/articles/${series}/${part}/`,
  };
}

/** True when a content entry is the landing chapter of its series folder. */
export function isSeriesIndex(slug: string): boolean {
  return !slug.includes('/');
}

/**
 * Groups every article part by series, ordered by frontmatter `order`.
 *
 * Mirrors `getProjectDocs()`: the landing `index.md` carries `order: 1`, so a
 * series reads as an ordered set of parts.
 */
export async function getSeriesDocs(): Promise<SeriesDocs[]> {
  const entries = await getCollection('articles');

  return ARTICLE_SERIES.map((meta) => {
    const parts = entries
      .map((entry) => ({ entry, route: resolveArticleSlug(entry.slug) }))
      .filter(({ route }) => route.series === meta.slug)
      .map(({ entry, route }) => ({
        slug: route.part,
        title: entry.data.title,
        description: entry.data.description,
        order: entry.data.order ?? 99,
        tags: entry.data.tags,
        href: route.href,
      }))
      .sort((a, b) => a.order - b.order);

    return { meta, parts };
  });
}

/** Flat list of every part grouped by series name - used by the search index. */
export async function getArticleIndex(): Promise<
  { title: string; group: string; description: string; href: string }[]
> {
  const seriesDocs = await getSeriesDocs();

  return seriesDocs.flatMap(({ meta, parts }) =>
    parts.map((part) => ({
      title: part.title,
      group: seriesTitle(meta.slug),
      description: part.description,
      href: part.href,
    })),
  );
}
