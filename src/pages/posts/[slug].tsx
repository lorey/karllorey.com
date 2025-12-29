import { useRouter } from "next/router";
import ErrorPage from "next/error";
import { getAllPosts, getPostBySlug } from "../../lib/api";
import { formatDate } from "../../lib/date";
import PageLayout from "../../components/PageLayout";
import SEO from "../../components/SEO";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkFrontmatter from "remark-frontmatter";

interface PostProps {
  post: {
    title?: string;
    slug: string;
    date?: string;
    description?: string;
    content: string;
  };
  mdxSource: MDXRemoteSerializeResult;
}

export default function Post({ post, mdxSource }: PostProps) {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <PageLayout>
      <SEO
        title={post.title || "Blog Post"}
        description={post.description}
        path={`/posts/${post.slug}`}
        type="article"
        publishedDate={post.date}
      />
      {post.title && <h1>{post.title}</h1>}
      {post.date && (
        <div className="text-gray-400 text-sm mb-8">
          {formatDate(post.date)}
        </div>
      )}
      <div className="markdown">
        <MDXRemote {...mdxSource} />
      </div>
    </PageLayout>
  );
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  const mdxSource = await serialize(post.content || "", {
    mdxOptions: {
      remarkPlugins: [remarkFrontmatter],
    },
  });

  return {
    props: {
      post,
      mdxSource,
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts();

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
