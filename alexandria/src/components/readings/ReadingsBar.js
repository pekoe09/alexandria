import React from 'react'
import PropTypes from 'prop-types'
import { ViewHeader, StyledButton } from '../common/alexandriaComponents'
import { Row, Col } from 'react-bootstrap'

const ReadingsBar = ({ handleOpenEdit }) => {
  return (
    <>
      <Row>
        <Col md={8} sm={8}>
          <ViewHeader text='Reading sessions' />
        </Col>
        <Col md={4} sm={4}>
          <StyledButton
            bsstyle='primary'
            style={{ marginLeft: 10, marginRihgt: 0, float: 'right' }}
            onClick={handleOpenEdit}
          >
            Add reading
        </StyledButton>
        </Col>
      </Row>
    </>
  )
}

export default ReadingsBar

ReadingsBar.propTypes = {
  handleOpenEdit: PropTypes.func.isRequired
}