import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import { StyledForm } from '../common/alexandriaComponents'
import FormButtons from '../common/FormButtons'
import { Modal, Row, Col } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { connect } from 'react-redux'
import { timingSafeEqual } from 'crypto';

class ReadingEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: '',
      date: null,
      book: [],
      readPages: '',
      startPage: '',
      endPage: '',
      minutes: '',
      touched: {
        date: false,
        book: false
      }
    }
  }

  clearState = () => {
    this.setState({
      _id: '',
      date: null,
      book: [],
      readPages: '',
      startPage: '',
      endPage: '',
      minutes: '',
      touched: {
        date: false,
        book: false
      }
    })
  }

  handleEnter = () => {
    if (this.props.reading) {
      this.setState({
        _id: this.props.reading._id,
        date: this.props.reading.date ?
          moment(this.props.reading.date).toDate() : null,
        book: this.props.reading.book ? [this.props.reading.book] : [],
        readPages: this.props.reading.readPages,
        startPage: this.props.reading.startPage,
        endPage: this.props.reading.endPage,
        minutes: this.props.reading.minutes,
        touched: {
          date: false,
          book: false
        }
      })
    }
  }

  handleExit = () => {
    this.clearState()
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handlePageChange = event => {
    if (event.target.name === 'startPage' && event.target.value) {
      if (this.state.endPage) {
        this.setState({
          startPage: event.target.value,
          readPages: this.state.endPage - event.target.value
        })
      } else if (this.state.readPages) {
        this.setState({
          startPage: event.target.value,
          endPage: event.target.value + Number(this.state.readPages)
        })
      } else {
        this.setState({
          startPage: event.target.value
        })
      }
    } else if (event.target.name === 'endPage' && event.target.value) {
      if (this.state.startPage) {
        this.setState({
          endPage: event.target.value,
          readPages: event.target.value - this.state.startPage
        })
      } else if (this.state.readPages) {
        this.setState({
          endPage: event.target.value,
          startPage: event.target.value - this.state.readPages
        })
      } else {
        this.setState({
          endPage: event.target.value
        })
      }
    } else if (event.target.name === 'readPages' && event.target.value) {
      if (this.state.startPage) {
        this.setState({
          endPage: Number(this.state.startPage) + Number(event.target.value),
          readPages: event.target.value
        })
      } else if (this.state.endPage) {
        this.setState({
          startPage: Number(this.state.endPage) - Number(event.target.value),
          readPages: event.target.value
        })
      } else {
        this.setState([
          this.setState({
            readPages: event.target.value
          })
        ])
      }
    } else {
      this.setState({ [event.target.name]: event.target.value })
    }
  }

  handleBookChange = selected => {
    this.setState({ book: selected })
  }

  handleDateChange = date => {
    this.setState({ date })
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
    const reading = {
      _id: this.state._id,
      date: this.state.date,
      book: this.state.book.length > 0 ? this.state.book[0]._id : null,
      readPages: this.state.readPages,
      startPage: this.state.startPage,
      endPage: this.state.endPage,
      minutes: this.state.minutes,
    }
    await this.props.handleSave(reading)
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
      date: !this.state.date,
      book: this.state.book.length === 0,
      readPages: !this.state.readPages || this.state.readPages === 0
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
        dialogClassName='wide-modal'
      >
        <Modal.Header closeButton>
          <Modal.Title>Add/edit a reading session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StyledForm>
            <StyledForm.Group as={Col}>
              <StyledForm.Label>Date</StyledForm.Label>
              <DatePicker
                name='date'
                selected={this.state.date}
                onChange={this.handleDateChange}
                dateFormat="dd/MM/yyyy"
                onBlur={this.handleBlur('date')}
              />
            </StyledForm.Group>
            <StyledForm.Group as={Col}>
              <StyledForm.Label>Book</StyledForm.Label>
              <Typeahead
                onChange={(selected) => { this.handleBookChange(selected) }}
                options={this.props.books}
                selected={this.state.book}
                labelKey="title"
                id="_id"
                maxResults={20}
              />
            </StyledForm.Group>
            <StyledForm.Row>
              <StyledForm.Group as={Col}>
                <StyledForm.Label>Start page</StyledForm.Label>
                <StyledForm.Control
                  type='number'
                  name='startPage'
                  value={this.state.startPage}
                  onChange={this.handlePageChange}
                  onBlur={this.handleBlur}
                  isInvalid={this.getValidationState(errors, 'startPage')}
                />
              </StyledForm.Group>
              <StyledForm.Group as={Col}>
                <StyledForm.Label>End page</StyledForm.Label>
                <StyledForm.Control
                  type='number'
                  name='endPage'
                  min={1}
                  value={this.state.endPage}
                  onChange={this.handlePageChange}
                  onBlur={this.handleBlur}
                  isInvalid={this.getValidationState(errors, 'endPage')}
                />
              </StyledForm.Group>
              <StyledForm.Group as={Col}>
                <StyledForm.Label>Pages read</StyledForm.Label>
                <StyledForm.Control
                  type='number'
                  name='readPages'
                  min={1}
                  value={this.state.readPages}
                  onChange={this.handlePageChange}
                  onBlur={this.handleBlur}
                  isInvalid={this.getValidationState(errors, 'readPages')}
                />
              </StyledForm.Group>
              <StyledForm.Group as={Col}>
                <StyledForm.Label>Minutes read</StyledForm.Label>
                <StyledForm.Control
                  type='number'
                  name='minutes'
                  min={1}
                  value={this.state.minutes}
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  isInvalid={this.getValidationState(errors, 'minutes')}
                />
              </StyledForm.Group>
            </StyledForm.Row>
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
  books: store.books.items
    .sort((a, b) => a.title < b.title ? -1 : (a.title > b.title ? 1 : 0))
})

export default connect(
  mapStateToProps
)(ReadingEdit)

ReadingEdit.propTypes = {
  reading: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    book: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
    date: PropTypes.string.isRequired,
    startPage: PropTypes.number,
    endPage: PropTypes.number,
    readPages: PropTypes.number.isRequired,
    minutes: PropTypes.number
  }),
  modalIsOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  modalError: PropTypes.string
}