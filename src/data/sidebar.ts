import { getProjectDocs } from './docs';
import { getSeriesDocs } from './articles';

/** One entry in the sidebar tree. */
export interface SidebarPage {
  title: string;
  href: string;
  active: boolean;
}

/** A collapsible group of pages: a project, or an article series. */
export interface SidebarGroup {
  slug: string;
  /** Full group name shown as the heading. */
  label: string;
  /** Count caption, e.g. `9 chapters` or `9 parts`. */
  countLabel: string;
  active: boolean;
  pages: SidebarPage[];
}

/** A titled block of groups, e.g. "Projects" or "Articles". */
export interface SidebarSection {
  title: string;
  groups: SidebarGroup[];
}

/** Identifies the page currently open, so the sidebar can mark it. */
export interface ActiveEntry {
  section: 'projects' | 'articles';
  /** Project slug or series slug. */
  slug: string;
  /** Chapter or part slug; `index` for a landing page. */
  part: string;
}

/**
 * Builds the sidebar tree used by every documentation and article page.
 *
 * Shared by `ProjectDocLayout` and `ArticleLayout`, so both offer the same
 * navigation: the documented projects and the article series, with the group of
 * the current page open and its page marked.
 */
export async function getSidebarSections(active: ActiveEntry): Promise<SidebarSection[]> {
  const [projectDocs, seriesDocs] = await Promise.all([getProjectDocs(), getSeriesDocs()]);

  const projects: SidebarSection = {
    title: 'Projects',
    groups: projectDocs.map(({ meta, chapters }) => ({
      slug: meta.slug,
      label: meta.name,
      countLabel: `${chapters.length} ${chapters.length === 1 ? 'chapter' : 'chapters'}`,
      active: active.section === 'projects' && active.slug === meta.slug,
      pages: chapters.map((chapter) => ({
        title: chapter.title,
        href: chapter.href,
        active:
          active.section === 'projects' &&
          active.slug === meta.slug &&
          chapter.slug === active.part,
      })),
    })),
  };

  const articles: SidebarSection = {
    title: 'Articles',
    groups: seriesDocs.map(({ meta, parts }) => ({
      slug: meta.slug,
      label: meta.name,
      countLabel: `${parts.length} ${parts.length === 1 ? 'part' : 'parts'}`,
      active: active.section === 'articles' && active.slug === meta.slug,
      pages: parts.map((part) => ({
        title: part.title,
        href: part.href,
        active:
          active.section === 'articles' && active.slug === meta.slug && part.slug === active.part,
      })),
    })),
  };

  return [projects, articles];
}