import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  StyledButton,
  StyledTable
} from '../common/alexandriaComponents'
import '../common/alexandria-react-table.css'
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory
} from '../../actions/categoryActions'
import {
  updateBook
} from '../../actions/bookActions'
import ViewBar from '../common/ViewBar'
import CategoryEdit from './CategoryEdit'
import BookEdit from '../books/BookEdit'
import DeletionConfirmation from '../common/DeletionConfirmation'

function CategoryList(props) {
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
      await props.getAllCategories()
    })()
  }, [])

  const toggleEditModalOpen = () => {
    setModalError('')
    setEditModalIsOpen(!editModalIsOpen)
    setRowToEdit(null)
    setRelatedBooks([])
  }

  const toggleBookModalOpen = () => {
    setModalError('')
    setBookModalIsOpen(!bookModalIsOpen)
    setBookToEdit(null)
  }

  const handleSave = async (category) => {
    if (category._id) {
      await props.updateCategory(category)
    } else {
      await props.addCategory(category)
    }
    if (props.error) {
      setModalError('Could not save the category')
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
      await props.deleteCategory(deletionTargetId)
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

  const getRelatedBooks = (categoryId) => {
    return props.books.filter(b => b.categories.find(c => c._id === categoryId))
  }

  const getFilteredCategories = useCallback(() => {
    let searchPhrase = searchPhraseToUse.toLowerCase()
    let filtered = props.categories
    if (searchPhraseToUse.length > 0) {
      filtered = props.categories.filter(c =>
        c.name.toLowerCase().includes(searchPhrase)
      )
    }
    return filtered
  }, [props.categories, searchPhraseToUse])

  const getData = React.useMemo(() => getFilteredCategories(), [getFilteredCategories])

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
        Header: 'Level',
        accessor: 'level',
        style: {
          textAlign: 'center'
        }
      },
      {
        Header: 'Code',
        accessor: 'code',
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
        headerText='Categories'
        addBtnText='Add category'
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
      <CategoryEdit
        category={rowToEdit}
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
  categories: store.categories.items.sort((a, b) => a.code > b.code ? 1 : (a.code < b.code ? -1 : 0)),
  books: store.books.items,
  loading: store.categories.loading,
  error: store.categories.error
})

export default withRouter(connect(
  mapStateToProps,
  {
    getAllCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    updateBook
  }
)(CategoryList))