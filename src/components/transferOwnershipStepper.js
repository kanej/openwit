import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

const styles = {
  root: {
    flexGrow: 1
  },
  heading: {
    margin: '20px'
  },
  paper: {
    padding: '20px',
    margin: '20px'
  }
}

class TransferOwnershipStepper extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeStep: 0,
      newOwnerContractAddress: ''
    }

    this._handleNext = this._handleNext.bind(this)
    this._handleConfirm = this._handleConfirm.bind(this)
    this._handleContractAddressUpdate = this._handleContractAddressUpdate.bind(this)
  }

  render () {
    const {classes} = this.props
    const {activeStep} = this.state
    const steps = this._getSteps()

    const stepContent = this._getStepContent()

    return (
      <Paper className={classes.paper}>
        <Typography variant='headline' component='h3'>
          Transfer Ownership
        </Typography>
        <Typography variant='body1' component='p'>
          Transfer the ownership of the feed <strong>{this.props.feedName}</strong> to another ethereum account. This is not reversible without the new owners consent.
        </Typography>
        <div>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const props = {}
              const labelProps = {}

              return (
                <Step key={label} {...props}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              )
            })}
          </Stepper>
          {stepContent}
        </div>
      </Paper>
    )
  }

  _getSteps () {
    return ['Start', 'Enter new owner', 'Confirm']
  }

  _getStepContent () {
    const {classes} = this.props
    const {activeStep} = this.state

    if (activeStep === 0) {
      return (
        <div>
          <Button
            disabled={this.props.paused}
            variant='contained'
            color='secondary'
            className={classes.button}
            onClick={this._handleNext}>
            Start Transfer
          </Button>
        </div>
      )
    } else if (activeStep === 1) {
      return (
        <div>
          <Typography>Enter the ethereum account to set as the new owner</Typography>
          <form noValidate autoComplete='off'>
            <TextField
              fullWidth
              id='transfer-ownership-new-owner-input'
              label='Contract Address'
              className={classes.textField}
              value={this.state.newOwnerContractAddress}
              onChange={this._handleContractAddressUpdate}
              margin='normal'
            />
          </form>
          <Button
            variant='contained'
            color='primary'
            className={classes.button}
            onClick={this._handleNext}>
            Next
          </Button>
        </div>
      )
    } else if (activeStep === 2) {
      return (
        <div>
          <Typography>Confirm the transfer of ownership</Typography>
          <Button
            variant='contained'
            color='secondary'
            className={classes.button}
            onClick={this._handleConfirm}>
          Confirm
          </Button>
        </div>
      )
    }
  }

  _handleContractAddressUpdate (event) {
    this.setState({
      newOwnerContractAddress: event.target.value
    })
  };

  _handleNext () {
    const {activeStep} = this.state

    this.setState({
      activeStep: activeStep + 1
    })
  }

  async _handleConfirm (e) {
    await this.props.onOwnershipTransfer(this.state.newOwnerContractAddress)
  }
}

TransferOwnershipStepper.propTypes = {
  classes: PropTypes.object,
  feedName: PropTypes.string.isRequired,
  paused: PropTypes.bool.isRequired,
  onOwnershipTransfer: PropTypes.func.isRequired
}

export default withStyles(styles)(TransferOwnershipStepper)
