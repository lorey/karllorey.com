import React from "react"
import {graphql} from "gatsby"
import Page from "../components/page";

export default function Template({
                                     data, // this prop will be injected by the GraphQL query below.
                                 }) {
    const {markdownRemark} = data // data.markdownRemark holds your post data
    const {frontmatter, html} = markdownRemark
    return (
        <Page>
            <div className="blog-post-container">
                <div className="blog-post">
                    <h1>{frontmatter.title}</h1>
                    <div
                        className="blog-post-content"
                        dangerouslySetInnerHTML={{__html: html}}
                    />
                    <p>created on {frontmatter.date}</p>
                </div>
            </div>
        </Page>
    )
}
export const pageQuery = graphql`
    query($id: String!) {
        markdownRemark(id: { eq: $id }) {
            html
            frontmatter {
                date(formatString: "MMMM DD, YYYY")
                slug
                title
            }
        }
    }
`