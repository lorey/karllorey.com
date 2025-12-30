import Link from "next/link";
import { formatDate } from "@/lib/date";
import { Post } from "@/types";

interface LatestPostsProps {
  posts: Post[];
  limit?: number;
}

export default function LatestPosts({ posts, limit = 4 }: LatestPostsProps) {
  const displayPosts = posts.slice(0, limit);

  if (displayPosts.length === 0) {
    return null;
  }

  return (
    <>
      <h2>Latest Posts</h2>
      <p>
        What I&apos;ve been writing about, more at{" "}
        <Link href="/blog" className="whitespace-nowrap">/blog</Link>.
      </p>
      <div className="space-y-3 mb-5">
        {displayPosts.map((post) => (
          <div key={post.slug} className="border border-gray-200 rounded p-3">
            <div className="font-medium text-gray-700">
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </div>
            {post.date && (
              <div className="text-sm">{formatDate(post.date)}</div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
