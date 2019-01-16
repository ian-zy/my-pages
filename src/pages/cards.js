import React from 'react'
import App from '../components/app'

class Card extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isFront: true,
      showNotes: false
    }
  }

  turn() {
    this.setState((state) => ({
      isFront: !state.isFront      
    }))
  }

  toggleNotes() {
    this.setState((state) => ({
      showNotes: !state.showNotes      
    }))
  }

  render() {
    const { word, definition, notes } = this.props.item
    return (
      <div>
        {this.state.isFront ? <p>{word}</p> : <p>{definition}</p>}
        {this.state.showNotes ? <p>{notes}</p> : null}
        <button onClick={() => this.turn()}>Turn Card</button>
        <button onClick={() => this.toggleNotes()}>{this.state.showNotes ? 'Hide Notes' : 'Show Notes'}</button>
      </div>
    )
  }
}

class Stack extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0
    }
  }

  next() {
    const incIndex = (index, size) => index + 1 < size ? index + 1 : 0
    this.setState((state, props) => ({
      index: incIndex(state.index, props.vocabulary.length)
    }))
  }

  render() {
    const item = this.props.vocabulary[this.state.index]
    return (
      <div>
        <Card key={item.word} item={item}/>
        <button onClick={() => this.next()}>Next</button>
      </div>
    )
  }
}

const vocabulary = [
  {
    word: `das Fahrrad, die Fahrräder`,
    definition: `bicycle`,
    notes: `Kurzform: das Rad, die Räder`
  },
  {
    word: `word`,
    definition: `单词`,
    notes: `some notes`
  },
  {
    word: `some word`,
    definition: `some definition`,
    notes: `some other notes`
  },
]

const CardsApp = () => (
  <App>
    <h1>My Cards</h1>
    <Stack vocabulary={vocabulary} />
  </App>
)

export default CardsApp
