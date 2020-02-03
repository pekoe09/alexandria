import React from 'react'
import PropTypes from 'prop-types'
import RelatedBook from './relatedBook'

const relatedBooksStyle = {

}

const RelatedBooks = ({ books, handleBookClick }) => {

  const getBooks = () => {
    return books.map(b => {
      return (
        <RelatedBook
          book={b}
          handleBookClick={handleBookClick}
          key={b._id}
        />
      )
    })
  }

  return (
    <div
      style={relatedBooksStyle}
    >
      {getBooks()}
    </div>
  )
}

export default RelatedBooks

RelatedBooks.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      authorsString: PropTypes.string.isRequired,
      location: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        fullName: PropTypes.string.isRequired
      }),
      pages: PropTypes.number,
      readPages: PropTypes.number
    })
  ),
  handleBookClick: PropTypes.func.isRequired
}