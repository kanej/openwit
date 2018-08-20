import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Avatar from './avatar'
import PostsList from './postsList'
import PostInputBox from './postInputBox'
import Paper from '@material-ui/core/Paper'
import { Typography } from '@material-ui/core'
import LockIcon from '@material-ui/icons/Lock'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit,
    flexGrow: 1
  },
  lockedWarning: {
    marginTop: 10,
    marginBottom: 10,
    padding: 5
  },
  lockIcon: {
    paddingTop: 15,
    marginRight: 5,
    marginLeft: 5
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
  const {
    classes,
    feed,
    postToFeed,
    isOwner,
    paused,
    onSettingsClicked,
    onOpenWitHomeClicked } = props

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
              <a href='#home' onClick={onOpenWitHomeClicked}>OpenWit</a>
            </Grid>
          </Grid>

        </Grid>
        <Grid item xs={6}>
          {(() => {
            if (isOwner) {
              return (
                <PostInputBox
                  {...postToFeed}
                  isOwner={isOwner}
                  paused={paused}
                  onTextEnter={props.onPostAdded}
                  onSettingsClicked={onSettingsClicked} />
              )
            }
          })()}
          {(() => {
            if (paused) {
              return (
                <Paper className={classes.lockedWarning} elevation={3}>
                  <div style={{height: '50px'}}>
                    <LockIcon className={classes.lockIcon} style={{float: 'left'}} />
                    <Typography variant='headline' style={{float: 'left', marginTop: 12, marginLeft: 5}}>
                      This feed is currently locked, there will be no new posts for the time being
                    </Typography>
                  </div>

                </Paper>
              )
            }
          })()}
          <PostsList posts={feed.posts} />
        </Grid>
        <Grid item xs />
      </Grid>
    </div>
  )
}

FeedIntroPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  onPostAdded: PropTypes.func.isRequired,
  onSettingsClicked: PropTypes.func.isRequired,
  onOpenWitHomeClicked: PropTypes.func.isRequired,
  isOwner: PropTypes.bool.isRequired,
  paused: PropTypes.bool.isRequired,
  feed: PropTypes.object,
  postToFeed: PropTypes.object.isRequired
}

export default withStyles(styles)(FeedIntroPanel)
