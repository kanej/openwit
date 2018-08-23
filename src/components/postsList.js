import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'

const styles = {
  postBox: {
    marginTop: 20
  },
  postCardContent: {
    textAlign: 'left'
  },
  noPostsMessage: {
    marginTop: 40,
    textAlign: 'center'
  }
}

function PostsList (props) {
  var { classes, posts } = props

  if (!posts || posts.length === 0) {
    return (
      <div className={classes.noPostsMessage}>
        <p>There are no posts yet</p>
      </div>
    )
  }

  var postCards = props.posts.map((post, index) => (
    <Card className={classes.postBox} key={index}>
      <CardContent className={classes.postCardContent}>
        <p>{post}</p>
      </CardContent>
      <CardActions>
        {/* <Button>Like</Button>
        <Button>Repost</Button> */}
      </CardActions>
    </Card>
  ))

  return (
    <div>
      {postCards}
    </div>
  )
}

PostsList.propTypes = {
  classes: PropTypes.object.isRequired,
  posts: PropTypes.array.isRequired
}

export default withStyles(styles)(PostsList)
