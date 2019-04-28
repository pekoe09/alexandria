import React from 'react'
import propTypes from 'prop-types'
import { StyledForm } from '../common/alexandriaComponents'
import FormButtons from '../common/FormButtons'
import { ControlLabel, FormControl, FormGroup, Modal } from 'react-bootstrap'

class PublisherEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: '',
      name: '',
      touched: {
        name: false
      }
    }
  }

  handleEnter = () => {
    if (this.props.publisher) {
      this.setState({
        _id: this.props.publisher._id,
        name: this.props.publisher.name
      })
    }
  }

  handleExit = () => {
    this.setState({
      _id: '',
      name: '',
      touched: {
        name: false
      }
    })
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleBlur = field => () => {
    this.setState({
      touched: {
        ...this.state.touched,
        [field]: true
      }
    })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const publisher = {
      _id: this.state._id,
      name: this.state.name
    }
    await this.props.handleSave(publisher)
  }

  handleCancel = () => {
    this.props.closeModal()
  }

  validate = () => {
    return {
      name: !this.state.name
    }
  }

  getValidationState = (errors, fieldName) => {
    if (errors[fieldName] && this.state.touched[fieldName]) {
      return 'error'
    } else {
      return null
    }
  }

  render() {
    const errors = this.validate()
    const saveIsDisabled = Object.keys(errors).some(x => errors[x])

    return (
      <Modal
        show={this.props.modalIsOpen}
        onEnter={this.handleEnter}
        onExit={this.handleExit}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add/edit publisher</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StyledForm>
            <FormGroup validationState={this.getValidationState(errors, 'name')}>
              <ControlLabel>Name</ControlLabel>
              <FormControl
                type='text'
                name='name'
                value={this.state.name}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
              />
            </FormGroup>
          </StyledForm>
        </Modal.Body>
        <Modal.Footer>
          <FormButtons
            handleSave={this.handleSubmit}
            handleCancel={this.handleCancel}
            saveIsDisabled={saveIsDisabled}
          />
        </Modal.Footer>
      </Modal>
    )
  }
}

export default PublisherEdit

PublisherEdit.propTypes = {
  publisher: propTypes.shape({
    _id: propTypes.string.isRequired,
    name: propTypes.string.isRequired
  }),
  modalIsOpen: propTypes.bool.isRequired,
  closeModal: propTypes.func.isRequired,
  handleSave: propTypes.func.isRequired,
  modalError: propTypes.string.isRequired
}

