import { connect } from 'react-redux'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import { fetchFeed, loadFeedListStatuses } from '../actions'
import ContractAddressInput from './contractAddressInput'
import FeedListPanel from './feedListPanel'

const styles = {
  titlePanel: {
    margin: 30
  },
  createABlogPanel: {
    margin: 30
  },
  blogRollPanel: {
    margin: 30
  },
  setupBlogBtn: {
    marginTop: 10
  }
}

class HomePage extends Component {
  constructor (props) {
    super(props)
    this._gotoFeed = this._gotoFeed.bind(this)
  }

  async componentDidMount () {
    if (this.props.loadFeedListRequestState === loadFeedListStatuses.UNINITIATED) {
      this.props.loadFeedList()
    }
  }

  render () {
    const {classes} = this.props

    return (
      <div>
        <Grid container justify='center'>
          <Grid item xs={12} md={6}>
            <div>
              <div className={classes.titlePanel}>
                <Typography variant='display4'>OpenWit</Typography>
                <Typography variant='display1'>
                Micro-blogging fun with Ethereum and IPFS
                </Typography>
                <Typography variant='body1'>
                  A feature incomplete and otherwise aweful version of an already aweful idea, the microblogging site ... but this time with blockchains.
                </Typography>
                <Typography variant='body1'>
                  This is a toy project put togther for the Consensys Academy course. It allows you to create a microblog and post short entries to it, view other blogs, lock/destroy/transfer ownership of a blog.
                  It assumes you have MetaMask running on the local private network.
                </Typography>
              </div>
              <div className={classes.viewerPanel}>
                <ContractAddressInput onChange={(e) => this._onContractAddressInput(e)} />
              </div>
              <div className={classes.createABlogPanel}>
                <Typography variant='display1'>
                Join the (minimal) fun
                </Typography>
                <Typography variant='body1'>
                  Get your own OpenWit microblog. Though be warned that you are bound by the OpenWit Rules
                  and not in some nebulous scout's honour way, <strong>you need to stake 0.1 Ether which will be
                  confiscated if you break the rules</strong>. But at least there are no adverts. Yet.
                </Typography>
                <Button
                  className={classes.setupBlogBtn}
                  variant='contained'
                  size='large'
                  color='primary'
                  onClick={(e) => this._onSetupMicroblogClicked(e)}>
                    Setup Microblog
                </Button>
              </div>
              <FeedListPanel
                classes={classes}
                loadFeedListRequestState={this.props.loadFeedListRequestState}
                feedRecords={this.props.feedRecords}
                gotoFeed={this._gotoFeed} />
            </div>
          </Grid>
        </Grid>
        <footer className={classes.footer}>
          <Typography variant='subheading' align='center' color='textSecondary' component='p'>
            Built under knowledge of the deadline by <a href='https://www.kanej.me'>kanej</a>
          </Typography>
        </footer>
      </div>

    )
  }

  _onContractAddressInput (e) {
    e.preventDefault()
    const address = e.target.value

    if (!address || address.length !== 42 || !/^0x/g.test(address)) {
      console.log('Invalid address: ' + address)
      return
    }

    this.props.onFetchFeed(address).then(() => {
      console.log('Redirecting to contract address ' + address + ' ...')

      this.props.history.push('/feed/' + address)
    })
  }

  _onSetupMicroblogClicked (e) {
    e.preventDefault()

    this.props.history.push('/feed/new')
  }

  _gotoFeed (contractAddress) {
    this.props.onFetchFeed(contractAddress).then(() => {
      console.log('Redirecting to contract address ' + contractAddress + ' ...')

      this.props.history.push('/feed/' + contractAddress)
    })
  }
}

HomePage.propTypes = {
  loadFeedListRequestState: PropTypes.string.isRequired,
  feedRecords: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  onFetchFeed: PropTypes.func.isRequired,
  loadFeedList: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    loadingStatus: state.loadingStatus,
    currentWeb3Account: state.currentWeb3Account
  }
}

// More this down, not needed
const mapDispatchToProps = (dispatch, second) => {
  return {
    onFetchFeed: contractAddress => {
      return dispatch(fetchFeed(contractAddress))
    }
  }
}

const styledHomePage = withStyles(styles)(HomePage)
const HomePageContainer = connect(mapStateToProps, mapDispatchToProps)(styledHomePage)

export default HomePageContainer
