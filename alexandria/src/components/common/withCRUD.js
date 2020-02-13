import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

const getCRUDs = (WrappedComponent) => props => {
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

  const handleSave = async (author) => {
    if (author._id) {
      await updateItem(author)
    } else {
      await addItem(author)
    }
    if (props.error) {
      setModalError('Could not save the author')
    }
  }

  const handleDelete = async (itemId) => {
    await deleteItem(itemId)
    if (props.error) {
      setModalError('Could not delete the author')
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
  getCRUDs
)

export default withCRUD