import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

const styles = {
  root: {
    flexGrow: 1
  },
  loadingPanel: {
    marginTop: '30vh',
    textAlign: 'center',
    h1: {
      color: 'red'
    }
  }
}

class ErrorPanel extends Component {
  render () {
    const { classes, byline, errorMessage } = this.props

    return (
      <Grid
        container
        className={classes.root}
        spacing={16}
        justify='center'
        alignItems='center'>
        <div className={classes.loadingPanel}>
          <h1>Error</h1>
          <h2>{byline}</h2>
          <p>{errorMessage}</p>
        </div>
      </Grid>
    )
  }
}

ErrorPanel.propTypes = {
  byline: PropTypes.string.isRequired,
  errorMessage: PropTypes.string.isRequired
}

export default withStyles(styles)(ErrorPanel)
