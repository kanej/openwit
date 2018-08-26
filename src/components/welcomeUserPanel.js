import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

class WelcomeUserPanel extends Component {
  render () {
    const {classes, currentWeb3Account} = this.props

    if (!currentWeb3Account || currentWeb3Account === '') {
      return (
        <div className={classes.userWelcomePanel}>
          <Paper elevation={4} style={{padding: 10}}>
            <Typography variant='headline'>
              Welcome! Consider logging in with Metamask and refreshing to enable all OpenWit's functionality
            </Typography>
          </Paper>
        </div>
      )
    }

    return (
      <div className={classes.userWelcomePanel}>
        <Paper elevation={4} style={{padding: 10}}>
          <Typography variant='headline'>
              Welcome <strong>{this.props.currentWeb3Account}</strong>!
          </Typography>
        </Paper>
      </div>
    )
  }
}

WelcomeUserPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  currentWeb3Account: PropTypes.string
}

export default WelcomeUserPanel
