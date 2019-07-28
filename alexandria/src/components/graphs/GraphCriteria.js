import React from 'react'
import PropTypes from 'prop-types'

const GraphCriteria = ({ getCriteriaForm }) => {
  return (
    <>
      {getCriteriaForm()}
    </>
  )
}

export default GraphCriteria

GraphCriteria.propTypes = {
  getCriteriaForm: PropTypes.func.isRequired
}