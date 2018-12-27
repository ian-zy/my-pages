// implementation take from [hash-source](https://github.com/will-stone/hash-source/blob/master/src/createHashSource.ts)

const getHashPath = () => {
  const href = window.location.href
  const hashIndex = href.indexOf('#')
  return hashIndex === -1 ? '' : href.substring(hashIndex + 1)
}

const pushHashPath = path => (window.location.hash = path)

const replaceHashPath = path => {
  const hashIndex = window.location.href.indexOf('#')
  console.log(window.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0))
  window.location.replace(
    window.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + '#' + path
  )
}

const getState = path => {
  const pathname = path ? path : getHashPath()
  return { pathname, search: '' }
}

const resolveInitialState = state => {
  if (state.pathname === '') {
    replaceHashPath('/')
  }
}

export const createHashSource = () => {
  let state = getState()

  resolveInitialState(state)

  return {
    get location() {
      return getState()
    },
    addEventListener(name, fn) {
      window.addEventListener(name, fn)
    },
    removeEventListener(name, fn) {
      window.removeEventListener(name, fn)
    },
    history: {
      state,
      pushState(stateObj, _, uri) {
        state = getState(uri)
        pushHashPath(uri)
      },
      replaceState(stateObj, _, uri) {
        state = getState(uri)
        replaceHashPath(uri)
      },
    },
  }
}

export const isBrower = () => typeof window !== 'undefined'
