import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  ListTable,
  ViewHeader,
  StyledButton
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

class LocationList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editModalIsOpen: false,
      rowToEdit: null,
      modalError: '',
      deletionTargetId: '',
      deletionTargetName: '',
      deletionConfirmationIsOpen: false,
      searchPhrase: '',
      searchPhraseToUse: ''
    }
  }

  componentDidMount = async () => {
    await this.props.getAllLocations()
  }

  toggleEditModalOpen = () => {
    this.setState({
      modalError: '',
      editModalIsOpen: !this.state.editModalIsOpen,
      rowToEdit: null
    })
  }

  handleSave = async (location) => {
    if (location._id) {
      await this.props.updateLocation(location)
    } else {
      await this.props.addLocation(location)
    }
    if (this.props.error) {
      this.setState({ modalError: 'Could not save the location' })
    }
  }

  handleRowClick = (state, rowInfo) => {
    return {
      onClick: (e) => {
        this.setState({
          editModalIsOpen: true,
          rowToEdit: rowInfo.original,
          modalError: ''
        })
      }
    }
  }

  handleDeleteRequest = (item, e) => {
    e.stopPropagation()
    this.setState({
      deletionTargetId: item._id,
      deletionTargetName: item.name,
      deletionConfirmationIsOpen: true
    })
  }

  handleDeleteConfirmation = async (isConfirmed) => {
    if (isConfirmed) {
      await this.props.deleteLocation(this.state.deletionTargetId)
    }
    this.setState({
      deletionConfirmationIsOpen: false,
      deletionTargetId: '',
      deletionTargetName: ''
    })
  }

  handlePhraseChange = searchPhraseEvent => {
    let searchPhrase = searchPhraseEvent.target.value
    if (searchPhrase.trim().length > 0) {
      this.setState({ searchPhrase })
    } else {
      this.setState({ searchPhrase: '' })
    }
  }

  handleSearch = () => {
    this.setState({ searchPhraseToUse: this.state.searchPhrase })
  }

  getFilteredLocations = () => {
    let searchPhrase = this.state.searchPhraseToUse.toLowerCase()
    let filtered = this.props.locations
    if (this.state.searchPhraseToUse.length > 0) {
      filtered = this.props.locations.filter(l =>
        l.fullName.toLowerCase().includes(searchPhrase)
      )
    }
    return filtered
  }

  columns = [
    {
      Header: 'Room',
      accessor: 'room',
      style: {
        textAlign: 'center'
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
      Cell: (row) => (
        <StyledButton
          onClick={(e) => this.handleDeleteRequest(row.original, e)}
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

  render() {
    return (
      <React.Fragment>
        <ViewBar
          headerText='Locations'
          addBtnText='Add location'
          handleOpenEdit={this.toggleEditModalOpen}
          handlePhraseChange={this.handlePhraseChange}
          handleSearch={this.handleSearch}
          searchPhrase={this.state.searchPhrase}
        />
        <ListTable
          data={this.getFilteredLocations()}
          columns={this.columns}
          getTrProps={this.handleRowClick}
          defaultPageSize={20}
          minRows={1}
        />
        <LocationEdit
          location={this.state.rowToEdit}
          modalIsOpen={this.state.editModalIsOpen}
          closeModal={this.toggleEditModalOpen}
          handleSave={this.handleSave}
          modalError={this.state.modalError}
        />
        <DeletionConfirmation
          headerText={`Deleting ${this.state.deletionTargetName}`}
          bodyText='Are you sure you want to go ahead and delete this?'
          modalIsOpen={this.state.deletionConfirmationIsOpen}
          closeModal={this.handleDeleteConfirmation}
        />
      </React.Fragment>
    )
  }
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