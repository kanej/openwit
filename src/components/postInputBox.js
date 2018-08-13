import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import SettingsIcon from '@material-ui/icons/SettingsRounded'

const styles = {
  root: {
    padding: '10px'
  },
  textField: {

  }
}

class PostInputBox extends React.Component {
  constructor (props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.keyPress = this.keyPress.bind(this)
  }

  render () {
    var { classes, isOwner, onSettingsClicked } = this.props

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
                    rows={1}
                    className={classes.textField}
                    margin='normal'
                    id='openwit-post-input'
                    placeholder='though try to be civil'
                    onKeyDown={this.keyPress}
                    onChange={this.handleChange}
                  />
                </div>
              </form>
            </Grid>
            {isOwner && (
              <Grid item justify='flex-end' xs={2}>
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

  handleChange (e) {
    this.setState({ value: e.target.value })
  }

  keyPress (e) {
    if (e.keyCode === 13) {
      this.props.onTextEnter(this.state.value)
      this.setState({value: ''})
      e.preventDefault()
    }
  }
}

PostInputBox.propTypes = {
  classes: PropTypes.object.isRequired,
  onTextEnter: PropTypes.func.isRequired,
  onSettingsClicked: PropTypes.func.isRequired,
  isOwner: PropTypes.bool.isRequired
}

export default withStyles(styles)(PostInputBox)
