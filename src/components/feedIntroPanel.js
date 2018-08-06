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

function FeedIntroPanel (props) {
  const { classes, feed, owner, accounts } = props

  if (!feed) {
    return (
      <div />
    )
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid item xs>
          <Grid container justify='flex-end'>
            <Grid item className={classes.leftCol}>
              <Avatar person={feed.author} />
              <h3>{feed.author.name}</h3>
              <h4>{feed.title}</h4>
              {(() => {
                if (owner === accounts[0].toLowerCase()) {
                  return (<div />)
                } else {
                  return (
                    <Button variant='contained' color='primary'>
                    Follow
                    </Button>
                  )
                }
              })()}

            </Grid>
          </Grid>

        </Grid>
        <Grid item xs={6}>
          <PostsList posts={feed.posts} />
        </Grid>
        <Grid item xs />
      </Grid>
    </div>
  )
}

FeedIntroPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  feed: PropTypes.object,
  owner: PropTypes.string
}

export default withStyles(styles)(FeedIntroPanel)
