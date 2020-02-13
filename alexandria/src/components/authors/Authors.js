import React from 'react'
import { connect } from 'react-redux'
import AuthorList from './AuthorList'
import withCRUD from '../common/withCRUD'
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

const Authors = props => {
  console.log('touch Authors')
  const Auths = withCRUD(AuthorList)
  return (
    <Auths
      repository={'authors'}
      defaultSort={defaultSort}
      addItem={props.addAuthor}
      getAllItems={props.getAllAuthors}
      updateItem={props.updateAuthor}
      deleteItem={props.deleteAuthor}
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