import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

const postsDirectory = join(process.cwd(), '_posts')
const pagesDirectory = join(process.cwd(), '_pages')

function getMarkdownFilesBySlug(directory) {
  // read all files
  const filenames = fs.readdirSync(directory)

  // create mapping from slug to content
  const dataBySlug = {}
  filenames.forEach((filename) => {
    // read file
    const fileContents = fs.readFileSync(join(directory, filename), 'utf8')
    const { data, content } = matter(fileContents)
    const slug = data.slug ? data.slug : filename.replace(/\.md$/, '')
    // store at slug: data
    dataBySlug[slug] = {
      ...data,
      date: new Date(data['date']).toISOString(), // manually overwrite
      content: content, // add raw markdown
      slug: slug
    }
  })
  return dataBySlug
}

export function getPostSlugs() {
  return Object.keys(getMarkdownFilesBySlug(postsDirectory))
}

export function getPageSlugs() {
  return Object.keys(getMarkdownFilesBySlug(pagesDirectory))
}

export function getPostBySlug(slug, fields = []) {
  return getMarkdownFilesBySlug(postsDirectory)[slug]
}

export function getPageBySlug(slug, fields = []) {
  const markdownFilesBySlug = getMarkdownFilesBySlug(pagesDirectory);
  const data = markdownFilesBySlug[slug];
  return data
}

export function getAllPosts(fields = []) {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}
export function getAllPages(fields = []) {
  const slugs = getPageSlugs()
  const pages = slugs
      .map((slug) => getPageBySlug(slug, fields))
      // sort posts by date in descending order
      .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return pages
}
