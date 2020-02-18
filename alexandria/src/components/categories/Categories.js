import React from 'react'
import { connect } from 'react-redux'
import CategoryList from './CategoryList'
import CategoryEdit from './CategoryEdit'
import withCRUD from '../common/withCRUD'
import withDeletion from '../common/withDeletion'
import withEditRows from '../common/withEditRows'
import withRelatedBooks from '../common/withRelatedBooks'
import {
  addCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
} from '../../actions/categoryActions'

const defaultSort = (a, b) =>
  a.code > b.code
    ? 1
    : (a.code < b.code
      ? -1
      : 0)

const filterBooks = (book, categoryId) => {

}

const Categories = props => {
  const CategoriesWrapped = withCRUD(withDeletion(withRelatedBooks(withEditRows(CategoryList, CategoryEdit))))
  return (
    <CategoriesWrapped
      repository={'categories'}
      defaultSort={defaultSort}
      addItem={props.addCategory}
      getAllItems={props.getAllCategories}
      updateItem={props.updateCategory}
      deleteItem={props.deleteCategory}
      filterBooks={filterBooks}
    />
  )
}

export default connect(
  null,
  {
    addCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
  }
)(Categories)