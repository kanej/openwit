import { connect } from 'react-redux'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import { fetchFeed } from '../actions'
import ContractAddressInput from './contractAddressInput'

const styles = {
  root: {
    padding: '10px'
  },
  textField: {

  }
}

class HomePage extends Component {
  render () {
    return (
      <Grid container justify='center'>
        <Grid item xs={12} md={6}>
          <div>
            <Typography variant='display4'>OpenWit</Typography>
            <Typography variant='display2'>
                Micro-blogging fun with Ethereum and IPFS
            </Typography>
            <Typography variant='body1'>
                A feature incomplete and otherwise aweful version of the already aweful but never to be names microblogging site.
            </Typography>
            <ContractAddressInput onChange={(e) => this._onContractAddressInput(e)} />
            <Typography variant='display1'>
                Join the fun
            </Typography>
            <Typography variant='body1'>
                Get your own OpenWit blog
            </Typography>
            <Button variant='contained' size='large' color='primary'>
                Setup Blog
            </Button>
          </div>
        </Grid>
      </Grid>
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
}

HomePage.propTypes = {
  history: PropTypes.object.isRequired,
  onFetchFeed: PropTypes.func.isRequired
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
