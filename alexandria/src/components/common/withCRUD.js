import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'

const addCRUDs = (WrappedComponent) => props => {
  const {
    items,
    addItem,
    getAllItems,
    updateItem,
    deleteItem
  } = props

  useEffect(() => {
    (async function getData() {
      await getAllItems()
    })()
  }, [])

  const [modalError, setModalError] = useState('')

  const handleSave = async (item) => {
    if (item._id) {
      await updateItem(item)
    } else {
      await addItem(item)
    }
    if (props.error) {
      setModalError('Could not save the item')
    }
  }

  const handleDelete = async (itemId) => {
    await deleteItem(itemId)
    if (props.error) {
      setModalError('Could not delete the item')
    }
  }

  const showError = error => setModalError(error)

  return (
    <WrappedComponent
      items={items}
      handleSave={handleSave}
      handleDelete={handleDelete}
      showError={showError}
      modalError={modalError}
    />
  )
}

const mapStateToProps = (store, ownProps) => {
  return {
    items: store[ownProps.repository].items.sort(ownProps.defaultSort)
  }
}

const withCRUD = compose(
  connect(mapStateToProps, null),
  addCRUDs
)

export default withCRUD

withCRUD.propTypes = {
  repository: PropTypes.string.isRequired,
  defaultSort: PropTypes.func.isRequired,
  addItem: PropTypes.func.isRequired,
  getAllItems: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired
}