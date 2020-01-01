import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  StyledButton,
  StyledTable
} from '../common/alexandriaComponents'
import '../common/alexandria-react-table.css'
import {
  getAllLocations,
  addLocation,
  updateLocation,
  deleteLocation
} from '../../actions/locationActions'
import ViewBar from '../common/ViewBar'
import LocationEdit from './LocationEdit'
import DeletionConfirmation from '../common/DeletionConfirmation'

function LocationList(props) {
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
      await props.getAllLocations()
    })()
  }, [])

  const toggleEditModalOpen = () => {
    setModalError('')
    setEditModalIsOpen(!editModalIsOpen)
    setRowToEdit(null)
  }

  const handleSave = async (location) => {
    if (location._id) {
      await props.updateLocation(location)
    } else {
      await props.addLocation(location)
    }
    if (props.error) {
      setModalError('Could not save the location')
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
      await props.deleteLocation(deletionTargetId)
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

  const getFilteredLocations = useCallback(() => {
    let searchPhrase = searchPhraseToUse.toLowerCase()
    let filtered = props.locations
    if (searchPhraseToUse.length > 0) {
      filtered = props.locations.filter(l =>
        l.fullName.toLowerCase().includes(searchPhrase)
      )
    }
    return filtered
  },[props.locations, searchPhraseToUse])

  const getData = React.useMemo(() => getFilteredLocations(), [getFilteredLocations])

  const columns = React.useMemo(
    () => [
      {
        Header: 'Room',
        accessor: 'room',
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: 'Shelving',
        accessor: 'shelving',
        style: {
          textAlign: 'center'
        }
      },
      {
        Header: 'Shelf',
        accessor: 'shelf',
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
        headerText='Locations'
        addBtnText='Add location'
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
      <LocationEdit
        location={rowToEdit}
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
  locations: store.locations.items,
  loading: store.locations.loading,
  error: store.locations.error
})

export default withRouter(connect(
  mapStateToProps,
  {
    getAllLocations,
    addLocation,
    updateLocation,
    deleteLocation
  }
)(LocationList))