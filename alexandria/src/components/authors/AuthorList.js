import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  ListTable,
  StyledButton
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

class AuthorList extends React.Component {
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

  getFilteredAuthors = () => {
    let searchPhrase = this.state.searchPhraseToUse.toLowerCase()
    let filtered = this.props.authors
    if (this.state.searchPhraseToUse.length > 0) {
      filtered = this.props.authors.filter(a =>
        a.fullName.toLowerCase().includes(searchPhrase) || a.fullNameReversed.includes(searchPhrase))
    }
    return filtered
  }

  columns = [
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
      Cell: (row) => (
        row.original.books.length
      ),
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
          headerText='Authors'
          addBtnText='Add author'
          handleOpenEdit={this.toggleEditModalOpen}
          handlePhraseChange={this.handlePhraseChange}
          handleSearch={this.handleSearch}
          searchPhrase={this.state.searchPhrase}
        />
        <ListTable
          data={this.getFilteredAuthors()}
          columns={this.columns}
          getTrProps={this.handleRowClick}
          defaultPageSize={20}
          minRows={1}
        />
        <AuthorEdit
          author={this.state.rowToEdit}
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