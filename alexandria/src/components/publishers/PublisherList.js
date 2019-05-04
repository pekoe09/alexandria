import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  ListTable,
  StyledButton,
  ViewHeader
} from '../common/alexandriaComponents'
import {
  getAllPublishers,
  addPublisher,
  updatePublisher,
  deletePublisher
} from '../../actions/publisherActions'
import { Button } from 'react-bootstrap';

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
      openEditModal: !this.state.openEditModal
    })
  }

  handleSave = async (publisher) => {

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
        <Button
          onClick={(e) => this.handleDelete(row.original, e)}
          bsStyle='danger'
        >
          Delete
        </Button>
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
      <div>
        <ViewHeader text='Publishers' />
        <Button
          bsStyle='primary'
          onClick={this.toggleEditModalOpen}
        >
          Add publisher
        </Button>
        <ListTable
          data={this.props.publishers}
          columns={this.columns}
          getTrProps={this.handleRowClick}
          defaultPageSize={20}
          minRows={1}
        />
      </div>
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