import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Appbar from './components/appbar'
import FeedIntroPanel from './components/feedIntroPanel'
import './App.css'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = { feed: props.feed }
  }
  render () {
    return (
      <div className='App'>
        <Appbar title='Openwit' />
        <FeedIntroPanel feed={this.state.feed} />
      </div>
    )
  }
}

App.propTypes = {
  feed: PropTypes.object.isRequired
}

export default App
