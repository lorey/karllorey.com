import { useRouter } from "next/router";
import ErrorPage from "next/error";
import {
  getAllPages,
  getPageBySlug,
  getRecentPosts,
  getAllProjects,
} from "../lib/api";
import PageLayout from "../components/PageLayout";
import SEO from "../components/SEO";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkFrontmatter from "remark-frontmatter";
import LatestProjects from "../components/LatestProjects";
import LatestPosts from "../components/LatestPosts";
import ProjectList from "../components/ProjectList";
import Signature from "../components/Signature";
import { Project, Post, ProjectType } from "../types";

interface PageProps {
  page: {
    title?: string;
    showTitle?: boolean;
    slug: string;
    date?: string;
    description?: string;
    content: string;
  };
  mdxSource: MDXRemoteSerializeResult;
  projects?: Project[];
  posts?: Post[];
}

export default function Page({ page, mdxSource, projects, posts }: PageProps) {
  const router = useRouter();
  if (!router.isFallback && !page?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  // Create MDX components with data injected
  const components = {
    LatestProjects: () => <LatestProjects projects={projects || []} />,
    LatestPosts: () => <LatestPosts posts={posts || []} />,
    ProjectList: ({ type }: { type?: ProjectType }) => (
      <ProjectList projects={projects || []} type={type} />
    ),
    Signature: () => <Signature />,
  };

  const showTitle = page.showTitle !== false;
  const path = page.slug === "/" ? "/" : `/${page.slug}`;

  return (
    <PageLayout>
      <SEO
        title={page.title || "Karl Lorey"}
        description={page.description}
        path={path}
        addSuffix={page.slug !== "/"}
      />
      {showTitle && page.title && <h1>{page.title}</h1>}
      <div className="markdown">
        <MDXRemote {...mdxSource} components={components} />
      </div>
    </PageLayout>
  );
}

export async function getStaticProps({
  params,
}: {
  params: { slug?: string[] };
}) {
  const slug = params?.slug ? params.slug.join("/") : "/";
  const page = getPageBySlug(slug);

  if (!page) {
    return {
      notFound: true,
    };
  }

  const mdxSource = await serialize(page.content || "", {
    mdxOptions: {
      remarkPlugins: [remarkFrontmatter],
    },
  });

  // Fetch projects and posts for pages that need them
  const needsProjects = slug === "/" || slug === "portfolio";
  const needsPosts = slug === "/";

  const projects = needsProjects
    ? getAllProjects().map((p) => ({
        title: p.title as string,
        slug: p.slug,
        description: p.description as string,
        url: (p.url as string) || null,
        github: (p.github as string) || null,
        type: (p.type as ProjectType) || "product",
        launchYear: p.launchDate
          ? new Date(p.launchDate as string).getFullYear()
          : null,
      }))
    : undefined;

  const posts = needsPosts
    ? getRecentPosts().map((p) => ({
        title: p.title as string,
        slug: p.slug,
        date: p.date,
      }))
    : undefined;

  return {
    props: {
      page,
      mdxSource,
      ...(projects && { projects }),
      ...(posts && { posts }),
    },
  };
}

export async function getStaticPaths() {
  const pages = getAllPages();

  return {
    paths: pages.map((page) => {
      if (page.slug !== "/") {
        // regular page
        return {
          params: {
            slug: page.slug.split("/"),
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
