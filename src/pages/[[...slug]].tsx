import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import { getAllPages, getPageBySlug } from '../lib/api';
import PageLayout from '../components/PageLayout';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkFrontmatter from 'remark-frontmatter';

interface PageProps {
  page: {
    title?: string;
    slug: string;
    date?: string;
    content: string;
  };
  mdxSource: MDXRemoteSerializeResult;
}

export default function Page({ page, mdxSource }: PageProps) {
  const router = useRouter();
  if (!router.isFallback && !page?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <PageLayout>
      {page.title && <h1>{page.title}</h1>}
      <div className="markdown">
        <MDXRemote {...mdxSource} />
      </div>
    </PageLayout>
  );
}

export async function getStaticProps({
  params,
}: {
  params: { slug?: string[] };
}) {
  const slug = params?.slug ? params.slug.join('/') : '/';
  const page = getPageBySlug(slug);

  if (!page) {
    return {
      notFound: true,
    };
  }

  const mdxSource = await serialize(page.content || '', {
    mdxOptions: {
      remarkPlugins: [remarkFrontmatter],
    },
  });

  return {
    props: {
      page,
      mdxSource,
    },
  };
}

export async function getStaticPaths() {
  const pages = getAllPages();

  return {
    paths: pages.map((page) => {
      if (page.slug !== '/') {
        // regular page
        return {
          params: {
            slug: page.slug.split('/'),
          },
        };
      } else {
        // index
        return {
          params: {
            slug: false,
          },
        };
      }
    }),
    fallback: false,
  };
}
