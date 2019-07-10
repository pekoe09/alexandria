import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'

const sidebarStyle = {
  height: '100vh',
  padding: 15,
  backgroundColor: 'rgb(2, 68, 71)',
  color: 'white',
  marginRight: 15
}

const listStyle = {
  listStyle: 'none',
  paddingLeft: 20
}

const mapDays = (datesSorted, year, month, handleDateClick) => {
  const monthDates = datesSorted.filter(d => moment(d).year() === year && moment(d).month() === month)
  const days = [...new Set(monthDates.map(d => moment(d).date()))]
    .sort((a, b) => b - a)

  return days.map(d =>
    <li
      key={d}
      onClick={() => handleDateClick(new Date(year, month, d))}
    >
      {`${d}.${month + 1}.${year}`}
    </li>
  )
}

const mapMonths = (datesSorted, year, handleDateClick) => {
  const yearDates = datesSorted.filter(d => moment(d).year() === year)
  const months = [...new Set(yearDates.map(d => moment(d).month()))]
    .sort((a, b) => b - a)

  return months.map(m =>
    <li key={m}>
      {moment.monthsShort()[m]}
      <ul style={listStyle}>
        {mapDays(datesSorted, year, m, handleDateClick)}
      </ul>
    </li>
  )
}

const mapYears = (datesSorted, handleDateClick) => {
  const years = [...new Set(datesSorted.map(d => moment(d).year()))]
    .sort((a, b) => b - a)

  return years.map(y =>
    <li key={y}>
      {y}
      <ul style={listStyle}>
        {mapMonths(datesSorted, y, handleDateClick)}
      </ul>
    </li>
  )
}

const getHeadings = (dates, handleDateClick) => {
  const datesSorted = dates.sort((a, b) => {
    return moment(a) - moment(b)
  })
  return (
    <ul style={listStyle}>
      {mapYears(datesSorted, handleDateClick)}
    </ul>
  )
}

const DiarySideBar = ({ dates, handleDateClick }) => {
  return (
    <div style={sidebarStyle}>
      Reading sessions
      {dates && dates.length > 0 && getHeadings(dates, handleDateClick)}
      {(!dates || dates.length === 0) && <div>No entries</div>}
    </div>
  )
}

export default DiarySideBar

DiarySideBar.propTypes = {
  dates: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleDateClick: PropTypes.func.isRequired
}