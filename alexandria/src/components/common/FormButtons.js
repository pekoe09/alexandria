import React from 'react'
import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

const FormButtons = ({ handleSave, handleCancel, saveIsDisabled }) => {
  return (
    <React.Fragment>
      <Button
        bsstyle='primary'
        type='submit'
        onClick={handleSave}
        disabled={saveIsDisabled ? saveIsDisabled : false}
        style={{ marginRight: 5 }}
      >
        Save
      </Button>
      <Button
        bsstyle='default'
        onClick={handleCancel}
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