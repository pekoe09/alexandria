import React, { useState } from 'react'
import PropTypes from 'prop-types'
import DeletionConfirmation from './DeletionConfirmation'

const withDeletion = (WrappedComponent) => props => {
  const {
    handleDelete,
    ...rest
  } = props

  const [deletionTargetId, setDeletionTargetId] = useState('')
  const [deletionTargetName, setDeletionTargetName] = useState('')
  const [deletionConfirmationIsOpen, setDeletionConfirmationIsOpen] = useState(false)

  const handleDeleteRequest = (item, e) => {
    e.stopPropagation()
    setDeletionTargetId(item._id)
    setDeletionTargetName(item.name)
    setDeletionConfirmationIsOpen(true)
  }

  const handleDeleteConfirmation = async (isConfirmed) => {
    if (isConfirmed) {
      await handleDelete(deletionTargetId)
    }
    setDeletionConfirmationIsOpen(false)
    setDeletionTargetId('')
    setDeletionTargetName('')
  }

  return (
    <>
      <WrappedComponent
        {...rest}
        handleDeleteRequest={handleDeleteRequest}
      />
      <DeletionConfirmation
        headerText={`Deleting ${deletionTargetName}`}
        bodyText='Are you sure you want to go ahead and delete this?'
        modalIsOpen={deletionConfirmationIsOpen}
        closeModal={handleDeleteConfirmation}
      />
    </>
  )

}

export default withDeletion

withDeletion.propTypes = {
  handleDelete: PropTypes.func.isRequired
}