import { getListedPosts } from "../lib/api";
import { formatDate } from "../lib/date";
import PageLayout from "../components/PageLayout";
import SEO from "../components/SEO";
import Link from "next/link";
import { Post } from "../types";

interface BlogListProps {
  items: Post[];
}

function BlogList({ items }: BlogListProps) {
  const listItems = items.map((post) => (
    <li key={post.slug} className="py-3">
      {formatDate(post.date)}: <br />
      <Link href={"/posts/" + post.slug}>{post.title}</Link>
    </li>
  ));
  return <ul>{listItems}</ul>;
}

interface BlogProps {
  posts: Post[];
}

export default function Blog({ posts }: BlogProps) {
  return (
    <PageLayout>
      <SEO title="Blog" description="Tech blog by Karl Lorey" path="/blog" />
      <h1>Lorey Ipsum</h1>
      <p>Blogging mostly about tech.</p>
      <BlogList items={posts} />
    </PageLayout>
  );
}

export async function getStaticProps() {
  const posts = getListedPosts();
  return {
    props: {
      posts,
    },
  };
}
