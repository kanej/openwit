import React, { Component } from 'react'
import Appbar from './components/appbar'
import FeedIntroPanel from './components/feedIntroPanel'
import './App.css'

class App extends Component {
  render () {
    const feed = {
      author: {
        name: 'Cicero'
      },
      title: 'Thoughts expressed and well',
      posts: [
        'Lorem ipsum',
        'Let me start at the beginning'
      ]
    }

    return (
      <div className='App'>
        <Appbar title='Openwit' />
        <FeedIntroPanel feed={feed} />
      </div>
    )
  }
}

export default App
