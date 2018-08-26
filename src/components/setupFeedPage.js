import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import { Typography, TextField } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

const styles = {
  root: {
    marginTop: 20
  },
  setupBtn: {
    marginTop: 10
  }
}

class SetupFeedPage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      title: '',
      author: ''
    }

    this._onTitleChange = this._onTitleChange.bind(this)
    this._onAuthorChange = this._onAuthorChange.bind(this)
    this._onSetupClicked = this._onSetupClicked.bind(this)
  }

  render () {
    const {classes} = this.props
    const setupBtnDisabled = this.state.title.length < 3 || this.state.author.length < 3

    return (
      <div className='app' >
        <Grid className={classes.root} container justify='center'>
          <Grid item xs={12} md={6}>
            <Typography variant='display2' >
                Setup a new Microblog Feed
            </Typography>
            <Typography variant='body2' >
                This will create a feed on the OpenWit registry.
                To be certified by the registry a feed is staked
                with 0.1 ether, which will be confiscated if a post
                is found in violation of the OpenWit registry rules.
            </Typography>
            <Typography variant='body2'>
              <strong>The Rules</strong>
            </Typography>
            <ol>
              <li>No post shall use the word 'inheritance' as in "I like multiple inheritance"</li>
            </ol>
            <form>
              <div>
                <TextField
                  fullWidth
                  label='Feed Title'
                  value={this.state.title}
                  onChange={this._onTitleChange} />
              </div>
              <div>
                <TextField
                  fullWidth
                  label='Author'
                  value={this.state.author}
                  onChange={this._onAuthorChange} />
              </div>
              <Button
                className={classes.setupBtn}
                disabled={setupBtnDisabled}
                variant='contained'
                size='large'
                color='secondary'
                onClick={this._onSetupClicked}>
                Setup
              </Button>
            </form>
          </Grid>
        </Grid>
      </div>
    )
  }

  _onSetupClicked (e) {
    e.preventDefault()

    this.props.onCreateFeed(this.state.title, this.state.author).then((data) => {
      this.props.loadFeedList()
      this.props.history.push(`/feed/${data.newFeedAddress}`)
    })
  }

  _onTitleChange (e) {
    this.setState({title: e.target.value})
  }

  _onAuthorChange (e) {
    this.setState({author: e.target.value})
  }
}

SetupFeedPage.propTypes = {
  history: PropTypes.object.isRequired,
  onCreateFeed: PropTypes.func.isRequired,
  loadFeedList: PropTypes.func.isRequired
}

export default withStyles(styles)(SetupFeedPage)
