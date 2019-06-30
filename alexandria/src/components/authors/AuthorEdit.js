import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import { StyledForm } from '../common/alexandriaComponents'
import FormButtons from '../common/FormButtons'
import { Modal } from 'react-bootstrap'

class AuthorEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: '',
      lastName: '',
      firstNames: '',
      DOB: null,
      DOD: null,
      touched: {
        lastName: false,
        firstNames: false,
        DOB: false,
        DOD: false
      }
    }
  }

  clearState = () => {
    this.setState({
      _id: '',
      lastName: '',
      firstNames: '',
      DOB: null,
      DOD: null,
      touched: {
        lastName: false,
        firstNames: false,
        DOB: false,
        DOD: false
      }
    })
  }

  handleEnter = () => {
    if (this.props.author) {
      this.setState({
        _id: this.props.author._id,
        lastName: this.props.author.lastName,
        firstNames: this.props.author.firstNames,
        DOB: this.props.author.DOB,
        DOD: this.props.author.DOD
      })
    }
  }

  handleExit = () => {
    this.clearState()
  }


  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleDOBChange = date  => {
    this.setState({
      DOB: date
    })
  }

  handleDODChange = date  => {
    this.setState({
      DOD: date
    })
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
    const author = {
      _id: this.state._id,
      lastName: this.state.lastName,
      firstNames: this.state.firstNames,
      DOB: this.state.DOB,
      DOD: this.state.DOD
    }
    await this.props.handleSave(author)
    if (!this.props.modalError) {
      this.handleExit()
      this.props.closeModal()
    }
  }

  handleCancel = () => {
    this.clearState()
    this.props.closeModal()
  }

  validate = () => {
    return {
      lastName: !this.state.lastName
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
          <Modal.Title>Add/edit author</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StyledForm>
            <StyledForm.Group controlId='lastName'>
              <StyledForm.Label>Last name</StyledForm.Label>
              <StyledForm.Control
                type='text'
                name='lastName'
                value={this.state.lastName}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                isInvalid={this.getValidationState(errors, 'lastName')}
              />
            </StyledForm.Group>
            <StyledForm.Group controlId='firstNames'>
              <StyledForm.Label>First names</StyledForm.Label>
              <StyledForm.Control
                type='text'
                name='firstNames'
                value={this.state.firstNames}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                isInvalid={this.getValidationState(errors, 'firstNames')}
              />
            </StyledForm.Group>
            <StyledForm.Group controlId='DOB'>
              <StyledForm.Label>Date of birth</StyledForm.Label>
              <DatePicker
                name='DOB'
                selected={this.state.DOB}
                onChange={this.handleDOBChange}
                dateFormat="dd/MM/yyyy"
                onBlur={this.handleBlur('DOB')}
              />
            </StyledForm.Group>
            <StyledForm.Group controlId='DOD'>
              <StyledForm.Label>Date of death</StyledForm.Label>
              <DatePicker
                name='DOD'
                selected={this.state.DOD}
                onChange={this.handleDODChange}
                dateFormat="dd/MM/yyyy"
                onBlur={this.handleBlur('DOD')}
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

export default AuthorEdit

AuthorEdit.propTypes = {
  author: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    firstNames: PropTypes.string,
    DOB: PropTypes.objectOf(Date),
    DOD: PropTypes.objectOf(Date)
  }),
  modalIsOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  modalError: PropTypes.string
}