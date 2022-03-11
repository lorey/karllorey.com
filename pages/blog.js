import {getAllPosts} from "../lib/api";
import PageLayout from "../components/page-layout";
import DateFormatter from "../components/date-formatter";
import Link from 'next/link'

function BlogList(props) {
    const items = props.items
    const listItems = items.map((post) =>
        <li key={post.slug} className="py-3">
            <DateFormatter dateString={post.date} />: <br/>
            <Link href={"/posts/" + post.slug}>{post.title}</Link>
        </li>
    );
    return <ul>{listItems}</ul>
}

export default function Blog({posts}) {
    return (
        <PageLayout>
            <main className="page">
                <div className="blog-post-container">
                    <div className="blog-post">
                        <h1>Lorey Ipsum</h1>
                        <p>Blogging mostly about tech.</p>
                        <BlogList items={posts}/>
                    </div>
                </div>
            </main>
        </PageLayout>
    )
}

export async function getStaticProps({ params }) {
    const posts = getAllPosts()
    return {
        props: {
            posts,
        },
    }
}
