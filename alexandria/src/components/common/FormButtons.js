import React from 'react'
import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

const FormButtons = () => {
  return (
    <React.Fragment>
      <Button
        bsStyle='primary'
        type='submit'
        onClick={this.props.handleSave}
        disabled={this.props.saveIsDisabled ? this.props.saveIsDisabled : false}
        style={{ marginRight: 5 }}
      >
        Save
      </Button>
      <Button
        bsStyle='default'
        onClick={this.handleCancel}
      >
        Cancel
      </Button>
    </React.Fragment>
  )
}

export default FormButtons

FormButtons.propTypes = {
  handleSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  saveIsDisabled: PropTypes.bool
}