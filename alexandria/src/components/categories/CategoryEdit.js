import React from 'react'
import PropTypes from 'prop-types'
import { StyledForm } from '../common/alexandriaComponents'
import FormButtons from '../common/FormButtons'
import { Modal } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { connect } from 'react-redux'
import RelatedBooks from '../books/relatedBooks'

class CategoryEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: '',
      name: '',
      parent: [],
      level: '',
      number: '',
      touched: {
        name: false,
        level: false,
        number: false
      },
      books: []
    }
  }

  handleEnter = () => {
    const category = this.props.itemToEdit
    if (category) {
      let parent = []
      if (category.parent) {
        parent.push(category.parent)
      }
      this.setState({
        _id: category._id,
        name: category.name,
        parent,
        level: category.level,
        number: category.number,
        books: this.props.relatedBooks ?
          this.props.relatedBooks : []
      })
    }
  }

  handleExit = () => {
    this.setState({
      _id: '',
      name: '',
      parent: [],
      level: '',
      number: '',
      touched: {
        name: false,
        level: false,
        number: false
      },
      books: []
    })
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleParentChange = selected => {
    this.setState({ parent: selected })
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
      number: this.state.number,
      parentId: this.state.parent.length > 0 ? this.state.parent[0]._id : ''
    }
    await this.props.handleSave(category)
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
      number: '',
      parent: [],
      books: []
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
              <StyledForm.Label>Parent category</StyledForm.Label>
              <Typeahead
                onChange={(selected) => { this.handleParentChange(selected) }}
                options={this.state._id ? this.props.categories.filter(c => c._id !== this.state._id) : this.props.categories}
                selected={this.state.parent}
                labelKey={(category) => `${category.code} - ${category.name}`}
                id="_id"
                maxResults={20}
              />
            </StyledForm.Group>
            <StyledForm.Group>
              {(this.state.level || this.state.level === 0) && <StyledForm.Label>{`Level ${this.state.level}`}</StyledForm.Label>}
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              {this.state.number && <StyledForm.Label>{`Number ${this.state.number}`}</StyledForm.Label>}
            </StyledForm.Group>
          </StyledForm>
          <StyledForm.Label>Books</StyledForm.Label>
          {this.state.books && this.state.books.length > 0 &&
            <RelatedBooks books={this.state.books} handleBookClick={this.handleBookClick} />
          }
          {(!this.state.books || this.state.books.length === 0) &&
            <p>No books found in this category</p>
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

const mapStateToProps = store => ({
  categories: store.categories.items
    .sort((a, b) => a.code < b.code ? -1 : (a.code > b.code ? 1 : 0))
})

export default connect(
  mapStateToProps
)(CategoryEdit)

CategoryEdit.propTypes = {
  itemToEdit: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    parentId: PropTypes.string,
    level: PropTypes.number,
    number: PropTypes.number
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

