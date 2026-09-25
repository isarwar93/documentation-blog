/**
 * Shared shape of the headings Astro extracts from rendered Markdown.
 *
 * Used by both documentation layouts for the "On this page" list, so the
 * table of contents stays identical on chapter and article pages.
 */
export interface TocHeading {
  depth: number;
  slug: string;
  text: string;
}
