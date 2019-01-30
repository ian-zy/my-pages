import React from 'react'
import styled from 'styled-components'
import Spa from '../components/app'

const App = () => (
  <Spa>
    <GhMarkApp />
  </Spa>
)
export default App

class GithubQueryer {
  constructor({ userId, accessToken }) {
    this.userId = userId
    this.accessToken = accessToken
  }

  async query(query) {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `bearer ${this.accessToken}`,
      },
      body: JSON.stringify({ query }),
    })
    return response.json()
  }

  async queryStaredRepoCount() {
    const response = await this.query(`{
      user(login: "${this.userId}") {
        starredRepositories(first: 2) {
          totalCount
        }
      }
    }`)
    return response.data.user.starredRepositories.totalCount
  }

  async getAllStarredRepo() {
    const totalCount = await this.queryStaredRepoCount()
    const starredRepos = []
    const BATCH_SIZE = 100
    let cursor = null
    for (let i = 0; i <= totalCount / BATCH_SIZE; i++) {
      const repos = await this.queryRepos(BATCH_SIZE, cursor)
      starredRepos.push(...repos)
      cursor = repos[repos.length - 1].cursor
    }
    return starredRepos
  }

  async queryRepos(size, startCursor) {
    const afterField = startCursor === null ? '' : `after: "${startCursor}",`
    const response = await this.query(`{
      user(login: "${this.userId}") {
        starredRepositories(first: ${size}, ${afterField} orderBy: {field: STARRED_AT, direction: DESC}) {
          edges {
            cursor
            node {
              id
              name
              description
              nameWithOwner
              owner {
                login
              }
              url
              primaryLanguage {
                name
              }
              languages(first: 20) {
                nodes {
                  name
                }
              }  
            }
          }
        }
      }
    }`)
    return response.data.user.starredRepositories.edges.map(
      ({ node, cursor }) => ({
        ...node,
        owner: node.owner.login,
        primaryLanguage: node.primaryLanguage ? node.primaryLanguage.name : '',
        languages: node.languages.nodes.map(({ name }) => name),
        cursor,
      })
    )
  }
}

const RepoList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`

const RepoItem = styled.li`
  margin: 10px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
`

const RepoLink = styled.a``

const RepoDescription = styled.p``

const Tag = styled.span`
  display: inline-block;
  font: 0.8em sans-serif;
  color: black;
  border: 1px solid gray;
  border-radius: 3px;
  padding: 2px 4px;
  margin: 2px 4px;
  box-shadow: 1px 2px 3px;
`

class PaginatedRepoList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 0,
      pageSize: 10,
    }
    this.onPreviousPage = this.onPreviousPage.bind(this)
    this.onNextPage = this.onNextPage.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.repos !== nextProps.repos) {
      this.setState({
        page: 0,
      })
    }
  }

  renderRepo(repo) {
    return (
      <RepoItem key={repo.id}>
        <RepoLink href={repo.url} target="_blank" rel="noopener noreferrer">
          {repo.nameWithOwner}
        </RepoLink>
        <RepoDescription>{repo.description}</RepoDescription>
        {repo.languages.map(l => (
          <Tag key={l}>{l}</Tag>
        ))}
      </RepoItem>
    )
  }

  onPreviousPage() {
    this.setState({
      page: this.state.page-1
    })
  }

  onNextPage() {
    this.setState({
      page: this.state.page+1
    })
  }
  
  render() {
    const {page, pageSize} = this.state
    const repoCount = this.props.repos.length
    const startIndex = page * pageSize
    const endIndexOnPage = (page + 1) * pageSize
    const isLastPage = endIndexOnPage >= repoCount
    const endIndex = Math.min(endIndexOnPage, repoCount)
    const visibleRepos = this.props.repos.slice(startIndex, endIndex)
    return (
      <div>
        <RepoList>{visibleRepos.map(this.renderRepo)}</RepoList>
        {this.state.page === 0 ? null : <button onClick={this.onPreviousPage}>⏪</button>}
        <span>Page {this.state.page + 1}</span>
        {isLastPage ? null : <button onClick={this.onNextPage}>⏩</button>}
      </div>
    )
  }
}

class GhMarkApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false,
      credential: this.getDefaultCredential(),
      starredRepositories: [],
      filterLanguage: '',
      filteredRepos: [],
      pageSize: 10,
      page: 1,
    }
    this.handleFilterLanguageChange = this.handleFilterLanguageChange.bind(this)
    this.handleCredentialInputChange = this.handleCredentialInputChange.bind(
      this
    )
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  getDefaultCredential() {
    return {
      userId: '',
      accessToken: '',
    }
  }

  load(key) {
    return JSON.parse(window.localStorage.getItem(key))
  }

  async loadGithubData(credential) {
    const queryer = new GithubQueryer(credential)
    const starredRepositories = await queryer.getAllStarredRepo()
    const filteredRepos = this.filterRepoByLanguage(
      starredRepositories,
      this.state.filterLanguage
    )
    this.setState({
      starredRepositories,
      filteredRepos,
    })
  }

  componentDidMount() {
    const credential = this.load('credential')
    if (credential !== null) {
      this.setState({ credential, loggedIn: true })
      this.loadGithubData(credential)
    }
  }

  save(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  delete(key) {
    window.localStorage.removeItem(key)
  }

  handleSubmit(event) {
    event.preventDefault()
    const credential = this.state.credential
    this.save('credential', credential)
    this.setState({
      loggedIn: true,
    })
    this.loadGithubData(credential)
  }

  handleCredentialInputChange(event) {
    const { name, value } = event.target
    const credential = {
      ...this.state.credential,
      [name]: value,
    }
    this.setState({ credential })
  }

  handleFilterLanguageChange(event) {
    const filterLanguage = event.target.value
    const filteredRepos = this.filterRepoByLanguage(
      this.state.starredRepositories,
      filterLanguage
    )

    this.setState({
      filterLanguage,
      filteredRepos,
    })
  }

  filterRepoByLanguage(repos, language) {
    return repos.filter(
      ({ languages }) =>
        language === '' ||
        languages.some(l => l.toLowerCase().includes(language.toLowerCase()))
    )
  }

  renderLogin() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          User ID:
          <input
            name="userId"
            type="text"
            value={this.state.credential.userId}
            onChange={this.handleCredentialInputChange}
          />
        </label>
        <label>
          Access Token:
          <input
            name="accessToken"
            type="password"
            value={this.state.credential.accessToken}
            onChange={this.handleCredentialInputChange}
          />
        </label>
        <input type="submit" value="submit" />
      </form>
    )
  }

  handleLogout() {
    this.delete('credential')
    this.setState({
      credential: this.getDefaultCredential(),
      loggedIn: false,
    })
  }

  renderRepo(repo) {
    return (
      <RepoItem key={repo.id}>
        <RepoLink href={repo.url} target="_blank" rel="noopener noreferrer">
          {repo.nameWithOwner}
        </RepoLink>
        <RepoDescription>{repo.description}</RepoDescription>
        {repo.languages.map(l => (
          <Tag key={l}>{l}</Tag>
        ))}
      </RepoItem>
    )
  }

  renderList() {
    return (
      <>
        <h1>Starred Repositories ({this.state.filteredRepos.length})</h1>
        <button onClick={this.handleLogout}>Log out</button>
        <label>
          Filter By Language:
          <input
            name="filterLanguage"
            type="text"
            value={this.state.filterLanguage}
            onChange={this.handleFilterLanguageChange}
          />
        </label>
        <PaginatedRepoList repos={this.state.filteredRepos} />
      </>
    )
  }

  render() {
    return this.state.loggedIn ? this.renderList() : this.renderLogin()
  }
}
