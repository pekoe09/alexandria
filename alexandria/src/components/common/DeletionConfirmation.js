import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'
import { StyledButton } from './alexandriaComponents'

const DeletionConfirmation = ({
  headerText,
  bodyText,
  modalIsOpen,
  closeModal
}) => {

  const handleClose = (isConfirmed) => {
    closeModal(isConfirmed)
  }

  return (
    <Modal
      show={modalIsOpen}
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>{headerText}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {bodyText}
      </Modal.Body>
      <Modal.Footer>
        <StyledButton
          bsstyle='primary'
          onClick={() => handleClose(true)}
        >
          Yes, delete.
        </StyledButton>
        <StyledButton
          bsstyle='primary'
          onClick={() => handleClose(false)}
        >
          No, cancel!
        </StyledButton>
      </Modal.Footer>
    </Modal>
  )
}

export default DeletionConfirmation

DeletionConfirmation.propTypes = {
  headerText: PropTypes.string,
  bodyText: PropTypes.string,
  modalIsOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired
}