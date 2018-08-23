import React from 'react'
import PropTypes from 'prop-types'

import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

let ContractAddressInput = function (props) {
  const {classes} = props
  return (
    <div className={classes.viewerPanel}>
      <Typography variant='display1'>
        Or explore the wilds
      </Typography>
      <Typography>
        You can view a ferral blog that doesn't follow this OpenWit community's rules, by entering
        the blog's contract address:
      </Typography>
      <form className={props.classes.container} autoComplete='off'>
        <div className={props.classes.margin}>
          <TextField
            fullWidth
            id='openwit-contract-address-input'
            placeholder='e.g. 0xeed080e939b6d6cb306a5de44e03bab14cf2ac9f'
            onChange={props.onChange} />
        </div>
      </form>

    </div>
  )
}

ContractAddressInput.propTypes = {
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export default ContractAddressInput
