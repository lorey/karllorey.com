import React from "react"
import { graphql } from "gatsby"
import Page from "../components/page";

export default function BlogPost({ data }) {
    const post = data.markdownRemark

    return (
        <Page>
            <div>
                <h1>{post.frontmatter.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: post.html }} />
                <p className="mt-5">
                    <small>created {post.frontmatter.date}</small>
                </p>
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
                date(formatString: "MMMM DD, YYYY")
            }
        }
    }
`