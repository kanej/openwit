import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import App from '../App'
import Avatar from '../components/avatar'
import Appbar from '../components/appbar'
import FeedIntroPanel from '../components/feedIntroPanel'
import PostsList from '../components/postsList'
import ContractAddressInputs from '../components/contractAddressInput'

const owner = '0xeed080e939b6d6cb306a5de44e03bab14cf2ac9f'

const accounts = [owner]

const author = {
  name: 'Frost'
}

const exampleFeed = {
  author: author,
  posts: [
    'Two roads diverged in a yellow wood',
    'And sorry I could not travel both and be one traveller',
    'I looked down one as far as I could',
    'To where it bend in the undergrowth',
    'Then took the other as just as fair'
  ]
}

storiesOf('Open Wit', module)
  .add('Example feed loaded from hashtag', () =>
    <App
      mode='from-anchor-tag'
      owner={owner}
      accounts={accounts}
      feed={exampleFeed} />)
  .add('Contract Viewer Mode', () =>
    <App
      mode='viewer'
      owner={owner}
      accounts={accounts} />)

storiesOf('Appbar', module)
  .add('fully enabled', () => <Appbar title='Openwit' />)

storiesOf('Feed Intro Panel', module)
  .add('standard', () =>
    <FeedIntroPanel
      accounts={accounts}
      feed={exampleFeed} />)

storiesOf('Posts List', module)
  .add('standard', () => <PostsList posts={exampleFeed.posts} />)

storiesOf('Avatar', module)
  .add('without specific image', () => <Avatar person={author} />)

storiesOf('Contract Address Input', module)
  .add('on first load', () => <ContractAddressInputs onChange={action('another')} />)
