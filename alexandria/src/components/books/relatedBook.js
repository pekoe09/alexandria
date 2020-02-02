import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'

const relatedBookStyle = {
  padding: 10,
  marginTop: 5,
  fontFamily: 'sans-serif',
  backgroundColor: 'rgb(98, 161, 164)',
  color: 'white',
  borderRadius: 4
}

const RelatedBook = ({ book, handleBookClick }) => {
  let readPart = '0%'
  if (book.pages) {
    if (book.readPages) {
      readPart = `${(book.readPages / book.pages * 100).toFixed(0)}%`
    }
  }

  return (
    <div
      style={relatedBookStyle}
      onClick={() => handleBookClick(book._id)}
    >
      <Row>
        <Col md={8}>
          {book.title}
        </Col>
        <Col md={4}>
          {`${book.readPages}/${book.pages} (${readPart})`}
        </Col>
      </Row>
    </div>
  )
}

export default RelatedBook

RelatedBook.propTypes = {
  book: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    authorsString: PropTypes.string.isRequired,
    location: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired
    }),
    pages: PropTypes.number,
    readPages: PropTypes.number
  }),
  handleBookClick: PropTypes.func.isRequired
}