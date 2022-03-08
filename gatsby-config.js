module.exports = {
    siteMetadata: {
        title: "Karl Lorey",
        siteUrl: `https://karllorey.com`,
    },
    plugins: [
        'gatsby-plugin-postcss',
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'markdown-pages',
                path: `${__dirname}/src/pages-md`
            }
        },
        'gatsby-transformer-remark',
    ]
}