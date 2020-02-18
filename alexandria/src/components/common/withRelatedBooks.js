import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import {
  updateBook
} from '../../actions/bookActions'
import BookEdit from '../books/BookEdit'

const addRelatedBooks = (WrappedComponent) => props => {
  const {
    books,
    updateBook,
    filterBooks,
    ...rest
  } = props

  const [relatedBooks, setRelatedBooks] = useState([])
  const [bookToEdit, setBookToEdit] = useState(null)
  const [bookModalIsOpen, setBookModalIsOpen] = useState(false)

  const toggleBookModalOpen = () => {
    props.showError('')
    setBookModalIsOpen(!bookModalIsOpen)
    setBookToEdit(null)
  }

  const handleBookSave = async (book) => {
    await updateBook(book)
    if (props.error) {
      props.showError('Could not save the book')
    }
  }

  const handleBookClick = (bookId) => {
    setBookToEdit(relatedBooks.find(b => b._id === bookId))
    setBookModalIsOpen(true)
    props.showError('')
  }

  const getRelatedBooks = (itemId) => {
    const result = books.filter(b => filterBooks(b, itemId))
    setRelatedBooks(result)
  }

  return (
    <>
      <WrappedComponent
        getRelatedBooks={getRelatedBooks}
        setRelatedBooks={setRelatedBooks}
        relatedBooks={relatedBooks}
        handleBookClick={handleBookClick}
        {...rest}
      />
      <BookEdit
        book={bookToEdit}
        modalIsOpen={bookModalIsOpen}
        closeModal={toggleBookModalOpen}
        handleSave={handleBookSave}
        modalError={props.modalError}
      />
    </>
  )

}

const mapStateToProps = store => ({
  books: store.books.items.sort((a, b) =>
    a.title > b.title
      ? 1
      : (a.title < b.title
        ? -1
        : 0))
})

const withRelatedBooks = compose(
  connect(mapStateToProps, { updateBook }),
  addRelatedBooks
)

export default withRelatedBooks

withRelatedBooks.propTypes = {
  showError: PropTypes.func.isRequired,
  modalError: PropTypes.string,
  error: PropTypes.string,
  books: PropTypes.array.isRequired,
  updateBook: PropTypes.func.isRequired,
  filterBooks: PropTypes.func.isRequired
}