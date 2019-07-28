import React from 'react'
import PropTypes from 'prop-types'

const KPIBoxStyle = {
  borderStyle: 'solid',
  borderRadius: 4,
  borderColor: 'lightgrey',
  borderWidth: 1,
  padding: 10,
  marginBottom: 10
}

const KPITextStyle = {
  fontSize: '1.4em',
  fontFamily: 'sans-serif'
}

const KPIContainer = ({ kpis }) => {
  return (
    <>
      {kpis.map(kpi => {
        return (
          <div style={KPIBoxStyle} key={kpi.name}>
            <div style={KPITextStyle}>
              {`${kpi.name}: ${kpi.value}`}
            </div>
          </div>
        )
      })}
    </>
  )
}

export default KPIContainer

KPIContainer.propTypes = {
  kpis: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired
    })
  ).isRequired
}