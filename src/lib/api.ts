import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import { PostStatus } from "@/types";

const pagesDirectory = join(process.cwd(), "_pages");
const postsDirectory = join(process.cwd(), "_posts");
const projectsDirectory = join(process.cwd(), "_projects");

interface MarkdownData {
  [key: string]: unknown;
  date?: string | null;
  content: string;
  slug: string;
  status?: PostStatus;
  folderName?: string | null;
}

// Transforms relative image paths (./image.png) to absolute paths (/img/posts/folder/image.png)
function transformRelativeImagePaths(
  content: string,
  folderName: string | null
): string {
  if (!folderName) return content;

  // Match markdown images: ![alt](./path) and HTML images: src="./path"
  return content
    .replace(/\]\(\.\//g, `](/img/posts/${folderName}/`)
    .replace(/src="\.\//g, `src="/img/posts/${folderName}/`);
}

function isListedStatus(status?: PostStatus): boolean {
  return !status || status === "published" || status === "highlighted";
}

interface MarkdownFilesBySlug {
  [slug: string]: MarkdownData;
}

// Finds the markdown file path for an entry (file or folder)
// Returns null for non-markdown entries (e.g. .DS_Store)
function findMarkdownFile(
  directory: string,
  entry: fs.Dirent
): { path: string; folderName: string | null } | null {
  // Folder-based post: _posts/my-post/index.md
  if (entry.isDirectory()) {
    const indexMd = join(directory, entry.name, "index.md");
    const indexMdx = join(directory, entry.name, "index.mdx");

    if (fs.existsSync(indexMd)) {
      return { path: indexMd, folderName: entry.name };
    }
    if (fs.existsSync(indexMdx)) {
      return { path: indexMdx, folderName: entry.name };
    }

    console.warn(
      `Warning: Folder "${entry.name}" in ${directory} has no index.md or index.mdx`
    );
    return null;
  }

  // Flat file: _posts/my-post.md
  if (entry.name.match(/\.(md|mdx)$/)) {
    return { path: join(directory, entry.name), folderName: null };
  }

  // Non-markdown file, skip silently (e.g. .DS_Store)
  return null;
}

function getMarkdownFilesBySlug(directory: string): MarkdownFilesBySlug {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const dataBySlug: MarkdownFilesBySlug = {};

  for (const entry of entries) {
    const markdownFile = findMarkdownFile(directory, entry);
    if (!markdownFile) continue;

    const fileContents = fs.readFileSync(markdownFile.path, "utf8");
    const { data, content } = matter(fileContents);

    // Use frontmatter slug, or folder name, or filename (in that order)
    const slug =
      data.slug ||
      markdownFile.folderName ||
      entry.name.replace(/\.(md|mdx)$/, "");

    dataBySlug[slug] = {
      ...data,
      date: data["date"] ? new Date(data["date"]).toISOString() : null,
      content: transformRelativeImagePaths(content, markdownFile.folderName),
      slug: slug,
      folderName: markdownFile.folderName,
    };
  }

  return dataBySlug;
}

export function getPageSlugs(): string[] {
  return Object.keys(getMarkdownFilesBySlug(pagesDirectory));
}

export function getPageBySlug(slug: string): MarkdownData {
  const markdownFilesBySlug = getMarkdownFilesBySlug(pagesDirectory);
  const data = markdownFilesBySlug[slug];
  return data;
}

export function getAllPages(): MarkdownData[] {
  const slugs = getPageSlugs();
  const pages = slugs
    .map((slug) => getPageBySlug(slug))
    // sort pages by date in descending order
    .sort((post1, post2) => {
      if (!post1.date || !post2.date) return 0;
      return post1.date > post2.date ? -1 : 1;
    });
  return pages;
}

// Blog posts functions
export function getPostSlugs(): string[] {
  return Object.keys(getMarkdownFilesBySlug(postsDirectory));
}

export function getPostBySlug(slug: string): MarkdownData {
  const markdownFilesBySlug = getMarkdownFilesBySlug(postsDirectory);
  const data = markdownFilesBySlug[slug];
  return data;
}

export function getAllPosts(): MarkdownData[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // sort posts by date in descending order
    .sort((post1, post2) => {
      if (!post1.date || !post2.date) return 0;
      return post1.date > post2.date ? -1 : 1;
    });
  return posts;
}

export function getListedPosts(): MarkdownData[] {
  return getAllPosts().filter((post) => isListedStatus(post.status));
}

export function getRecentPosts(months: number = 12): MarkdownData[] {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);
  return getListedPosts().filter(
    (post) => post.date && new Date(post.date) >= cutoff
  );
}

// Project functions
export function getProjectSlugs(): string[] {
  return Object.keys(getMarkdownFilesBySlug(projectsDirectory));
}

export function getProjectBySlug(slug: string): MarkdownData {
  const markdownFilesBySlug = getMarkdownFilesBySlug(projectsDirectory);
  return markdownFilesBySlug[slug];
}

export function getAllProjects(): MarkdownData[] {
  const slugs = getProjectSlugs();
  return (
    slugs
      .map((slug) => getProjectBySlug(slug))
      // sort by lastUpdated descending
      .sort((a, b) => {
        const dateA = a.lastUpdated as string | undefined;
        const dateB = b.lastUpdated as string | undefined;
        if (!dateA || !dateB) return 0;
        return dateA > dateB ? -1 : 1;
      })
  );
}
