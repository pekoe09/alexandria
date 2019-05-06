import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  ListTable,
  ViewHeader
} from '../common/alexandriaComponents'
import '../common/alexandria-react-table.css'
import {
  getAllPublishers,
  addPublisher,
  updatePublisher,
  deletePublisher
} from '../../actions/publisherActions'
import { StyledButton } from '../common/alexandriaComponents';
import PublisherEdit from './PublisherEdit'
import DeletionConfirmation from '../common/DeletionConfirmation'

class PublisherList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editModalIsOpen: false,
      rowToEdit: null,
      modalError: '',
      deletionTargetId: '',
      deletionTargetName: '',
      deletionConfirmationIsOpen: false
    }
  }

  componentDidMount = async () => {
    await this.props.getAllPublishers()
  }

  toggleEditModalOpen = () => {
    this.setState({
      modalError: '',
      editModalIsOpen: !this.state.editModalIsOpen,
      rowToEdit: null
    })
  }

  handleSave = async (publisher) => {
    console.log('Saving', publisher)
    if (publisher._id) {
      await this.props.updatePublisher(publisher)
    } else {
      await this.props.addPublisher(publisher)
    }
    if (this.props.error) {
      this.setState({ modalError: 'Could not save the publisher' })
    }
  }

  handleRowClick = (state, rowInfo) => {
    return {
      onClick: (e) => {
        console.log('Row clicked', rowInfo)
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
      await this.props.deletePublisher(this.state.deletionTargetId)
    }
    this.setState({
      deletionConfirmationIsOpen: false,
      deletionTargetId: '',
      deletionTargetName: ''
    })
  }

  columns = [
    {
      Header: 'Name',
      accessor: 'name'
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
        <ViewHeader text='Publishers' />
        <StyledButton
          bsstyle='primary'
          onClick={this.toggleEditModalOpen}
          style={{ marginLeft: 10 }}
        >
          Add publisher
        </StyledButton>
        <ListTable
          data={this.props.publishers}
          columns={this.columns}
          getTrProps={this.handleRowClick}
          defaultPageSize={20}
          minRows={1}
        />
        <PublisherEdit
          publisher={this.state.rowToEdit}
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
  publishers: store.publishers.items,
  loading: store.publishers.loading,
  error: store.publishers.error
})

export default withRouter(connect(
  mapStateToProps,
  {
    getAllPublishers,
    addPublisher,
    updatePublisher,
    deletePublisher
  }
)(PublisherList))