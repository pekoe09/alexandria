import React, { useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  StyledButton,
  StyledTable
} from '../common/alexandriaComponents'
import '../common/alexandria-react-table.css'
import {
  updateBook
} from '../../actions/bookActions'
import ViewBar from '../common/ViewBar'
import AuthorEdit from './AuthorEdit'
import BookEdit from '../books/BookEdit'
import DeletionConfirmation from '../common/DeletionConfirmation'

function AuthorList(props) {
  const [editModalIsOpen, setEditModalIsOpen] = useState(false)
  const [modalViewType, setModalViewType] = useState('Create')
  const [rowToEdit, setRowToEdit] = useState(null)
  const [relatedBooks, setRelatedBooks] = useState([])
  const [bookToEdit, setBookToEdit] = useState(null)
  const [bookModalIsOpen, setBookModalIsOpen] = useState(false)
  const [deletionTargetId, setDeletionTargetId] = useState('')
  const [deletionTargetName, setDeletionTargetName] = useState('')
  const [deletionConfirmationIsOpen, setDeletionConfirmationIsOpen] = useState(false)
  const [searchPhrase, setSearchPhrase] = useState('')
  const [searchPhraseToUse, setSearchPhraseToUse] = useState('')

  const toggleEditModalOpen = (viewType) => {
    props.showError('')
    if (viewType) {
      setModalViewType(viewType)
    } else {
      setModalViewType('Create')
    }
    setEditModalIsOpen(!editModalIsOpen)
    setRowToEdit(null)
    setRelatedBooks([])
  }

  const toggleBookModalOpen = () => {
    props.showError('')
    setBookModalIsOpen(!bookModalIsOpen)
    setBookToEdit(null)
  }

  const handleBookSave = async (book) => {
    await props.updateBook(book)
    if (props.error) {
      props.showError('Could not save the book')
    }
  }

  const handleRowClick = (row) => {
    setModalViewType('View')
    setEditModalIsOpen(true)
    setRowToEdit(row.original)
    setRelatedBooks(getRelatedBooks(row.original._id))
    props.showError('')
  }

  const handleBookClick = (bookId) => {
    setBookToEdit(relatedBooks.find(b => b._id === bookId))
    setBookModalIsOpen(true)
    props.showError('')
  }

  const handleDeleteRequest = (item, e) => {
    e.stopPropagation()
    setDeletionTargetId(item._id)
    setDeletionTargetName(`${item.lastName}, ${item.firstNames}`)
    setDeletionConfirmationIsOpen(true)
  }

  const handleDeleteConfirmation = async (isConfirmed) => {
    if (isConfirmed) {
      await props.handleDelete(deletionTargetId)
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

  const getRelatedBooks = (authorId) => {
    return props.books.filter(b => b.authors.find(a => a._id === authorId))
  }

  const getFilteredAuthors = useCallback(() => {
    let searchPhrase = searchPhraseToUse.toLowerCase()
    let filtered = props.items
    if (searchPhraseToUse.length > 0) {
      filtered = props.items.filter(a =>
        a.fullName.toLowerCase().includes(searchPhrase) || a.fullNameReversed.includes(searchPhrase))
    }
    return filtered
  }, [props.items, searchPhraseToUse])

  const getData = React.useMemo(() => getFilteredAuthors(), [getFilteredAuthors])

  // sarakemäärittely (columns) tapahduttava React.useMemo() -kutsun kautta
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'fullNameReversed',
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: '# of books',
        accessor: '',
        Cell: (item) => (
          item.row.original.books.length
        ),
        style: {
          textAlign: 'center'
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
        disableSortBy: true,
        filterable: false,
        maxWidth: 80
      }
    ],
    []
  )

  return (
    <React.Fragment>
      <ViewBar
        headerText='Authors'
        addBtnText='Add author'
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
      <AuthorEdit
        viewType={modalViewType}
        author={rowToEdit}
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
  books: store.books.items,
  loading: store.authors.loading,
  error: store.authors.error
})

export default withRouter(connect(
  mapStateToProps,
  {
    updateBook
  }
)(AuthorList))