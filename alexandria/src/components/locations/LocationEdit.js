import React from 'react'
import propTypes from 'prop-types'
import { StyledForm } from '../common/alexandriaComponents'
import FormButtons from '../common/FormButtons'
import { Modal } from 'react-bootstrap'

class LocationEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: '',
      room: '',
      shelving: '',
      shelf: '',
      touched: {
        room: false,
        shelving: false,
        shelf: false
      }
    }
  }

  handleEnter = () => {
    if (this.props.location) {
      this.setState({
        _id: this.props.location._id,
        room: this.props.location.room,
        shelving: this.props.location.shelving,
        shelf: this.props.location.shelf
      })
    }
  }

  handleExit = () => {
    this.setState({
      _id: '',
      room: '',
      shelving: '',
      shelf: '',
      touched: {
        room: false,
        shelving: false,
        shelf: false
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
    const location = {
      _id: this.state._id,
      room: this.state.room,
      shelving: this.state.shelving,
      shelf: this.state.shelf
    }
    await this.props.handleSave(location)
    console.log('Error', this.props.modalError)
    if (!this.props.modalError) {
      this.handleExit()
      this.props.closeModal()
    }
  }

  handleCancel = () => {
    this.setState({
      _id: '',
      room: '',
      shelving: '',
      shelf: ''
    })
    this.props.closeModal()
  }

  validate = () => {
    return {
      room: !this.state.room
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
        onShow={this.handleEnter}
        onExit={this.handleExit}
        onHide={this.props.closeModal}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add/edit location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StyledForm>
            <StyledForm.Group controlId='room'>
              <StyledForm.Label>Room</StyledForm.Label>
              <StyledForm.Control
                type='text'
                name='room'
                value={this.state.room}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                isInvalid={this.getValidationState(errors, 'room')}
              />
            </StyledForm.Group>
            <StyledForm.Group controlId='shelving'>
              <StyledForm.Label>Shelving</StyledForm.Label>
              <StyledForm.Control
                type='text'
                name='shelving'
                value={this.state.shelving}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                isInvalid={this.getValidationState(errors, 'shelving')}
              />
            </StyledForm.Group>
            <StyledForm.Group controlId='shelf'>
              <StyledForm.Label>Shelf</StyledForm.Label>
              <StyledForm.Control
                type='text'
                name='shelf'
                value={this.state.shelf}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                isInvalid={this.getValidationState(errors, 'shelf')}
              />
            </StyledForm.Group>
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

export default LocationEdit

LocationEdit.propTypes = {
  location: propTypes.shape({
    _id: propTypes.string.isRequired,
    room: propTypes.string.isRequired,
    shelving: propTypes.string,
    shelf: propTypes.string
  }),
  modalIsOpen: propTypes.bool.isRequired,
  closeModal: propTypes.func.isRequired,
  handleSave: propTypes.func.isRequired,
  modalError: propTypes.string.isRequired
}

