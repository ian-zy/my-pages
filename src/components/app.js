import React from 'react'
import { createHistory, LocationProvider } from '@reach/router'
import { createHashSource, isBrower } from '../utils/createHashSource'

// App container with support for hash router
// This is based on example of [Hash Source] using @reach/router
// https://github.com/will-stone/hash-source/blob/master/README.md
// References:
// [Gatsby Simple Auth Example](https://github.com/gatsbyjs/gatsby/blob/master/examples/simple-auth/src/pages/app.js)
// The example uses client normal routing which needs server redirection to support user visiting the client route directly
// https://www.gatsbyjs.org/docs/authentication-tutorial/#creating-client-only-routes
// [@reach/router createHistory()](https://reach.tech/router/api/createHistory)
// [@reach/router createMemoryStore()](https://github.com/reach/router/blob/master/src/lib/history.js)

class App extends React.Component {
  constructor(props) {
    super(props)
    if (isBrower()) {
      this.history = createHistory(createHashSource())
    }
    console.log("app is initialized")
  }

  render() {
    return isBrower() ? this.renderDynamic() : this.renderStatic()
  }

  renderDynamic() {
    return (
      <LocationProvider history={this.history}>
        {this.props.children}
      </LocationProvider>
    )
  }

  renderStatic() {
    return <h1>This app will only be rendered in browser.</h1>
  }
}

export default App
