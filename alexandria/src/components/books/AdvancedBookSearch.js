import React from 'react'
import PropTypes from 'prop-types'
import { StyledForm } from '../common/alexandriaComponents'
import { Modal, Col, Button } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { connect } from 'react-redux'

class AdvancedBookSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      author: '',
      categories: [],
      publisher: '',
      publishingYear: '',
      isbn: '',
      locations: [],
      serialNumber: '',
      includeReadBooks: true,
      includeUnfinishedBooks: true,
      includeUnreadBooks: true
    }
  }

  clearState = () => {
    this.setState({
      title: '',
      author: '',
      categories: [],
      publisher: '',
      publishingYear: '',
      isbn: '',
      locations: [],
      serialNumber: '',
      includeReadBooks: true,
      includeUnfinishedBooks: true,
      includeUnreadBooks: true
    })
  }

  handleEnter = () => {
    if (this.props.criteria) {
      this.setState({
        title: this.props.title,
        author: this.props.author,
        categories: this.props.categories,
        publisher: this.props.publisher,
        publishingYear: this.props.publishingYear,
        isbn: this.props.isbn,
        locations: this.props.locations,
        serialNumber: this.props.serialNumber,
        includeReadBooks: this.props.includeReadBooks,
        includeUnfinishedBooks: this.props.includeUnfinishedBooks,
        includeUnreadBooks: this.props.includeUnreadBooks
      })
    }
  }

  handleExit = () => {
    this.clearState()
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleCheckboxChange = (event, name) => {
    this.setState({ [name]: event.target.checked })
  }

  handleCategoryChange = selected => {
    this.setState({ categories: selected })
  }

  handleLocationChange = selected => {
    this.setState({ locations: selected })
  }

  handleSearch = () => {
    const criteria = { ...this.state }
    this.props.handleSearch(criteria)
  }

  handleCancel = () => {
    this.clearState()
    this.props.closeModal()
  }

  render() {
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
          <Modal.Title>Search books</Modal.Title>
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
              />
            </StyledForm.Group>
            <StyledForm.Group controlId='author'>
              <StyledForm.Label>Author</StyledForm.Label>
              <StyledForm.Control
                type='text'
                name='author'
                value={this.state.author}
                onChange={this.handleChange}
              />
            </StyledForm.Group>
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
              <StyledForm.Group controlId='publisher' as={Col}>
                <StyledForm.Label>Publisher</StyledForm.Label>
                <StyledForm.Control
                  type='text'
                  name='publisher'
                  value={this.state.publisher}
                  onChange={this.handleChange}
                />
              </StyledForm.Group>
              <StyledForm.Group controlId='publishingYear' as={Col} md={2}>
                <StyledForm.Label>Publishing year</StyledForm.Label>
                <StyledForm.Control
                  type='number'
                  name='publishingYear'
                  value={this.state.publishingYear}
                  onChange={this.handleChange}
                />
              </StyledForm.Group>
            </StyledForm.Row>
            <StyledForm.Row>
              <StyledForm.Group controlId='isbn' as={Col}>
                <StyledForm.Label>ISBN</StyledForm.Label>
                <StyledForm.Control
                  type='text'
                  name='isbn'
                  value={this.state.isbn}
                  onChange={this.handleChange}
                />
              </StyledForm.Group>
              <StyledForm.Group controlId='serialNumber' as={Col}>
                <StyledForm.Label>Serial number</StyledForm.Label>
                <StyledForm.Control
                  type='number'
                  name='serialNumber'
                  value={this.state.serialNumber}
                  onChange={this.handleChange}
                />
              </StyledForm.Group>
            </StyledForm.Row>
            <StyledForm.Group>
              <StyledForm.Label>Locations</StyledForm.Label>
              <Typeahead
                onChange={(selected) => { this.handleLocationChange(selected) }}
                options={this.props.locations}
                selected={this.state.locations}
                multiple
                clearButton
                labelKey='fullName'
                id="_id"
                maxResults={20}
              />
            </StyledForm.Group>
            <StyledForm.Check
              inline
              label='Read books'
              checked={this.state.includeReadBooks}
              onChange={(e) => this.handleCheckboxChange(e, 'includeReadBooks')}
            />
            <StyledForm.Check
              inline
              label='Unfinished books'
              checked={this.state.includeUnfinishedBooks}
              onChange={(e) => this.handleCheckboxChange(e, 'includeUnfinishedBooks')}
            />
            <StyledForm.Check
              inline
              label='Unread books'
              checked={this.state.includeUnreadBooks}
              onChange={(e) => this.handleCheckboxChange(e, 'includeUnreadBooks')}
            />
          </StyledForm>
        </Modal.Body>
        <Modal.Footer>
          <Button
            bsstyle='primary'
            type='submit'
            onClick={this.handleSearch}
            style={{ marginRight: 5 }}
          >
            Search
          </Button>
          <Button
            bsstyle='default'
            onClick={this.clearState}
          >
            Clear
          </Button>
          <Button
            bsstyle='default'
            onClick={this.handleCancel}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

const mapStateToProps = store => ({
  categories: store.categories.items
    .sort((a, b) => a.code < b.code ? -1 : (a.code > b.code ? 1 : 0)),
  locations: store.locations.items
    .sort((a, b) => a.fullName < b.fullName ? -1 : (a.fullName > b.fullName ? 1 : 0))
})

export default connect(
  mapStateToProps
)(AdvancedBookSearch)

AdvancedBookSearch.propTypes = {
  modalIsOpen: PropTypes.bool,
  searchCriteria: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })),
    publisher: PropTypes.string,
    publishingYear: PropTypes.number,
    isbn: PropTypes.string,
    locations: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })),
    serialNumber: PropTypes.number,
    includeReadBooks: PropTypes.bool,
    includeUnfinishedBooks: PropTypes.bool,
    includeUnreadBooks: PropTypes.bool
  }),
  handleSearch: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired
}