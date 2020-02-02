import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import { StyledForm } from '../common/alexandriaComponents'
import FormButtons from '../common/FormButtons'
import { Modal, Button } from 'react-bootstrap'
import RelatedBooks from '../books/relatedBooks'

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
      },
      books: [],
      viewType: 'Create'
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
      },
      books: [],
      viewType: 'Create'
    })
  }

  handleEnter = () => {
    if (this.props.author) {
      this.setState({
        _id: this.props.author._id,
        lastName: this.props.author.lastName,
        firstNames: this.props.author.firstNames,
        DOB: this.props.author.DOB ?
          moment(this.props.author.DOB).toDate() : null,
        DOD: this.props.author.DOD ?
          moment(this.props.author.DOD).toDate() : null,
        books: this.props.relatedBooks ?
          this.props.relatedBooks : [],
        viewType: this.props.viewType === 'Update' ? 'Update' : 'View'
      })
    }
  }

  handleExit = () => {
    this.clearState()
  }


  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleDOBChange = date => {
    this.setState({
      DOB: date
    })
  }

  handleDODChange = date => {
    this.setState({
      DOD: date
    })
  }

  toggleViewType = () => {
    if (this.state.viewType === 'View') {
      this.setState({ viewType: 'Update' })
    } else {
      this.setState({ viewType: 'View' })
    }
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

  handleBookClick = (bookId) => {
    this.props.handleBookClick(bookId)
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

  getTitle = () => {
    const viewType = this.props.viewType
    const author = this.props.author
    return viewType === 'Create' ? 'Create author' :
      viewType === 'Update' ? `Update ${author.fullName}` : author.fullName
  }

  getEditBody = () => {
    const errors = this.validate()
    const saveIsDisabled = Object.keys(errors).some(x => errors[x])
    return (
      <>
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
      </>
    )
  }

  getViewBody = () => {
    return (
      <>
        <Modal.Body>
          <StyledForm>
            <StyledForm.Group controlId='lastName'>
              <StyledForm.Label>Last name</StyledForm.Label>
              <div>{this.state.lastName}</div>
            </StyledForm.Group>
            <StyledForm.Group controlId='firstNames'>
              <StyledForm.Label>First names</StyledForm.Label>
              <div>{this.state.firstNames}</div>
            </StyledForm.Group>
            <StyledForm.Group controlId='DOB'>
              <StyledForm.Label>Date of birth</StyledForm.Label>
              <div>{this.state.DOB ? moment(this.state.DOD).format('D.M.YYYY') : '-'}</div>
            </StyledForm.Group>
            <StyledForm.Group controlId='DOD'>
              <StyledForm.Label>Date of death</StyledForm.Label>
              <div>{this.state.DOD ? moment(this.state.DOD).format('D.M.YYYY') : '-'}</div>
            </StyledForm.Group>
          </StyledForm>
          {this.state.books &&
            <RelatedBooks books={this.state.books} handleBookClick={this.handleBookClick} />
          }
        </Modal.Body>
        <Modal.Footer>
          <FormButtons
            handleSave={this.handleSubmit}
            handleCancel={this.handleCancel}
            saveIsDisabled={false}
          />
        </Modal.Footer>
      </>
    )
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
      >
        <Modal.Header>
          <Modal.Title style={{ width: '100%' }}>
            {this.getTitle()}
            <Button
              style={{ float: 'right' }}
              onClick={this.toggleViewType}
            >
              {this.state.viewType === 'View' ? 'Edit' : 'View'}
            </Button>
          </Modal.Title>
        </Modal.Header>
        {this.state.viewType === 'Update' && this.getEditBody()}
        {this.state.viewType === 'View' && this.getViewBody()}
      </Modal>
    )
  }
}

export default AuthorEdit

AuthorEdit.propTypes = {
  viewType: PropTypes.oneOf(['Create', 'Update', 'View']).isRequired,
  author: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    firstNames: PropTypes.string,
    DOB: PropTypes.string,
    DOD: PropTypes.string
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
  modalError: PropTypes.string
}