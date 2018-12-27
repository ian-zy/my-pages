/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

function updateMarkdownBlogNode(node, getNode, createNodeField) {
  if (node.internal.type !== 'MarkdownRemark') return
  const fileNode = getNode(node.parent)
  if (fileNode.sourceInstanceName !== 'blog') return
  const slug = `/blogs${createFilePath({ node, getNode })}`
  createNodeField({ node, name: 'slug', value: slug })
  createNodeField({ node, name: 'category', value: 'blog' })
  createNodeField({ node, name: 'date', value: fileNode.modifiedTime })
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  updateMarkdownBlogNode(node, getNode, createNodeField)
}

function createBlogPages(graphql, createPage) {
  const query = `
    {
      allMarkdownRemark(filter: { fields: { category: { eq: "blog" } } }) {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `

  return graphql(query).then(result => {
    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      createPage({
        path: node.fields.slug,
        component: path.resolve('./src/templates/blog.js'),
        context: {
          slug: node.fields.slug,
        },
      })
    })
  })
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return createBlogPages(graphql, createPage)
}
