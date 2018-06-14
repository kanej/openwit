import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Avatar from './avatar'
import PostsList from './postsList'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit,
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  leftCol: {
    textAlign: 'right'
  }
})

function AutoGrid (props) {
  const { classes } = props

  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid item xs>
          <Grid container justify='flex-end'>
            <Grid item className={classes.leftCol}>
              <Avatar person={props.feed.author} />
              <h3>{props.feed.author.name}</h3>
              <h4>{props.feed.title}</h4>
              <Button variant='contained' color='primary'>
                    Follow
              </Button>
            </Grid>
          </Grid>

        </Grid>
        <Grid item xs={6}>
          <PostsList posts={props.feed.posts} />
        </Grid>
        <Grid item xs />
      </Grid>
    </div>
  )
}

AutoGrid.propTypes = {
  classes: PropTypes.object.isRequired,
  feed: PropTypes.object.isRequired
}

export default withStyles(styles)(AutoGrid)
