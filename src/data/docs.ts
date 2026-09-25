import { getCollection } from 'astro:content';
import { PROJECTS, resolveDocSlug, type ProjectMeta } from './projects';

/** A single documentation chapter of a project. */
export interface DocChapter {
  /** Chapter slug inside the project; `index` for the landing chapter. */
  slug: string;
  /** Chapter title taken from frontmatter. */
  title: string;
  /** Chapter summary taken from frontmatter. */
  description: string;
  /** Frontmatter `order`, defaulting to 99 so unordered chapters sort last. */
  order: number;
  /** Canonical URL of the chapter. */
  href: string;
}

/** A documented project together with its chapters. */
export interface ProjectDocs {
  meta: ProjectMeta;
  chapters: DocChapter[];
}

/**
 * Groups every documented chapter by project, ordered by frontmatter `order`.
 *
 * Shared by the sidebar, the landing pages and the search index so the chapter
 * list is derived once from the content collection instead of per page.
 */
export async function getProjectDocs(): Promise<ProjectDocs[]> {
  const docs = await getCollection('projects');

  return PROJECTS.map((meta) => {
    const chapters = docs
      .map((entry) => ({ entry, route: resolveDocSlug(entry.slug) }))
      .filter(({ route }) => route.project === meta.slug)
      .map(({ entry, route }) => ({
        slug: route.chapter,
        title: entry.data.title,
        description: entry.data.description,
        order: entry.data.order ?? 99,
        href: route.href,
      }))
      .sort((a, b) => a.order - b.order);

    return { meta, chapters };
  });
}
