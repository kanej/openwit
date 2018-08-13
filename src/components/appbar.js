import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import IconButton from '@material-ui/core/IconButton'
import SettingsIcon from '@material-ui/icons/SettingsRounded'

const styles = {
  root: {
    flexGrow: 1
  },
  flex: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
}

class SimpleAppBar extends Component {
  render () {
    const { classes, isOwner } = this.props

    return (
      <div className={classes.root}>
        <AppBar position='static' color='default'>
          <Toolbar>
            <Typography variant='title' color='inherit' className={classes.flex}>
              Openwit
            </Typography>
            {isOwner && (
              <div>
                <IconButton color='inherit' className={classes.button} aria-label='Go to Settings' onClick={this.props.onSettingsClicked}>
                  <SettingsIcon>settings</SettingsIcon>
                </IconButton>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

SimpleAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  isOwner: PropTypes.bool.isRequired,
  onSettingsClicked: PropTypes.func.isRequired
}

export default withStyles(styles)(SimpleAppBar)
