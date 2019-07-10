import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Reading from './Reading'

const datePageStyle = {
  paddingLeft: 10
}

const datePageHeaderStyle = {
  backgroundColor: 'rgb(2, 68, 71)',
  color: 'white',
  fontSize: '1.3em',
  fontFamily: 'sans-serif',
  padding: '5px 5px 5px 10px',
  borderRadius: 4
}

const getDateReadings = (readings, date) => {
  return readings
    .filter(r => { return moment(date).isSame(r.date, 'day') })
    .sort((a, b) => a.book.title > b.book.title ? 1
      : (a.book.title < b.book.title ? -1 : 0))
}

const getReadingComponents = (dateReadings, handleReadingClick, handleDeleteRequest) => {
  return dateReadings.map(r =>
    <Reading
      reading={r}
      handleReadingClick={handleReadingClick}
      handleDeleteRequest={handleDeleteRequest}
      key={r._id}
    />
  )
}

const DatePage = ({ readings, date, handleReadingClick, handleDeleteRequest }) => {
  let dateReadings = getDateReadings(readings, date)
  return (
    <div style={datePageStyle}>
      <div style={datePageHeaderStyle}>{moment(date).format('D.M.YYYY')}</div>
      {(dateReadings && dateReadings.length > 0)
        && getReadingComponents(dateReadings, handleReadingClick, handleDeleteRequest)}
      {(!dateReadings || dateReadings.length === 0) && <div>No reading sessions.</div>}
    </div>
  )
}

export default DatePage

DatePage.propTypes = {
  readings: PropTypes.arrayOf(
    PropTypes.shape({

    })
  ),
  date: PropTypes.instanceOf(Date),
  handleReadingClick: PropTypes.func.isRequired,
  handleDeleteRequest: PropTypes.func.isRequired
}