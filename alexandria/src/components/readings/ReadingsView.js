import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import ReadingsBar from './ReadingsBar'
import DiarySideBar from './DiarySideBar'
import DatePage from './DatePage'
import ReadingEdit from './ReadingEdit'
import {
  getAllReadings,
  addReading,
  updateReading,
  deleteReading
} from '../../actions/readingActions'

const mainColStyle = {
  paddingRight: 0
}

class ReadingsView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date(),
      editModalIsOpen: false,
      modalError: '',
      readingToEdit: null
    }
  }

  componentDidMount = async () => {
    await this.props.getAllReadings()
  }

  handleDateClick = date => {
    this.setState({ date })
  }

  getDates = () => {
    return this.props.readings.map(r => r.date)
  }

  toggleEditModalOpen = () => {
    this.setState({
      editModalIsOpen: !this.state.editModalIsOpen,
      modalError: '',
      readingToEdit: null
    })
  }

  handleSave = async (reading) => {
    if (reading._id) {
      await this.props.updateReading(reading)
    } else {
      await this.props.addReading(reading)
    }
    if (this.props.error) {
      this.setState({ modalError: 'Could not save the reading session' })
    }
  }

  handleReadingClick = (readingId) => {
    const reading = this.props.readings.find(r => r._id === readingId)
    this.setState({ 
      readingToEdit: reading,
      editModalIsOpen: true
    })
  }

  render() {
    return (
      <>
        <Row>
          <Col sm={10} style={mainColStyle}>
            <ReadingsBar
              handleOpenEdit={this.toggleEditModalOpen}
            />
            <DatePage
              readings={this.props.readings}
              date={this.state.date}
              handleReadingClick={this.handleReadingClick}
            />
          </Col>
          <Col sm={2}>
            <DiarySideBar
              dates={this.getDates()}
              handleDateClick={this.handleDateClick}
            />
          </Col>
        </Row>

        <ReadingEdit
          reading={this.state.readingToEdit}
          modalIsOpen={this.state.editModalIsOpen}
          closeModal={this.toggleEditModalOpen}
          handleSave={this.handleSave}
          modalError={this.state.modalError}
        />
      </>
    )
  }
}

const mapStateToProps = store => ({
  readings: store.readings.items,
  error: store.readings.error
})

export default connect(
  mapStateToProps,
  {
    getAllReadings,
    addReading,
    updateReading,
    deleteReading
  }
)(ReadingsView)