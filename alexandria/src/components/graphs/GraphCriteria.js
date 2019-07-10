import React from 'react'
import {StyledForm} from '../common/alexandriaComponents'
import PropTypes from 'prop-types'

const GraphCriteria = () => {
  return (
    <>
      {criteriaForm}
    </>
  )
}

export default GraphCriteria

GraphCriteria.propTypes = {
  criteriaForm: PropTypes.instanceOf(StyledForm).isRequired
}