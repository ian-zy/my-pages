import React from 'react'
import { Link, Router } from '@reach/router'
import { Link as GLink, navigate } from 'gatsby'
import App from '../components/app'
import Layout from '../components/layout'
import SEO from '../components/seo'

const Page = ({ title, uri, path, location, navigate, children }) => (
  <div>
    <h1>{title}</h1>
    <p>URI: {uri}</p>
    <p>Path: {path}</p>
    <p>location: {JSON.stringify(location)}</p>
    <button onClick={() => navigate('/')}>Back to App Home</button>
    {children}
  </div>
)

const MyApp = () => (
  <App>
    <Layout>
      <SEO title="Page two" />
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="about">About</Link>
          <Link to="about/me">Me</Link>
          <Link to="contact">Contact</Link>
        </nav>
      </header>

      <hr />

      <Router>
        <Page title="Home" path="/" />
        <Page title="About" path="about">
          <Page title="Summary" path="/" ></Page>
          <Page title="Me" path="me" ></Page>
        </Page>
        <Page title="Contact" path="contact" />
      </Router>
      <GLink to="/">Go back to the homepage</GLink>
      <button style={{ display: 'block' }} onClick={() => navigate('/')}>
        You can also click me to go back to home page using navigate
      </button>
    </Layout>
  </App>
)

export default MyApp
