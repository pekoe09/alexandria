import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  ListTable,
  StyledButton
} from '../common/alexandriaComponents'
import '../common/alexandria-react-table.css'
import {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook
} from '../../actions/bookActions'
import ViewBar from '../common/ViewBar'
import AdvancedBookSearch from './AdvancedBookSearch'
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
      deletionConfirmationIsOpen: false,
      searchPhrase: '',
      searchPhraseToUse: '',
      advancedSearchIsVisible: false,
      searchCriteria: null
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

  handleCriteriaSearch = criteria => {
    this.setState({ searchCriteria: criteria })
    this.toggleAdvancedSearch()
  }

  toggleAdvancedSearch = () => {
    this.setState({ advancedSearchIsVisible: !this.state.advancedSearchIsVisible })
  }

  getSearchCriteriaString = () => {
    return ''
  }

  getFilteredBooks = () => {
    let searchPhrase = this.state.searchPhraseToUse.toLowerCase()
    let filtered = this.props.books
    if (this.state.searchPhraseToUse.length > 0) {
      filtered = this.props.books.filter(b =>
        b.title.toLowerCase().includes(searchPhrase)
        || b.authors.some(a =>
          a.fullName.toLowerCase().includes(searchPhrase) || a.fullNameReversed.toLowerCase().includes(searchPhrase))
        || b.categories.some(c => c.name.toLowerCase().includes(searchPhrase))
      )
    }
    return filtered
  }

  columns = [
    {
      Header: 'Title',
      accessor: 'title',
      headerStyle: {
        textAlign: 'left'
      },
    },
    {
      Header: 'Authors',
      accessor: 'authorsString',
      headerStyle: {
        textAlign: 'left'
      },
    },
    {
      Header: 'Categories',
      accessor: 'categoriesString',
      headerStyle: {
        textAlign: 'left'
      },
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
          headerText='Books'
          addBtnText='Add book'
          handleOpenEdit={this.toggleEditModalOpen}
          handlePhraseChange={this.handlePhraseChange}
          handleSearch={this.handleSearch}
          searchPhrase={this.state.searchPhrase}
          toggleAdvancedSearch={this.toggleAdvancedSearch}
        />
        <div>
          {this.state.searchCriteria ? this.getSearchCriteriaString() : ''}
        </div>
        <ListTable
          data={this.getFilteredBooks()}
          columns={this.columns}
          getTrProps={this.handleRowClick}
          defaultPageSize={20}
          minRows={1}
        />

        <AdvancedBookSearch
          modalIsOpen={this.state.advancedSearchIsVisible}
          handleSearch={this.handleCriteriaSearch}
          closeModal={this.toggleAdvancedSearch}
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