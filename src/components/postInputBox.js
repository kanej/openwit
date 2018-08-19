import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import SettingsIcon from '@material-ui/icons/SettingsRounded'

import CircularProgress from '@material-ui/core/CircularProgress'
import green from '@material-ui/core/colors/green'
import Button from '@material-ui/core/Button'
import CreateIcon from '@material-ui/icons/Create'

import {postToFeedStatuses} from '../actions'

const styles = {
  root: {
    padding: '10px'
  },
  textField: {

  },
  wrapper: {
    position: 'relative',
    margin: 12
  },
  submitButton: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1
  }
}

class PostInputBox extends React.Component {
  constructor (props) {
    super(props)

    this.state = {value: this.props.postText || ''}

    this._handleChange = this._handleChange.bind(this)
    this._keyPress = this._keyPress.bind(this)
    this._triggerUpdate = this._triggerUpdate.bind(this)
  }

  render () {
    var { classes, isOwner, onSettingsClicked, requestStatus } = this.props

    var loading = requestStatus === postToFeedStatuses.REQUESTED
    var inputDisabled = loading
    var buttonDisabled = loading || !this.state.value || this.state.value.length < 3 || this.state.value.length > 160

    return (
      <div>
        <Paper className={classes.root} elevation={3}>
          <Grid container>
            <Grid item xs>
              <Typography variant='title'>Jot down some thoughts...</Typography>
              <form autoComplete='off'>
                <div>
                  <TextField
                    fullWidth
                    multiline
                    disabled={inputDisabled}
                    rows={1}
                    className={classes.textField}
                    margin='normal'
                    id='openwit-post-input'
                    placeholder='though try to be civil'
                    onKeyDown={this._keyPress}
                    onChange={this._handleChange}
                    value={this.state.value}
                  />
                </div>
              </form>
            </Grid>
            <Grid item xs={2}>
              <div className={classes.wrapper}>
                <Button
                  className={classes.submitButton}
                  disabled={buttonDisabled}
                  variant='fab'
                  color='primary'
                  // className={buttonClassname}
                  onClick={this._triggerUpdate}
                >
                  <CreateIcon />
                </Button>
                {loading && <CircularProgress size={68} className={classes.fabProgress} />}
              </div>
            </Grid>
            {isOwner && (
              <Grid item xs={2}>
                <IconButton color='inherit' size='large' className={classes.button} aria-label='Go to Settings' onClick={onSettingsClicked}>
                  <SettingsIcon size='large'>settings</SettingsIcon>
                </IconButton>
              </Grid>
            )}
          </Grid>
        </Paper>
      </div>
    )
  }

  _handleChange (e) {
    this.setState({ value: e.target.value })
  }

  _keyPress (e) {
    if (e.keyCode === 13) {
      this._triggerUpdate(e)
    }
  }

  _triggerUpdate (e) {
    e.preventDefault()
    this.setState({value: ''})
    this.props.onTextEnter(this.state.value)
  }
}

PostInputBox.propTypes = {
  classes: PropTypes.object.isRequired,
  onTextEnter: PropTypes.func.isRequired,
  onSettingsClicked: PropTypes.func.isRequired,
  isOwner: PropTypes.bool.isRequired,
  postText: PropTypes.string
}

export default withStyles(styles)(PostInputBox)
