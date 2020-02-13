import React from 'react'
import { connect } from 'react-redux'
import CategoryList from './CategoryList'
import withCRUD from '../common/withCRUD'
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

const Categories = props => {
  const CategoriesWrapped = withCRUD(CategoryList)
  return (
    <CategoriesWrapped
      repository={'categories'}
      defaultSort={defaultSort}
      addItem={props.addCategory}
      getAllItems={props.getAllCategories}
      updateItem={props.updateCategory}
      deleteItem={props.deleteCategory}
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