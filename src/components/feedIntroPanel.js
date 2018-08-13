import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Avatar from './avatar'
import PostsList from './postsList'
import PostInputBox from './postInputBox'

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
  const {
    classes,
    feed,
    isOwner,
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
                  isOwner={isOwner}
                  onTextEnter={props.onPostAdded}
                  onSettingsClicked={onSettingsClicked} />
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
  feed: PropTypes.object
}

export default withStyles(styles)(FeedIntroPanel)
