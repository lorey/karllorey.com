const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
    const { createNodeField } = actions

    if (node.internal.type === `MarkdownRemark`) {
        const slug = createFilePath({ node, getNode, basePath: `pages` })
        createNodeField({
            node,
            name: `slug`,
            value: node.frontmatter.slug ? node.frontmatter.slug : slug,
        })
    }
}

exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions
    const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
                slug
            }
            parent {
                ... on File {
                    sourceInstanceName
                } 
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `)

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        const dir = node.parent.sourceInstanceName === "markdown-posts" ? 'blog' : ''
        const slug = node.frontmatter.slug ? node.frontmatter.slug : node.fields.slug;
        createPage({
            path: dir ? dir + '/' + slug : slug,
            component: path.resolve(`./src/templates/blogpost.js`),
            context: {
                // Data passed to context is available
                // in page queries as GraphQL variables.
                slug: node.fields.slug,
            },
        })
    })
}