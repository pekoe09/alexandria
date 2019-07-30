import React from 'react'
import PropTypes from 'prop-types'
import { ViewHeader, StyledButton, StyledForm, StyledLink } from './alexandriaComponents'
import { InputGroup, Button } from 'react-bootstrap'
import { Row, Col } from 'react-bootstrap'

const ViewBar = ({
  headerText,
  addBtnText,
  handleOpenEdit,
  handlePhraseChange,
  handleSearch,
  searchPhrase,
  toggleAdvancedSearch,
  showStats
}) => {
  return (
    <>
      <Row>
        <Col md={3}>
          <ViewHeader text={headerText} />
        </Col>
        <Col md={9}style={{ paddingLeft: 0 }}>          
          <StyledButton
            bsstyle='primary'
            style={{ marginRight: 10, float: 'right' }}
            onClick={handleOpenEdit}
          >
            {addBtnText}
          </StyledButton>
          {
            showStats &&
            <StyledButton
              bsstyle='primary'
              style={{ marginLeft: 10, marginRight: 10, float: 'right' }}
              onClick={showStats}
            >
              Statistics
            </StyledButton>
          }
          {
            toggleAdvancedSearch &&
            <Button
              variant='link'
              style={{ 
                color: 'white', 
                fontFamily: 'sans-serif', 
                fontSize: '0.9em',
                float: 'right' 
              }}
              onClick={toggleAdvancedSearch}
            >
              Advanced search
            </Button>
          }
          <InputGroup style={{ float: 'right' }}>
            <StyledForm.Control
              type='text'
              name='searchPhrase'
              value={searchPhrase}
              onChange={handlePhraseChange}
              placeholder='Write a search text'
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
      </Row>
    </>
  )
}

export default ViewBar

ViewBar.propTypes = {
  headerText: PropTypes.string,
  addBtnText: PropTypes.string.isRequired,
  handleOpenEdit: PropTypes.func.isRequired,
  handlePhraseChange: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  searchPhrase: PropTypes.string.isRequired,
  toggleAdvancedSearch: PropTypes.func,
  showStats: PropTypes.func
}