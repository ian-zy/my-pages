import React from 'react'
import { graphql, Link } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'

export default ({ data }) => {
  const post = data.markdownRemark
  const title = post.frontmatter.title
  return (
    <Layout>
      <SEO title={title} />
      <h1>{title}</h1>
      <h4>{post.fields.date}</h4>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
      <Link to="/">Go back to the homepage</Link>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
      fields {
        date(formatString: "DD MMMM, YYYY")
      }
    }
  }
`
