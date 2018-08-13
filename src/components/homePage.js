import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

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
            <Typography variant='body'>
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
    const address = e.target.value

    if (!address || address.length !== 42 || !/^0x/g.test(address)) {
      console.log('Invalid address: ' + address)
      return
    }

    console.log('Redirecting to contract address ' + address + ' ...')

    e.preventDefault()
    this.props.history.push('/feed/' + address)
    return false
  }
}

HomePage.propTypes = {
  history: PropTypes.object.isRequired
}

export default withStyles(styles)(HomePage)
