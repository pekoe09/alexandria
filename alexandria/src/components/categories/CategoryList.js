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
import ViewBar from '../common/ViewBar'
import CategoryEdit from './CategoryEdit'
import DeletionConfirmation from '../common/DeletionConfirmation'

function CategoryList(props) {
  const [editModalIsOpen, setEditModalIsOpen] = useState(false)
  const [rowToEdit, setRowToEdit] = useState(null)
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

  const handleRowClick = (row) => {
    setEditModalIsOpen(true)
    setRowToEdit(row.original)
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
  loading: store.categories.loading,
  error: store.categories.error
})

export default withRouter(connect(
  mapStateToProps,
  {
    getAllCategories,
    addCategory,
    updateCategory,
    deleteCategory
  }
)(CategoryList))