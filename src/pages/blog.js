import React from "react"
import {graphql} from "gatsby"
import Page from "../components/page";

function BlogList(props) {
    const listItems = props.items.map((node) =>
        <li key={node.fields.slug} className="py-3">
            {node.frontmatter.date}: <br/>
            <a href={"/posts/" + node.fields.slug}>{node.frontmatter.title}</a>
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
                    <h1>Lorey Ipsum</h1>
                    <p>Blogging mostly about tech.</p>
                    <BlogList items={items}/>
                </div>
            </div>
        </Page>
    )
}
export const pageQuery = graphql`
    query {
        allMarkdownRemark(sort: {fields: frontmatter___date, order: DESC}, filter: {frontmatter: {status: {ne: "draft"}}}) {
            nodes {
                html
                fields {
                    slug
                }
                frontmatter {
                    title
                    date(formatString: "MMMM DD, YYYY")
                    slug
                    status
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
