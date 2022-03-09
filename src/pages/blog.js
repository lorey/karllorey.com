import React from "react"
import {graphql} from "gatsby"
import Page from "../components/page";

function BlogList(props) {
    const listItems = props.items.map((node) =>
        <li key={node.fields.slug} className="py-3">
            {node.frontmatter.date}: <br/><a href={"/blog/" + node.fields.slug}>{node.frontmatter.title}</a>
        </li>
    );
    return <ul>{listItems}</ul>
}

export default function Blog({
                                 data, // this prop will be injected by the GraphQL query below.
                             }) {
    const {allMarkdownRemark} = data // data.markdownRemark holds your post data
    const items = allMarkdownRemark.nodes.filter(node => node.parent.sourceInstanceName === 'markdown-posts');
    return (
        <Page>
            <div className="blog-post-container">
                <div className="blog-post">
                    <h1>Blog</h1>
                    <BlogList items={items}/>
                </div>
            </div>
        </Page>
    )
}
export const pageQuery = graphql`
    query {
        allMarkdownRemark(sort: {fields: frontmatter___date, order: DESC}) {
            nodes {
                html
                fields {
                    slug
                }
                frontmatter {
                    title
                    date(formatString: "MMMM DD, YYYY")
                    slug
                }
                parent {
                    ... on File {
                        sourceInstanceName
                    }
                }
            }
        }
    }
`
