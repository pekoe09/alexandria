import React from 'react'
import { connect } from 'react-redux'
import BookList from './BookList'
import withCRUD from '../common/withCRUD'
import {
  addBook,
  getAllBooks,
  updateBook,
  deleteBook
} from '../../actions/bookActions'

const defaultSort = (a, b) =>
  a.title > b.title
    ? 1
    : (a.title < b.title
      ? -1
      : 0)

const Books = props => {
  const BooksWrapped = withCRUD(BookList)
  return (
    <BooksWrapped
      repository={'books'}
      defaultSort={defaultSort}
      addItem={props.addBook}
      getAllItems={props.getAllBooks}
      updateItem={props.updateBook}
      deleteItem={props.deleteBook}
    />
  )
}

export default connect(
  null,
  {
    addBook,
    getAllBooks,
    updateBook,
    deleteBook
  }
)(Books)