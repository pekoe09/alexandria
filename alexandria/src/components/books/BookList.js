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
  getAllBooks,
  addBook,
  updateBook,
  deleteBook
} from '../../actions/bookActions'
import BookEdit from './BookEdit'
import DeletionConfirmation from '../common/DeletionConfirmation'

class BookList extends React.Component {
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
    await this.props.getAllBooks()
  }

  toggleEditModalOpen = () => {
    this.setState({
      modalError: '',
      editModalIsOpen: !this.state.editModalIsOpen,
      rowToEdit: null
    })
  }

  handleSave = async (book) => {
    if (book._id) {
      await this.props.updateBook(book)
    } else {
      await this.props.addBook(book)
    }
    if (this.props.error) {
      this.setState({ modalError: 'Could not save the book' })
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
      await this.props.deleteBook(this.state.deletionTargetId)
    }
    this.setState({
      deletionConfirmationIsOpen: false,
      deletionTargetId: '',
      deletionTargetName: ''
    })
  }

  columns = [
    {
      Header: 'Title',
      accessor: 'title'
    },
    {
      Header: 'Authors',
      accessor: 'authorsString'
    },
    {
      Header: 'Categories',
      accessor: 'categoriesString'
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
        <ViewHeader text='Books' />
        <StyledButton
          bsstyle='primary'
          onClick={this.toggleEditModalOpen}
          style={{ marginLeft: 10 }}
        >
          Add book
        </StyledButton>
        <ListTable
          data={this.props.books}
          columns={this.columns}
          getTrProps={this.handleRowClick}
          defaultPageSize={20}
          minRows={1}
        />
        <BookEdit
          book={this.state.rowToEdit}
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
  books: store.books.items,
  loading: store.books.loading,
  error: store.books.error
})

export default withRouter(connect(
  mapStateToProps,
  {
    getAllBooks,
    addBook,
    updateBook,
    deleteBook
  }
)(BookList))