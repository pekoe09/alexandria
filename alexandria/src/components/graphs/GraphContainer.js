import React from 'react'
import PropTypes from 'prop-types'

const chartBoxCoreStyle = {
  borderStyle: 'solid',
  borderRadius: 4,
  borderWidth: 1,
  padding: 10,
  marginBottom: 10
}

const chartBoxBasicStyle = {
  borderColor: 'lightgrey',
}

const chartBoxInvertedStyle = {
  borderColor: 'rgb(2, 68, 71)',
  backgroundColor: 'rgb(98, 161, 164)',
  color: 'white'
}

const chartTitleStyle = {
  fontSize: '1.3em',
  fontFamily: 'sans-serif'
}

const GraphContainer = ({ getCharts, inverted }) => {
  return (
    <>
      {getCharts.map((getChart, i) => {
        return (
          <div
            style={inverted ? { ...chartBoxCoreStyle, ...chartBoxInvertedStyle } : { ...chartBoxCoreStyle, ...chartBoxBasicStyle }}
            key={getChart.title}>
            <div style={chartTitleStyle}>{getChart.title}</div>
            {getChart.call()}
          </div>
        )
      })}
    </>
  )
}

export default GraphContainer

GraphContainer.propTypes = {
  getCharts: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      call: PropTypes.func.isRequired
    })
  ).isRequired,
  inverted: PropTypes.bool
}