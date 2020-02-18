import React from 'react'
import { connect } from 'react-redux'
import AuthorList from './AuthorList'
import AuthorEdit from './AuthorEdit'
import withCRUD from '../common/withCRUD'
import withDeletion from '../common/withDeletion'
import withEditRows from '../common/withEditRows'
import withRelatedBooks from '../common/withRelatedBooks'
import {
  addAuthor,
  getAllAuthors,
  updateAuthor,
  deleteAuthor
} from '../../actions/authorActions'

const defaultSort = (a, b) =>
  a.fullNameReversed > b.fullNameReversed
    ? 1
    : (a.fullNameReversed < b.fullNameReversed
      ? -1
      : 0)

const filterBooks = (book, authorId) =>
  book.authors.find(a => a._id === authorId)

const Authors = props => {
  const AuthorsWrapped = withCRUD(withDeletion(withRelatedBooks(withEditRows(AuthorList, AuthorEdit))))
  return (
    <AuthorsWrapped
      repository={'authors'}
      defaultSort={defaultSort}
      addItem={props.addAuthor}
      getAllItems={props.getAllAuthors}
      updateItem={props.updateAuthor}
      deleteItem={props.deleteAuthor}
      filterBooks={filterBooks}
    />
  )
}

export default connect(
  null,
  {
    addAuthor,
    getAllAuthors,
    updateAuthor,
    deleteAuthor
  }
)(Authors)