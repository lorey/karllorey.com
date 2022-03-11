import markdownToHtml from "../lib/markdownToHtml";
import PageLayout from "../components/page-layout";
import {getPageBySlug} from "../lib/api";
import {useRouter} from "next/router";
import ErrorPage from "next/error";

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
    const page = getPageBySlug('/', [
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