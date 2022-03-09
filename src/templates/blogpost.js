import React from "react"
import { graphql } from "gatsby"
import Page from "../components/page";

export default function BlogPost({ data }) {
    const post = data.markdownRemark

    return (
        <Page>
            <div>
                <h1>{post.frontmatter.title}</h1>
                <small>{post.frontmatter.date}</small>
                <div dangerouslySetInnerHTML={{ __html: post.html }} />
            </div>
        </Page>
    )
}
export const query = graphql`
    query BlogQuery($slug: String!) {
        markdownRemark(fields: { slug: { eq: $slug } }) {
            html
            frontmatter {
                title
                date
            }
        }
    }
`