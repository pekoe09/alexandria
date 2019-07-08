import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Reading from './Reading'

const datePageStyle = {
  paddingLeft: 10
}

const getDateReadings = (readings, date) => {
  return readings
    .filter(r => { return moment(date).isSame(r.date, 'day') })
    .sort((a, b) => a.book.title > b.book.title ? 1
      : (a.book.title < b.book.title ? -1 : 0))
}

const getReadingComponents = (dateReadings, handleReadingClick) => {
  return dateReadings.map(r =>
    <Reading
      reading={r}
      handleReadingClick={handleReadingClick}
      key={r._id}
    />
  )
}

const DatePage = ({ readings, date, handleReadingClick }) => {
  let dateReadings = getDateReadings(readings, date)
  return (
    <div style={datePageStyle}>
      <h3>{moment(date).format('D.M.YYYY')}</h3>
      {(dateReadings && dateReadings.length > 0) && getReadingComponents(dateReadings, handleReadingClick)}
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
  handleReadingClick: PropTypes.func.isRequired
}