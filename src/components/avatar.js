import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import deepOrange from '@material-ui/core/colors/deepOrange'

const styles = {
  avatar: {
    margin: 10
  },
  orangeAvatar: {
    fontSize: 48,
    margin: 0,
    height: 80,
    width: 80,
    color: '#fff',
    backgroundColor: deepOrange[500]
  },
  row: {
    display: 'flex',
    justifyContent: 'right'
  }
}

function LetterAvatars (props) {
  const { classes, person } = props
  const name = person || 'Unknown'
  const letter = name.toUpperCase()[0]
  return (
    <div className={classes.row}>
      <Avatar className={classes.orangeAvatar}>{letter}</Avatar>
    </div>
  )
}

LetterAvatars.propTypes = {
  classes: PropTypes.object.isRequired,
  person: PropTypes.string.isRequired
}

export default withStyles(styles)(LetterAvatars)
