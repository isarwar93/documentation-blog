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

export const collections = { projects };
