import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'

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

function checkPostMeetsCodeOfConduct (post) {
  var postParts = post
    .replace(/\n/g, ' ')
    .replace(/"/g, ' ')
    .replace(/'/g, ' ')
    .split(' ')

  if (postParts.includes('inheritance')) {
    return false
  }

  return true
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

  var postCards = props.posts.map((post, index) => {
    const meetsCodeOfConduct = checkPostMeetsCodeOfConduct(post)

    const actions = props.isOwner || meetsCodeOfConduct
      ? null
      : (
        <CardActions>
          <Button onClick={(e) => props.onReportPost(props.contractAddress)}>Report</Button>
        </CardActions>
      )

    return (
      <Card className={classes.postBox} key={index}>
        <CardContent className={classes.postCardContent}>
          <p>{post}</p>
        </CardContent>
        {actions}
      </Card>
    )
  })

  return (
    <div>
      {postCards}
    </div>
  )
}

PostsList.propTypes = {
  classes: PropTypes.object.isRequired,
  contractAddress: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  onReportPost: PropTypes.func.isRequired,
  isOwner: PropTypes.bool.isRequired
}

export default withStyles(styles)(PostsList)
