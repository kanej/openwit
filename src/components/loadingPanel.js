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
    textAlign: 'center'
  }
}

class LoadingPanel extends Component {
  render () {
    const { classes, byline } = this.props

    return (
      <Grid
        container
        className={classes.root}
        spacing={16}
        justify='center'
        alignItems='center'>
        <div className={classes.loadingPanel}>
          <h1>OpenWit</h1>
          <p>{byline}</p>
        </div>
      </Grid>
    )
  }
}

LoadingPanel.propTypes = {
  byline: PropTypes.string.isRequired,
  loadingErrorMessage: PropTypes.string
}

export default withStyles(styles)(LoadingPanel)
