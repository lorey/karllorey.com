import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import { getPostBySlug, getAllPosts } from '../../lib/api'
import markdownToHtml from '../../lib/markdownToHtml'
import PageLayout from '../../components/page-layout'
import Markdown from "../../components/markdown";
import DateFormatter from "../../components/date-formatter";

export default function Post({ post, morePosts, preview }) {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
        <PageLayout>
          <title>{post.title} - Lorey Ipsum</title>
          <article>
            <h1 className="mb-0">{post.title}</h1>
            <p className="mt-0 mb-1">
              <small>created <DateFormatter dateString={post.date} /></small>
            </p>

            <Markdown html={post.content} />
          </article>
        </PageLayout>
      )
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'ogImage',
    'coverImage',
  ])
  const content = await markdownToHtml(post.content || '')
  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}
