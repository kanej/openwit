import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'

const styles = {
  postBox: {
    margin: 100
  },
  postCardContent: {
    textAlign: 'left'
  }
}

function PostsList (props) {
  var { classes } = props

  var postCards = props.posts.map((post, index) => (
    <Card key={index}>
      <CardContent className={classes.postCardContent}>
        <p>{post}</p>
      </CardContent>
      <CardActions>
        <Button>Like</Button>
        <Button>Repost</Button>
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
