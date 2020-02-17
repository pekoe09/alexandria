import React, { useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  StyledButton,
  StyledTable
} from '../common/alexandriaComponents'
import '../common/alexandria-react-table.css'
import {
  updateBook
} from '../../actions/bookActions'
import ViewBar from '../common/ViewBar'
import PublisherEdit from './PublisherEdit'
import BookEdit from '../books/BookEdit'
// import DeletionConfirmation from '../common/DeletionConfirmation'

function PublisherList(props) {
  const [editModalIsOpen, setEditModalIsOpen] = useState(false)
  const [rowToEdit, setRowToEdit] = useState(null)
  const [relatedBooks, setRelatedBooks] = useState([])
  const [bookToEdit, setBookToEdit] = useState(null)
  const [bookModalIsOpen, setBookModalIsOpen] = useState(false)
  // const [deletionTargetId, setDeletionTargetId] = useState('')
  // const [deletionTargetName, setDeletionTargetName] = useState('')
  // const [deletionConfirmationIsOpen, setDeletionConfirmationIsOpen] = useState(false)
  const [searchPhrase, setSearchPhrase] = useState('')
  const [searchPhraseToUse, setSearchPhraseToUse] = useState('')

  const toggleEditModalOpen = () => {
    props.showError('')
    setEditModalIsOpen(!editModalIsOpen)
    setRowToEdit(null)
  }

  const toggleBookModalOpen = () => {
    props.showError('')
    setBookModalIsOpen(!bookModalIsOpen)
    setBookToEdit(null)
  }

  // withBookLinks
  const handleBookSave = async (book) => {
    await props.updateBook(book)
    if (props.error) {
      props.showError('Could not save the book')
    }
  }

  // withListTable
  const handleRowClick = (row) => {
    setEditModalIsOpen(true)
    setRowToEdit(row.original)
    setRelatedBooks(getRelatedBooks(row.original._id))
    props.showError('')
  }

  // withBookLinks
  const handleBookClick = (bookId) => {
    setBookToEdit(relatedBooks.find(b => b._id === bookId))
    setBookModalIsOpen(true)
    props.showError('')
  }

  // withListTable
  /*   const handleDeleteRequest = (item, e) => {
      e.stopPropagation()
      setDeletionTargetId(item._id)
      setDeletionTargetName(item.name)
      setDeletionConfirmationIsOpen(true)
    } */

  // withListTable
  /*   const handleDeleteConfirmation = async (isConfirmed) => {
      if (isConfirmed) {
        await props.handleDelete(deletionTargetId)
      }
      setDeletionConfirmationIsOpen(false)
      setDeletionTargetId('')
      setDeletionTargetName('')
    } */

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
    let filtered = props.items
    if (searchPhraseToUse.length > 0) {
      filtered = props.items.filter(p =>
        p.name.toLowerCase().includes(searchPhrase)
      )
    }
    return filtered
  }, [props.items, searchPhraseToUse])

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
            onClick={(e) => props.handleDeleteRequest(item.row.original, e)}
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
        handleSave={props.handleSave}
        relatedBooks={relatedBooks}
        handleBookClick={handleBookClick}
        modalError={props.modalError}
      />
      <BookEdit
        book={bookToEdit}
        modalIsOpen={bookModalIsOpen}
        closeModal={toggleBookModalOpen}
        handleSave={handleBookSave}
        modalError={props.modalError}
      />
    </React.Fragment>
  )

}

const mapStateToProps = store => ({
  books: store.books.items,
  loading: store.publishers.loading,
  error: store.publishers.error
})

export default withRouter(connect(
  mapStateToProps,
  {
    updateBook
  }
)(PublisherList))

PublisherList.propTypes = {
  handleDeleteRequest: PropTypes.func.isRequired
}