import React from 'react'
import PropTypes from 'prop-types'
import { StyledButton } from '../common/alexandriaComponents'
import { Row, Col } from 'react-bootstrap'

const readingStyle = {
  padding: 15,
  marginTop: 10,
  backgroundColor: 'rgb(98, 161, 164)',
  color: 'white',
  fontFamily: 'sans-serif',
  borderRadius: 4
}

const readingHeaderStyle = {
  fontSize: '1.3em'
}

const Reading = ({ reading, handleReadingClick, handleDeleteRequest }) => {
  const id = reading._id
  return (
    <div
      style={readingStyle}
    >
      <Row>
        <Col md={10}>
          <span style={readingHeaderStyle}>{reading.book.title}</span>
          <div onClick={() => handleReadingClick(reading._id)}>
            {reading.startPage && <span>{`From page ${reading.startPage} to ${reading.endPage}`}</span>}
            {reading.readPages && <span>{` Total pages read: ${reading.readPages}`}</span>}
            {reading.minutes && <span>{`, spent ${reading.minutes} minutes`}</span>}
          </div>
        </Col>
        <Col md={2}>
          <StyledButton
            onClick={(e) => handleDeleteRequest(id, e)}
            bsstyle='rowdanger'
            style={{ float: 'right' }}
          >
            Delete
        </StyledButton>
        </Col>
      </Row>
    </div>
  )
}

export default Reading

Reading.propTypes = {
  reading: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    book: PropTypes.shape({
      title: PropTypes.string.isRequired
    }).isRequired,
    startPage: PropTypes.number,
    endPage: PropTypes.number,
    readPages: PropTypes.number.isRequired,
    minutes: PropTypes.number
  }).isRequired,
  handleReadingClick: PropTypes.func.isRequired,
  handleDeleteRequest: PropTypes.func.isRequired
}