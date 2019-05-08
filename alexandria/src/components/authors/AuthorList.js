import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  ListTable,
  StyledButton,
  ViewHeader
} from '../common/alexandriaComponents'
import '../common/alexandria-react-table.css'
import {
  getAllAuthors,
  addAuthor,
  updateAuthor,
  deleteAuthor
} from '../../actions/authorActions'
import DeletionConfirmation from '../common/DeletionConfirmation'

class AuthorList extends React.Component {
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
    await this.props.getAllAuthors()
  }

  toggleEditModalOpen = () => {
    this.setState({
      modalError: '',
      editModalIsOpen: !this.state.editModalIsOpen,
      rowToEdit: null
    })
  }

  handleSave = async (author) => {
    if (author._id) {
      await this.props.updateAuthor(author)
    } else {
      await this.props.addAuthor(author)
    }
    if (this.props.error) {
      this.setState({ modalError: 'Could not save the author' })
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
      deletionTargetName: `${item.lastName}, ${item.firstNames}`,
      deletionConfirmationIsOpen: true
    })
  }

  handleDeleteConfirmation = async (isConfirmed) => {
    if (isConfirmed) {
      await this.props.deleteAuthor(this.state.deletionTargetId)
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
      accessor: 'fullName'
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
        <ViewHeader text='Authors' />
        <StyledButton
          bsstyle='primary'
          onClick={this.toggleEditModalOpen}
          style={{ marginLeft: 10 }}
        >
          Add author
        </StyledButton>
        <ListTable
          data={this.props.authors}
          columns={this.columns}
          getTrProps={this.handleRowClick}
          defaultPageSize={20}
          minRows={1}
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
  authors: store.authors.items,
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