import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

const styles = {
  root: {
    flexGrow: 1
  },
  loadingPanel: {
    marginTop: '30vh',
    textAlign: 'center',
    heading: {
      color: 'red'
    }
  }
}

class BannedPannel extends Component {
  render () {
    const { classes } = this.props

    return (
      <Grid
        container
        className={classes.root}
        spacing={16}
        justify='center'
        alignItems='center'>
        <div className={classes.loadingPanel}>
          <h1 className={classes.heading}>Banned</h1>
          <p>This feed is no longer available on <a href='/'>OpenWit</a></p>
        </div>
      </Grid>
    )
  }
}

export default withStyles(styles)(BannedPannel)
