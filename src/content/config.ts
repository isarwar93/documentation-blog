import { defineCollection, z } from 'astro:content';

/**
 * Documentation content collection.
 *
 * Files live in `src/content/projects/<project>/<page>.md`, therefore a slug
 * looks like `kitchen-analyzer/architecture`. The first segment identifies the
 * project, the remaining segments identify the chapter.
 */
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    /** Chapter title, rendered in the sidebar, TOC and search results. */
    title: z.string(),
    /** One-sentence summary used for meta descriptions and search results. */
    description: z.string(),
    /** Project slug this chapter belongs to (must match its folder name). */
    project: z.string(),
    /** Optional short section label used for grouping. */
    section: z.string().optional(),
    /** Sidebar ordering; lower values come first. */
    order: z.number().default(99),
  }),
});

/**
 * Article collection: one folder per series, one file per part.
 *
 * Files live in `src/content/articles/<series-slug>/<part>.md`, so a slug looks
 * like `automated-astro-deployment/github-oidc-to-aws`. The first segment
 * identifies the series (and must equal the folder name), the rest identify the
 * part. The folder's `index.md` is the series landing chapter.
 *
 * Unlike the `projects` collection, articles are written directly in this
 * repository: they have no source repository behind them and are therefore
 * never listed in `docsync.yaml`.
 */
const articles = defineCollection({
  type: 'content',
  schema: z.object({
    /** Part title, rendered in the sidebar, TOC and search. */
    title: z.string(),
    /** One-sentence summary used for meta descriptions, cards and search. */
    description: z.string(),
    /** Series slug this part belongs to (must match its folder name). */
    series: z.string(),
    /** Reading order; the landing `index.md` uses `order: 1`. */
    order: z.number().default(99),
    /** Optional topic labels rendered as chips. */
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { projects, articles };
