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

class PublisherList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openEditModal: false,
      rowToEdit: null,
      modalError: ''
    }
  }

  componentDidMount = async () => {
    await this.props.getAllPublishers()
  }

  toggleEditModalOpen = () => {
    this.setState({
      modalError: '',
      openEditModal: !this.state.openEditModal,
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
          openEditModal: true,
          rowToEdit: rowInfo.original,
          modalError: ''
        })
      }
    }
  }

  handleDelete = (row, e) => {
    e.stopPropagation()
  }

  handleDeleteConfirmation = async (isConfirmed) => {

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
          onClick={(e) => this.handleDelete(row.original, e)}
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
          modalIsOpen={this.state.openEditModal}
          closeModal={this.toggleEditModalOpen}
          handleSave={this.handleSave}
          modalError={this.state.modalError}
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