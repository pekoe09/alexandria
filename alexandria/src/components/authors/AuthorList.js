import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  StyledButton,
  StyledTable
} from '../common/alexandriaComponents'
import '../common/alexandria-react-table.css'
import {
  getAllAuthors,
  addAuthor,
  updateAuthor,
  deleteAuthor
} from '../../actions/authorActions'
import ViewBar from '../common/ViewBar'
import AuthorEdit from './AuthorEdit'
import DeletionConfirmation from '../common/DeletionConfirmation'

function AuthorList(props) {
  const [editModalIsOpen, setEditModalIsOpen] = useState(false)
  const [rowToEdit, setRowToEdit] = useState(null)
  const [relatedBooks, setRelatedBooks] = useState([])
  const [modalError, setModalError] = useState('')
  const [deletionTargetId, setDeletionTargetId] = useState('')
  const [deletionTargetName, setDeletionTargetName] = useState('')
  const [deletionConfirmationIsOpen, setDeletionConfirmationIsOpen] = useState(false)
  const [searchPhrase, setSearchPhrase] = useState('')
  const [searchPhraseToUse, setSearchPhraseToUse] = useState('')

  // get the initial data
  useEffect(() => {
    (async function getData() {
      await props.getAllAuthors()
    })()
  }, [])

  const toggleEditModalOpen = () => {
    setModalError('')
    setEditModalIsOpen(!editModalIsOpen)
    setRowToEdit(null)
    setRelatedBooks([])
  }

  const handleSave = async (author) => {
    if (author._id) {
      await props.updateAuthor(author)
    } else {
      await props.addAuthor(author)
    }
    if (props.error) {
      setModalError('Could not save the author')
    }
  }

  const handleRowClick = (row) => {
    setEditModalIsOpen(true)
    setRowToEdit(row.original)
    setRelatedBooks(getRelatedBooks(row.original._id))
    setModalError('')
  }

  const handleBookClick = (bookId) => {
    console.log('book', bookId, 'clicked')
  }

  const handleDeleteRequest = (item, e) => {
    e.stopPropagation()
    setDeletionTargetId(item._id)
    setDeletionTargetName(`${item.lastName}, ${item.firstNames}`)
    setDeletionConfirmationIsOpen(true)
  }

  const handleDeleteConfirmation = async (isConfirmed) => {
    if (isConfirmed) {
      await props.deleteAuthor(deletionTargetId)
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
    let filtered = props.authors
    if (searchPhraseToUse.length > 0) {
      filtered = props.authors.filter(a =>
        a.fullName.toLowerCase().includes(searchPhrase) || a.fullNameReversed.includes(searchPhrase))
    }
    return filtered
  }, [props.authors, searchPhraseToUse])

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
        author={rowToEdit}
        modalIsOpen={editModalIsOpen}
        closeModal={toggleEditModalOpen}
        handleSave={handleSave}
        relatedBooks={relatedBooks}
        handleBookClick={handleBookClick}
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
  authors: store.authors.items.sort((a, b) =>
    a.fullNameReversed > b.fullNameReversed ? 1 : (a.fullNameReversed < b.fullNameReversed ? -1 : 0)),
  books: store.books.items,
  loading: store.authors.loading,
  error: store.authors.error
})

export default withRouter(connect(
  mapStateToProps,
  {
    getAllAuthors,
    addAuthor,
    updateAuthor,
    deleteAuthor
  }
)(AuthorList))