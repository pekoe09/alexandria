import React from 'react'
import propTypes from 'prop-types'
import { StyledForm } from '../common/alexandriaComponents'
import FormButtons from '../common/FormButtons'
import { Modal } from 'react-bootstrap'

class PublisherEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: '',
      name: '',
      city: '',
      country: '',
      touched: {
        name: false,
        city: false,
        country: false
      }
    }
  }

  handleEnter = () => {
    if (this.props.publisher) {
      this.setState({
        _id: this.props.publisher._id,
        name: this.props.publisher.name,
        city: this.props.publisher.city,
        country: this.props.publisher.country
      })
    }
  }

  handleExit = () => {
    this.setState({
      _id: '',
      name: '',
      city: '',
      country: '',
      touched: {
        name: false,
        city: false,
        country: false
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
      name: this.state.name,
      city: this.state.city,
      country: this.state.country
    }
    await this.props.handleSave(publisher)
    console.log('Error', this.props.modalError)
    if (!this.props.modalError) {
      this.handleExit()
      this.props.closeModal()
    }
  }

  handleCancel = () => {
    this.setState({
      _id: '',
      name: '',
      city: '',
      country: ''
    })
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
        onShow={this.handleEnter}
        onExit={this.handleExit}
        onHide={this.props.closeModal}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add/edit publisher</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StyledForm>
            <StyledForm.Group controlId='name'>
              <StyledForm.Label>Name</StyledForm.Label>
              <StyledForm.Control
                type='text'
                name='name'
                value={this.state.name}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                isInvalid={this.getValidationState(errors, 'name')}
              />
            </StyledForm.Group>
            <StyledForm.Group controlId='city'>
              <StyledForm.Label>City</StyledForm.Label>
              <StyledForm.Control
                type='text'
                name='city'
                value={this.state.city}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                isInvalid={this.getValidationState(errors, 'city')}
              />
            </StyledForm.Group>
            <StyledForm.Group controlId='country'>
              <StyledForm.Label>Country</StyledForm.Label>
              <StyledForm.Control
                type='text'
                name='country'
                value={this.state.country}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                isInvalid={this.getValidationState(errors, 'country')}
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

