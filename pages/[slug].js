import {useRouter} from "next/router";
import ErrorPage from "next/error";
import {getAllPages, getPageBySlug} from "../lib/api";
import markdownToHtml from "../lib/markdownToHtml";
import PageLayout from "../components/page-layout";

export default function Page({page}) {
    const router = useRouter()
    if (!router.isFallback && !page?.slug) {
        //console.log(router.isFallback, page)
        return <ErrorPage statusCode={404} />
    }
    return (
        <PageLayout>
            <h1>{page.title}</h1>
            <div dangerouslySetInnerHTML={{__html: page.content}} />
        </PageLayout>
    )
}

export async function getStaticProps({ params }) {
    const page = getPageBySlug(params.slug, [
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
            return {
                params: {
                    slug: post.slug,
                },
            }
        }),
        fallback: false,
    }
}
