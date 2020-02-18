import React, { useState } from 'react'
import PropTypes from 'prop-types'

const withEditRows = (WrappedComponent, EditViewComponent) => props => {
  const {
    showError,
    getRelatedBooks,
    setRelatedBooks,
    relatedBooks,
    ...rest
  } = props

  const [editModalIsOpen, setEditModalIsOpen] = useState(false)
  const [rowToEdit, setRowToEdit] = useState(null)

  const toggleEditModalOpen = () => {
    showError('')
    setEditModalIsOpen(!editModalIsOpen)
    setRowToEdit(null)
  }

  const handleRowClick = (row) => {
    setEditModalIsOpen(true)
    setRowToEdit(row.original)
    if (setRelatedBooks) {
      getRelatedBooks(row.original._id)
    }
    props.showError('')
  }

  return (
    <>
      <WrappedComponent
        toggleEditModalOpen={toggleEditModalOpen}
        handleRowClick={handleRowClick}
        {...rest}
      />
      <EditViewComponent
        itemToEdit={rowToEdit}
        modalIsOpen={editModalIsOpen}
        closeModal={toggleEditModalOpen}
        handleSave={props.handleSave}
        relatedBooks={props.relatedBooks}
        handleBookClick={props.handleBookClick}
        modalError={props.modalError}
      />
    </>
  )
}

export default withEditRows

withEditRows.propTypes = {
  showError: PropTypes.func.isRequired,
  getRelatedBooks: PropTypes.func,
  setRelatedBooks: PropTypes.func,
  relatedBooks: PropTypes.array.isRequired,
  handleBookClick: PropTypes.func
}