import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  container: {
    // display: 'flex',
    // flexWrap: 'wrap'
  },
  textField: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    // width: 400
  }
})

let ContractAddressInput = function (props) {
  return (
    <Paper className={props.classes.root} elevation={5}>
      <Typography>Enter the contract address of an OpenWit Contract</Typography>
      <form className={props.classes.container} autoComplete='off'>
        <div className={props.classes.margin}>
          <TextField
            fullWidth
            id='openwit-contract-address-input'
            placeholder='e.g. 0xeed080e939b6d6cb306a5de44e03bab14cf2ac9f'
            onChange={props.onChange} />
        </div>
      </form>
    </Paper>
  )
}

ContractAddressInput.propTypes = {
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export default withStyles(styles)(ContractAddressInput)
