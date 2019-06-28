import React from 'react'
import propTypes from 'prop-types'
import { StyledForm } from '../common/alexandriaComponents'
import FormButtons from '../common/FormButtons'
import { Modal } from 'react-bootstrap'

class CategoryEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: '',
      name: '',
      level: '',
      number: '',
      touched: {
        name: false,
        level: false,
        number: false
      }
    }
  }

  handleEnter = () => {
    if (this.props.category) {
      this.setState({
        _id: this.props.category._id,
        name: this.props.category.name,
        level: this.props.category.level,
        number: this.props.category.number
      })
    }
  }

  handleExit = () => {
    this.setState({
      _id: '',
      name: '',
      level: '',
      number: '',
      touched: {
        name: false,
        level: false,
        number: false
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
    const category = {
      _id: this.state._id,
      name: this.state.name,
      number: this.state.number
    }
    await this.props.handleSave(category)
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
      level: '',
      number: ''
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
          <Modal.Title>Add/edit category</Modal.Title>
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
            <StyledForm.Group>
              {(this.state.level || this.state.level == 0) && <StyledForm.Label>{`Level ${this.state.level}`}</StyledForm.Label>}
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              {this.state.number && <StyledForm.Label>{`Number ${this.state.number}`}</StyledForm.Label>}
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

export default CategoryEdit

CategoryEdit.propTypes = {
  category: propTypes.shape({
    _id: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    level: propTypes.number,
    number: propTypes.number
  }),
  modalIsOpen: propTypes.bool.isRequired,
  closeModal: propTypes.func.isRequired,
  handleSave: propTypes.func.isRequired,
  modalError: propTypes.string.isRequired
}
