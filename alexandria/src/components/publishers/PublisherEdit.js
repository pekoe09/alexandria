import React from 'react'
import PropTypes from 'prop-types'
import { StyledForm } from '../common/alexandriaComponents'
import FormButtons from '../common/FormButtons'
import { Modal } from 'react-bootstrap'
import RelatedBooks from '../books/relatedBooks'

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
      },
      books: []
    }
  }

  handleEnter = () => {
    if (this.props.publisher) {
      this.setState({
        _id: this.props.publisher._id,
        name: this.props.publisher.name,
        city: this.props.publisher.city,
        country: this.props.publisher.country,
        books: this.props.relatedBooks ?
          this.props.relatedBooks : [],
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
      },
      books: []
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

  handleBookClick = (bookId) => {
    this.props.handleBookClick(bookId)
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
          <StyledForm.Label>Books</StyledForm.Label>
          {this.state.books && this.state.books.length > 0 &&
            <RelatedBooks books={this.state.books} handleBookClick={this.handleBookClick} />
          }
          {(!this.state.books || this.state.books.length === 0) &&
            <p>No books found for this publisher</p>
          }
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
  publisher: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }),
  relatedBooks: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      authorsString: PropTypes.string.isRequired,
      location: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        fullName: PropTypes.string.isRequired
      }),
      pages: PropTypes.number,
      readPages: PropTypes.number
    })
  ),
  modalIsOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleBookClick: PropTypes.func.isRequired,
  modalError: PropTypes.string.isRequired
}

