import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import { StyledForm } from '../common/alexandriaComponents'
import FormButtons from '../common/FormButtons'
import { Modal, Col } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { connect } from 'react-redux'

class BookEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: '',
      title: '',
      authors: [],
      publisher: [],
      publishingYear: '',
      isbn: '',
      categories: [],
      location: [],
      serialNumber: '',
      pages: '',
      readPages: '',
      acquiredDate: null,
      price: '',
      comment: '',
      touched: {
        title: false
      },
      multiple: true
    }
  }

  clearState = () => {
    this.setState({
      _id: '',
      title: '',
      authors: [],
      publisher: [],
      publishingYear: '',
      isbn: '',
      categories: [],
      location: [],
      serialNumber: '',
      pages: '',
      readPages: '',
      acquiredDate: null,
      price: '',
      comment: '',
      touched: {
        title: false
      }
    })
  }

  handleEnter = () => {
    if (this.props.book) {
      this.setState({
        _id: this.props.book._id,
        title: this.props.book.title,
        authors: this.props.book.authors,
        publisher: this.props.book.publisher ? [this.props.book.publisher] : [],
        publishingYear: this.props.book.publishingYear,
        isbn: this.props.book.isbn,
        categories: this.props.book.categories,
        location: this.props.book.location ? [this.props.book.location] : [],
        serialNumber: this.props.book.serialNumber,
        pages: this.props.book.pages,
        readPages: this.props.book.readPages,
        acquiredDate: this.props.book.acquiredDate ?
          moment(this.props.book.acquiredDate).toDate() : null,
        price: this.props.book.price,
        comment: this.props.book.comment,
      })
    }
  }

  handleExit = () => {
    this.clearState()
  }


  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleAuthorChange = (selected) => {
    this.setState({ authors: selected })
  }

  handleCategoryChange = (selected) => {
    this.setState({ categories: selected })
  }

  handleLocationChange = (selected) => {
    this.setState({ location: selected })
  }

  handlePublisherChange = (selected) => {
    this.setState({ publisher: selected })
  }

  handleAcquiredChange = date => {
    this.setState({ acquiredDate: date })
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
    const book = {
      _id: this.state._id,
      title: this.state.title,
      authors: this.state.authors.map(a => a._id),
      publisher: this.state.publisher.length > 0 ? this.state.publisher[0]._id : null,
      publishingYear: this.state.publishingYear,
      isbn: this.state.isbn,
      categories: this.state.categories.map(c => c._id),
      location: this.state.location.length > 0 ? this.state.location[0]._id : null,
      serialNumber: this.state.serialNumber,
      pages: this.state.pages,
      readPages: this.state.readPages,
      acquiredDate: this.state.acquiredDate,
      price: this.state.price,
      comment: this.state.comment,
    }
    await this.props.handleSave(book)
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
      title: !this.state.title
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
        dialogClassName="wide-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add/edit book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StyledForm>
            <StyledForm.Group controlId='title'>
              <StyledForm.Label>Title</StyledForm.Label>
              <StyledForm.Control
                type='text'
                name='title'
                value={this.state.title}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                isInvalid={this.getValidationState(errors, 'title')}
              />
            </StyledForm.Group>
            <StyledForm.Group>
              <StyledForm.Label>Authors</StyledForm.Label>
              <Typeahead
                onChange={(selected) => { this.handleAuthorChange(selected) }}
                options={this.props.authors}
                multiple
                clearButton
                selected={this.state.authors}
                labelKey="fullNameReversed"
                id="_id"
                maxResults={20}
              />
            </StyledForm.Group>
            <StyledForm.Row>
              <StyledForm.Group as={Col}>
                <StyledForm.Label>Publisher</StyledForm.Label>
                <Typeahead
                  onChange={(selected) => { this.handlePublisherChange(selected) }}
                  options={this.props.publishers}
                  selected={this.state.publisher}
                  labelKey="name"
                  id="_id"
                  maxResults={20}
                />
              </StyledForm.Group>
              <StyledForm.Group as={Col} md={2}>
                <StyledForm.Label>Published</StyledForm.Label>
                <StyledForm.Control
                  type='number'
                  name='publishingYear'
                  value={this.state.publishingYear}
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  isInvalid={this.getValidationState(errors, 'publishingYear')}
                />
              </StyledForm.Group>
              <StyledForm.Group as={Col} md={3}>
                <StyledForm.Label>ISBN</StyledForm.Label>
                <StyledForm.Control
                  type='text'
                  name='isbn'
                  value={this.state.isbn}
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  isInvalid={this.getValidationState(errors, 'isbn')}
                />
              </StyledForm.Group>
            </StyledForm.Row>
            <StyledForm.Group>
              <StyledForm.Label>Categories</StyledForm.Label>
              <Typeahead
                onChange={(selected) => { this.handleCategoryChange(selected) }}
                options={this.props.categories}
                selected={this.state.categories}
                multiple
                clearButton
                labelKey={(category) => `${category.code} - ${category.name}`}
                id="_id"
                maxResults={20}
              />
            </StyledForm.Group>
            <StyledForm.Row>
              <StyledForm.Group as={Col}>
                <StyledForm.Label>Location</StyledForm.Label>
                <Typeahead
                  onChange={(selected) => { this.handleLocationChange(selected) }}
                  options={this.props.locations}
                  selected={this.state.location}
                  labelKey="fullName"
                  id="_id"
                  maxResults={20}
                />
              </StyledForm.Group>
              <StyledForm.Group as={Col} md={3}>
                <StyledForm.Label>Serial number</StyledForm.Label>
                <StyledForm.Control
                  type='number'
                  name='serialNumber'
                  value={this.state.serialNumber}
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  isInvalid={this.getValidationState(errors, 'serialNumber')}
                />
              </StyledForm.Group>
            </StyledForm.Row>
            <StyledForm.Row>
              <StyledForm.Group as={Col}>
                <StyledForm.Label>Pages</StyledForm.Label>
                <StyledForm.Control
                  type='number'
                  name='pages'
                  value={this.state.pages}
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  isInvalid={this.getValidationState(errors, 'pages')}
                />
              </StyledForm.Group>
              <StyledForm.Group as={Col}>
                <StyledForm.Label>Read pages</StyledForm.Label>
                <StyledForm.Control
                  type='number'
                  name='readPages'
                  value={this.state.readPages}
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  isInvalid={this.getValidationState(errors, 'readPages')}
                />
              </StyledForm.Group>
              <StyledForm.Group as={Col}>
                <StyledForm.Label>Acquired on</StyledForm.Label>
                <DatePicker
                  name='acquiredDate'
                  selected={this.state.acquiredDate}
                  onChange={this.handleAcquiredChange}
                  dateFormat="dd/MM/yyyy"
                  onBlur={this.handleBlur('acquiredDate')}
                />
              </StyledForm.Group>
              <StyledForm.Group as={Col}>
                <StyledForm.Label>Price</StyledForm.Label>
                <StyledForm.Control
                  type='number'
                  name='price'
                  value={this.state.price}
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  isInvalid={this.getValidationState(errors, 'price')}
                />
              </StyledForm.Group>
            </StyledForm.Row>
            <StyledForm.Group controlId='comment'>
              <StyledForm.Label>Comment</StyledForm.Label>
              <StyledForm.Control
                as='textarea'
                rows="5"
                name='comment'
                value={this.state.comment}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                isInvalid={this.getValidationState(errors, 'comment')}
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

const mapStateToProps = store => ({
  authors: store.authors.items
    .sort((a, b) => a.fullName < b.fullName ? -1 : (a.fullName > b.fullName ? 1 : 0)),
  categories: store.categories.items
    .sort((a, b) => a.code < b.code ? -1 : (a.code > b.code ? 1 : 0)),
  locations: store.locations.items
    .sort((a, b) => a.fullName < b.fullName ? -1 : (a.fullName > b.fullName ? 1 : 0)),
  publishers: store.publishers.items
    .sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0))
})

export default connect(
  mapStateToProps
)(BookEdit)

BookEdit.propTypes = {
  book: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    authors: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        firstNames: PropTypes.string,
        fullName: PropTypes.string.isRequired
      })
    ),
    publisher: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }),
    publishingYear: PropTypes.number,
    isbn: PropTypes.string,
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        code: PropTypes.string.isRequired
      })
    ),
    location: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      room: PropTypes.string,
      shelving: PropTypes.string,
      shelf: PropTypes.string
    }),
    serialNumber: PropTypes.number,
    pages: PropTypes.number,
    readPages: PropTypes.number,
    acquiredDate: PropTypes.string,
    price: PropTypes.number,
    comment: PropTypes.string
  }),
  modalIsOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  modalError: PropTypes.string
}