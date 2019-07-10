import React from 'react'
import PropTypes from 'prop-types'
import { ViewHeader, StyledButton, StyledForm } from '../common/alexandriaComponents'
import { InputGroup } from 'react-bootstrap'
import { Row, Col } from 'react-bootstrap'

const ReadingsBar = ({
  handleOpenEdit,
  handlePhraseChange,
  handleSearch,
  searchPhrase
}) => {
  return (
    <>
      <Row>
        <Col md={5} sm={5}>
          <ViewHeader text='Reading sessions' />
        </Col>
        <Col md={5} sm={5} style={{ paddingRight: 0 }}>
          <InputGroup>
            <StyledForm.Control
              type='text'
              name='searchPhrase'
              value={searchPhrase}
              onChange={handlePhraseChange}
            />
            <InputGroup.Append>
              <StyledButton
                onClick={handleSearch}
              >
                Go!
              </StyledButton>
            </InputGroup.Append>
          </InputGroup>
        </Col>
        <Col md={2} sm={2} style={{ paddingLeft: 0 }}>
          <StyledButton
            bsstyle='primary'
            style={{ marginLeft: 10, marginRight: 0, float: 'right' }}
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
  handleOpenEdit: PropTypes.func.isRequired,
  handlePhraseChange: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  searchPhrase: PropTypes.string.isRequired
}