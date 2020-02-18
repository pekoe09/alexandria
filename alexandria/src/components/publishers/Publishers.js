import React from 'react'
import { connect } from 'react-redux'
import PublisherList from './PublisherList'
import PublisherEdit from './PublisherEdit'
import withCRUD from '../common/withCRUD'
import withDeletion from '../common/withDeletion'
import withEditRows from '../common/withEditRows'
import withRelatedBooks from '../common/withRelatedBooks'
import {
  addPublisher,
  getAllPublishers,
  updatePublisher,
  deletePublisher
} from '../../actions/publisherActions'

const defaultSort = (a, b) =>
  a.name > b.name ? 1 : (a.name < b.name ? -1 : 0)

const filterBooks = (book, publisherId) =>
  book.publisher && book.publisher._id === publisherId

const Publishers = props => {
  const PublishersWrapped = withCRUD(withDeletion(withRelatedBooks(withEditRows(PublisherList, PublisherEdit))))
  return (
    <PublishersWrapped
      repository={'publishers'}
      defaultSort={defaultSort}
      addItem={props.addPublisher}
      getAllItems={props.getAllPublishers}
      updateItem={props.updatePublisher}
      deleteItem={props.deletePublisher}
      filterBooks={filterBooks}
    />
  )
}

export default connect(
  null,
  {
    addPublisher,
    getAllPublishers,
    updatePublisher,
    deletePublisher
  }
)(Publishers)