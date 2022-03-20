import {useRouter} from "next/router";
import ErrorPage from "next/error";
import {getAllPages, getPageBySlug} from "../lib/api";
import markdownToHtml from "../lib/markdownToHtml";
import PageLayout from "../components/page-layout";
import Markdown from "../components/markdown";

export default function Page({page}) {
    const router = useRouter()
    if (!router.isFallback && !page?.slug) {
        //console.log(router.isFallback, page)
        return <ErrorPage statusCode={404} />
    }
    return (
        <PageLayout>
            <title>{page.title}</title>
            <h1>{page.title}</h1>
            <Markdown html={page.content} />
        </PageLayout>
    )
}

export async function getStaticProps({ params }) {
    const slug = params.slug ? params.slug.join("/") : '/';
    const page = getPageBySlug(slug, [
        'title',
        'slug',
        'author',
        'content',
        'ogImage',
        'coverImage',
    ])
    const content = await markdownToHtml(page.content || '')
    return {
        props: {
            page: {
                ...page,
                content,
            },
        },
    }
}

export async function getStaticPaths() {
    const posts = getAllPages(['slug'])

    return {
        paths: posts.map((post) => {
            if(post.slug !== "/") {
                // regular page
                return {
                    params: {
                        slug: post.slug.split("/"),
                    },
                }
            } else {
                // index
                return {
                    params: {
                        slug: []
                    },
                }
            }
        }),
        fallback: false,
    }
}
