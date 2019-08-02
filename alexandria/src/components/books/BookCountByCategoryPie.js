import React from 'react'
import PropTypes from 'prop-types'
import { VictoryPie } from 'victory'

const BookCountByCategoryPie = ({ data, style }) => {
  console.log('pie style', style)
  return (
    <VictoryPie
      data={data}
      x='name'
      y='count'
      labels={d => `${d.name} ${d.count}`}
      padding={40}
      colorScale='cool'
      width={600}
      style={style}
    />
  )
}

export default BookCountByCategoryPie

BookCountByCategoryPie.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired
    })
  )
}
