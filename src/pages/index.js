import React from 'react'
import { graphql, Link } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <SEO title="Home" keywords={[`ian-zy`, `developer`, `blogs`]} />
      <div>
        <h2>Blog Posts</h2>
        <ul>
          {data.allMarkdownRemark.edges.map(({ node }) => (
            <li key={node.id}>
              <Link to={node.fields.slug}>
                {node.frontmatter.title} - {node.fields.date}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Link to="/app/">Check out my awesome dynamic app!</Link>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query {
    allMarkdownRemark(filter: { fields: { category: { eq: "blog" } } }) {
      edges {
        node {
          id
          frontmatter {
            title
          }
          fields {
            slug
            date(formatString: "DD MMMM, YYYY")
          }
        }
      }
    }
  }
`
