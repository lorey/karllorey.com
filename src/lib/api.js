import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const pagesDirectory = join(process.cwd(), '_pages');
const postsDirectory = join(process.cwd(), '_posts');

function getMarkdownFilesBySlug(directory) {
  // read all files
  const filenames = fs.readdirSync(directory);

  // create mapping from slug to content
  const dataBySlug = {};
  filenames.forEach((filename) => {
    // read file
    const fileContents = fs.readFileSync(join(directory, filename), 'utf8');
    const { data, content } = matter(fileContents);
    const slug = data.slug ? data.slug : filename.replace(/\.md$/, '');
    // store at slug: data
    dataBySlug[slug] = {
      ...data,
      date: data['date'] ? new Date(data['date']).toISOString() : null, // manually overwrite
      content: content, // add raw markdown
      slug: slug,
    };
  });
  return dataBySlug;
}

export function getPageSlugs() {
  return Object.keys(getMarkdownFilesBySlug(pagesDirectory));
}

export function getPageBySlug(slug) {
  const markdownFilesBySlug = getMarkdownFilesBySlug(pagesDirectory);
  const data = markdownFilesBySlug[slug];
  return data;
}

export function getAllPages() {
  const slugs = getPageSlugs();
  const pages = slugs
    .map((slug) => getPageBySlug(slug))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return pages;
}

// Blog posts functions
export function getPostSlugs() {
  return Object.keys(getMarkdownFilesBySlug(postsDirectory));
}

export function getPostBySlug(slug) {
  const markdownFilesBySlug = getMarkdownFilesBySlug(postsDirectory);
  const data = markdownFilesBySlug[slug];
  return data;
}

export function getAllPosts() {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // filter out drafts
    .filter((post) => post.status !== 'draft')
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
