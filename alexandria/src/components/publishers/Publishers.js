import React from 'react'
import { connect } from 'react-redux'
import PublisherList from './PublisherList'
import withCRUD from '../common/withCRUD'
import withDeletion from '../common/withListTable'
import {
  addPublisher,
  getAllPublishers,
  updatePublisher,
  deletePublisher
} from '../../actions/publisherActions'

const defaultSort = (a, b) =>
  a.name > b.name ? 1 : (a.name < b.name ? -1 : 0)

const Publishers = props => {
  const PublishersWrapped = withCRUD(withDeletion(PublisherList))
  return (
    <PublishersWrapped
      repository={'publishers'}
      defaultSort={defaultSort}
      addItem={props.addPublisher}
      getAllItems={props.getAllPublishers}
      updateItem={props.updatePublisher}
      deleteItem={props.deletePublisher}
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