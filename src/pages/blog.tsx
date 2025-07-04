import { getAllPosts } from "../lib/api";
import PageLayout from "../components/PageLayout";
import Link from "next/link";

interface Post {
  title: string;
  slug: string;
  date: string;
}

interface BlogListProps {
  items: Post[];
}

function BlogList({ items }: BlogListProps) {
  const listItems = items.map((post) => (
    <li key={post.slug} className="py-3">
      {new Date(post.date).toLocaleDateString()}: <br />
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
      <h1>Lorey Ipsum</h1>
      <p>Blogging mostly about tech.</p>
      <BlogList items={posts} />
    </PageLayout>
  );
}

export async function getStaticProps() {
  const posts = getAllPosts();
  return {
    props: {
      posts,
    },
  };
}
