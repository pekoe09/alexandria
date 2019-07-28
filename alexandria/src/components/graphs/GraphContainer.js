import React from 'react'
import PropTypes from 'prop-types'

const chartBoxStyle = {
  borderStyle: 'solid',
  borderRadius: 4,
  borderColor: 'lightgrey',
  borderWidth: 1,
  padding: 10,
  marginBottom: 10
}

const chartTitleStyle = {
  fontSize: '1.3em',
  fontFamily: 'sans-serif'
}

const GraphContainer = ({ getCharts }) => {
  return (
    <>
      {getCharts.map((getChart, i) => {
        return (
          <div style={chartBoxStyle} key={getChart.title}>
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
}