import React from 'react'
import PropTypes from 'prop-types'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'

import {loadFeedListStatuses} from '../actions'

const FeedListPanel = (props) => {
  const {classes, feedRecords} = props

  let feedListSection
  switch (props.loadFeedListRequestState) {
    case loadFeedListStatuses.UNINITIATED:
    case loadFeedListStatuses.REQUESTED:
      feedListSection = (
        <Typography>Loading...</Typography>
      )
      break
    case loadFeedListStatuses.REQUEST_FAILED:
      feedListSection = (
        <Typography>
            There was an error while loading the OpenWit Blog list
        </Typography>
      )
      break
    case loadFeedListStatuses.REQUEST_SUCCEEDED:
      if (!feedRecords || feedRecords.length === 0) {
        feedListSection = (
          <Typography>
            There are currently no feeds on OpenWit. Why don't you create one?
          </Typography>
        )
      } else {
        feedListSection = (
          <div>
            <Grid
              container
              direction='row'
              justify='flex-start'
              alignItems='stretch'
              spacing={24}>
              {
                feedRecords.map(rec => {
                  return (
                    <Grid item xs={3} key={rec.contractAddress}>
                      <Card style={{height: '100%'}}>
                        <CardContent>
                          <Typography variant='title'>{rec.title}</Typography>
                          <Typography>by <em>{rec.author}</em></Typography>
                        </CardContent>
                        <CardActions>
                          <Button onClick={() => props.gotoFeed(rec.contractAddress)}>View</Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  )
                })
              }
            </Grid>
          </div>
        )
      }
      break
    default:
      feedListSection = (
        <Typography>
            There are currently no feeds on OpenWit. Why don't you create one?
        </Typography>
      )
  }

  return (
    <div className={classes.blogRollPanel}>
      <Typography variant='title' gutterBottom>
          Microblogs on Openwit
      </Typography>
      <Divider />
      { feedListSection}

    </div>
  )
}

FeedListPanel.propTypes = {
  loadFeedListRequestState: PropTypes.string.isRequired,
  feedRecords: PropTypes.array.isRequired,
  gotoFeed: PropTypes.func.isRequired
}

export default FeedListPanel
