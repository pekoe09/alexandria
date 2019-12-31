import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { useTable } from 'react-table'
import {
  ListTable,
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
import { func } from 'prop-types'

function AuthorList(props) {
  const [editModalIsOpen, setEditModalIsOpen] = useState(false)
  const [rowToEdit, setRowToEdit] = useState(null)
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

  const handleRowClick = (state, rowInfo) => {
    return {
      onClick: (e) => {
        setEditModalIsOpen(true)
        setRowToEdit(rowInfo.original)
        setModalError('')
      }
    }
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

  // Tätä funktiota pitää kutsua React.useMemo()-kutsun kautta, riippuvaisuuksina this.props.authors ja this.state.searchPhraseToUse(?)
  const getFilteredAuthors = () => {
    let searchPhrase = searchPhraseToUse.toLowerCase()
    let filtered = props.authors
    if (searchPhraseToUse.length > 0) {
      filtered = props.authors.filter(a =>
        a.fullName.toLowerCase().includes(searchPhrase) || a.fullNameReversed.includes(searchPhrase))
    }
    return filtered
  }

  const getData = React.useMemo(() => getFilteredAuthors(), [])

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

        style: {
          textAlign: 'center'
        }
      },
      {
        Header: '',
        accessor: 'delete',
        Cell: (row) => (
          <StyledButton
            onClick={(e) => handleDeleteRequest(row.original, e)}
            bsstyle='rowdanger'
          >
            Delete
        </StyledButton>
        ),
        style: {
          textAlign: 'center'
        },
        sortable: false,
        filterable: false,
        maxWidth: 80
      }
    ]
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
      <ListTable
        data={getData}
        columns={columns}
        getTrProps={handleRowClick}
        defaultPageSize={20}
        minRows={1}
      />
      <StyledTable
        columns={columns}
        data={getData}
      />
      <AuthorEdit
        author={rowToEdit}
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
  authors: store.authors.items.sort((a, b) =>
    a.fullNameReversed > b.fullNameReversed ? 1 : (a.fullNameReversed < b.fullNameReversed ? -1 : 0)),
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