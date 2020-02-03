import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  StyledButton,
  StyledTable
} from '../common/alexandriaComponents'
import '../common/alexandria-react-table.css'
import {
  getAllPublishers,
  addPublisher,
  updatePublisher,
  deletePublisher
} from '../../actions/publisherActions'
import {
  updateBook
} from '../../actions/bookActions'
import ViewBar from '../common/ViewBar'
import PublisherEdit from './PublisherEdit'
import BookEdit from '../books/BookEdit'
import DeletionConfirmation from '../common/DeletionConfirmation'

function PublisherList(props) {
  const [editModalIsOpen, setEditModalIsOpen] = useState(false)
  const [rowToEdit, setRowToEdit] = useState(null)
  const [relatedBooks, setRelatedBooks] = useState([])
  const [bookToEdit, setBookToEdit] = useState(null)
  const [bookModalIsOpen, setBookModalIsOpen] = useState(false)
  const [modalError, setModalError] = useState('')
  const [deletionTargetId, setDeletionTargetId] = useState('')
  const [deletionTargetName, setDeletionTargetName] = useState('')
  const [deletionConfirmationIsOpen, setDeletionConfirmationIsOpen] = useState(false)
  const [searchPhrase, setSearchPhrase] = useState('')
  const [searchPhraseToUse, setSearchPhraseToUse] = useState('')

  useEffect(() => {
    (async function getData() {
      await props.getAllPublishers()
    })()
  }, [])

  const toggleEditModalOpen = () => {
    setModalError('')
    setEditModalIsOpen(!editModalIsOpen)
    setRowToEdit(null)
  }

  const toggleBookModalOpen = () => {
    setModalError('')
    setBookModalIsOpen(!bookModalIsOpen)
    setBookToEdit(null)
  }

  const handleSave = async (publisher) => {
    if (publisher._id) {
      await props.updatePublisher(publisher)
    } else {
      await props.addPublisher(publisher)
    }
    if (props.error) {
      setModalError('Could not save the publisher')
    }
  }

  const handleBookSave = async (book) => {
    await props.updateBook(book)
    if (props.error) {
      setModalError('Could not save the book')
    }
  }

  const handleRowClick = (row) => {
    setEditModalIsOpen(true)
    setRowToEdit(row.original)
    setRelatedBooks(getRelatedBooks(row.original._id))
    setModalError('')
  }

  const handleBookClick = (bookId) => {
    setBookToEdit(relatedBooks.find(b => b._id === bookId))
    setBookModalIsOpen(true)
    setModalError('')
  }

  const handleDeleteRequest = (item, e) => {
    e.stopPropagation()
    setDeletionTargetId(item._id)
    setDeletionTargetName(item.name)
    setDeletionConfirmationIsOpen(true)
  }

  const handleDeleteConfirmation = async (isConfirmed) => {
    if (isConfirmed) {
      await props.deletePublisher(deletionTargetId)
    }
    setDeletionConfirmationIsOpen(false)
    setDeletionTargetId('')
    setDeletionTargetName('')
  }

  const handlePhraseChange = searchPhraseEvent => {
    let searchPhrase = searchPhraseEvent.target.value
    if (searchPhrase.trim().length > 0) {
      setSearchPhrase(searchPhrase)
    } else {
      setSearchPhrase('')
    }
  }

  const handleSearch = () => {
    setSearchPhraseToUse(searchPhrase)
  }

  const getRelatedBooks = (publisherId) => {
    return props.books.filter(b => b.publisher && b.publisher._id === publisherId)
  }

  const getFilteredPublishers = useCallback(() => {
    let searchPhrase = searchPhraseToUse.toLowerCase()
    let filtered = props.publishers
    if (searchPhraseToUse.length > 0) {
      filtered = props.publishers.filter(p =>
        p.name.toLowerCase().includes(searchPhrase)
      )
    }
    return filtered
  }, [props.publishers, searchPhraseToUse])

  const getData = React.useMemo(() => getFilteredPublishers(), [getFilteredPublishers])

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: '',
        accessor: 'delete',
        Cell: (item) => (
          <StyledButton
            onClick={(e) => handleDeleteRequest(item.row.original, e)}
            bsstyle='rowdanger'
          >
            Delete
          </StyledButton>
        ),
        style: {
          textAlign: 'center'
        },
        disableSortBy: false,
        filterable: false,
        maxWidth: 80
      }
    ],
    []
  )

  return (
    <React.Fragment>
      <ViewBar
        headerText='Publishers'
        addBtnText='Add publisher'
        handleOpenEdit={toggleEditModalOpen}
        handlePhraseChange={handlePhraseChange}
        handleSearch={handleSearch}
        searchPhrase={searchPhrase}
      />
      <StyledTable
        columns={columns}
        data={getData}
        handleRowClick={handleRowClick}
      />
      <PublisherEdit
        publisher={rowToEdit}
        modalIsOpen={editModalIsOpen}
        closeModal={toggleEditModalOpen}
        handleSave={handleSave}
        relatedBooks={relatedBooks}
        handleBookClick={handleBookClick}
        modalError={modalError}
      />
      <BookEdit
        book={bookToEdit}
        modalIsOpen={bookModalIsOpen}
        closeModal={toggleBookModalOpen}
        handleSave={handleBookSave}
        modalError={modalError}
      />
      <DeletionConfirmation
        headerText={`Deleting ${deletionTargetName}`}
        bodyText='Are you sure you want to go ahead and delete this?'
        modalIsOpen={deletionConfirmationIsOpen}
        closeModal={handleDeleteConfirmation}
      />
    </React.Fragment>
  )

}

const mapStateToProps = store => ({
  publishers: store.publishers.items.sort((a, b) => a.name > b.name ? 1 : (a.name < b.name ? -1 : 0)),
  books: store.books.items,
  loading: store.publishers.loading,
  error: store.publishers.error
})

export default withRouter(connect(
  mapStateToProps,
  {
    getAllPublishers,
    addPublisher,
    updatePublisher,
    deletePublisher,
    updateBook
  }
)(PublisherList))