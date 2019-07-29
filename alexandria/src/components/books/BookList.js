import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  ListTable,
  StyledButton,
  StyledForm
} from '../common/alexandriaComponents'
import { Button } from 'react-bootstrap'
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
import GraphView from '../graphs/GraphView'
import BookCountByCategoryPie from './BookCountByCategoryPie'
import BookCountByStatusPie from './BookCountByStatusPie'
import { bookStats } from './bookStats'

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
      searchCriteria: null,
      statsIsVisible: false,
      stats: null
    }
  }

  componentDidMount = async () => {
    await this.props.getAllBooks()
    this.setState({ stats: bookStats(this.props.books, this.props.categories) })
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
    console.log('criteria', criteria)
    this.setState({ searchCriteria: criteria })
    this.toggleAdvancedSearch()
  }

  toggleAdvancedSearch = () => {
    this.setState({ advancedSearchIsVisible: !this.state.advancedSearchIsVisible })
  }

  getSearchCriteriaString = () => {
    let criteriaStr = ''
    if (this.state.searchCriteria) {
      const criteria = this.state.searchCriteria
      criteriaStr = 'Filtered by: '
      if (criteria.title) {
        criteriaStr = `${criteriaStr}Title: "${criteria.title}" `
      }
      if (this.state.searchCriteria.author) {
        criteriaStr = `${criteriaStr}Author: "${criteria.author}" `
      }
      if (criteria.categories.length > 0) {
        criteriaStr = `${criteriaStr}Categories: `
        for (const category of criteria.categories) {
          criteriaStr = `${criteriaStr}${category.code} - ${category.name} `
        }
      }
      if (criteria.includeReadBooks) {
        criteriaStr = `${criteriaStr}read books `
      }
      if (criteria.includeUnfinishedBooks) {
        criteriaStr = `${criteriaStr}unfinished books `
      }
      if (criteria.includeUnreadBooks) {
        criteriaStr = `${criteriaStr}unread books `
      }
      if (criteria.isbn) {
        criteriaStr = `${criteriaStr}ISBN: "${criteria.isbn}" `
      }
      if (criteria.locations.length > 0) {
        criteriaStr = `${criteriaStr}Locations: `
        for (const location of criteria.locations) {
          criteriaStr = `${criteriaStr}${location.fullName} `
        }
      }
      if (criteria.publisher) {
        criteriaStr = `${criteriaStr}Publisher: "${criteria.publisher}" `
      }
      if (criteria.publishingYear) {
        criteriaStr = `${criteriaStr}Publishing year: ${criteria.publishingYear} `
      }
      if (criteria.serialNumber) {
        criteriaStr = `${criteriaStr}Serial number: ${criteria.serialNumber}`
      }
    }
    return criteriaStr
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
    } else if (this.state.searchCriteria) {
      const criteria = this.state.searchCriteria
      if (criteria.title) {
        filtered = filtered.filter(b => b.title.toLowerCase().includes(criteria.title.toLowerCase()))
      }
      if (criteria.author) {
        filtered = filtered.filter(b => {
          for (const author of b.authors) {
            if (author.fullName.toLowerCase().includes(criteria.author.toLowerCase()) ||
              author.fullNameReversed.toLowerCase().includes(criteria.author.toLowerCase())) {
              return true
            }
          }
          return false
        })
      }
      if (criteria.categories.length > 0) {
        filtered = filtered.filter(b => {
          for (const category of criteria.categories) {
            for (const bookCategory of b.categories) {
              if (category._id === bookCategory._id) {
                return true
              }
            }
          }
          return false
        })
      }
      if (!criteria.includeReadBooks) {
        filtered = filtered.filter(b => b.pages !== b.readPages)
      }
      if (!criteria.includeUnfinishedBooks) {
        filtered = filtered.filter(b => !b.readPages || b.pages === b.readPages)
      }
      if (!criteria.includeUnreadBooks) {
        filtered = filtered.filter(b => b.readPages)
      }
      if (criteria.isbn) {
        filtered = filtered.filter(b => b.isbn.includes(criteria.isbn))
      }
      if (criteria.locations.length > 0) {
        filtered = filtered.filter(b => {
          for (const location of criteria.locations) {
            if (location._id === b.location._id) {
              return true
            }
          }
          return false
        })
      }
      if (criteria.publisher) {
        filtered = filtered.filter(b => b.publisher.name.toLowerCase().includes(criteria.publisher.toLowerCase()))
      }
      if (criteria.publishingYear) {
        filtered = filtered.filter(b => b.publishingYear.toString().contains(criteria.publishingYear.toString()))
      }
      if (criteria.serialNumber) {
        filtered = filtered.filter(b => b.serialNumber.toString().contains(criteria.serialNumber.toString()))
      }
    }
    return filtered
  }

  toggleStats = () => {
    this.setState({
      stats: this.state.statsIsVisible ? this.state.stats : bookStats(this.props.books, this.props.categories),
      statsIsVisible: !this.state.statsIsVisible
    })
  }

  getStatsCriteriaForm = () => {
    return (
      <StyledForm></StyledForm>
    )
  }

  getCategoryPie = () => {
    return (
      <BookCountByCategoryPie
        key={1}
        data={this.state.stats.categoryCounts}
      />
    )
  }

  getStatusPie = () => {
    const statuses = []
    if (this.state.stats.unread) {
      statuses.push({ name: 'Not read yet', count: this.state.stats.unread })
    }
    if (this.state.stats.started) {
      statuses.push({ name: 'Part way through', count: this.state.stats.started })
    }
    if (this.state.stats.finished) {
      statuses.push({ name: 'Read', count: this.state.stats.finished })
    }

    return (
      <BookCountByStatusPie
        key={2}
        data={statuses}
      />
    )
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
      Header: 'Pages read',
      accessor: '',
      Cell: (row) => (
        row.original.pages ? parseFloat(row.original.readPages / row.original.pages * 100).toFixed(0) + ' %' : '-'
      ),
      style: {
        textAlign: 'center'
      },
      maxWidth: 120
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
          showStats={this.toggleStats}
        />
        <div style={{ fontFamily: 'sans-serif', color: 'white', marginLeft: 10, marginRight: 10 }}>
          {this.state.searchCriteria ? this.getSearchCriteriaString() : ''}
        </div>
        {this.state.searchCriteria
          && <Button
            variant='link'
            style={{ color: 'white', fontFamily: 'sans-serif', fontSize: '0.9em' }}
            onClick={() => this.setState({ searchCriteria: null })}
          >
            Clear search criteria
          </Button>
        }
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
        <GraphView
          title='Book statistics'
          getCriteriaForm={this.getStatsCriteriaForm}
          getCharts={[
            {
              title: 'Books in main categories',
              call: this.getCategoryPie
            },
            {
              title: 'Books by reading status',
              call: this.getStatusPie
            }
          ]}
          kpis={[
            {
              name: 'Books in total',
              value: this.state.stats ? this.state.stats.count : '-'
            },
            {
              name: 'Pages in total',
              value: this.state.stats ? this.state.stats.pages : '-'
            },
            {
              name: 'of which read',
              value: (this.state.stats && this.state.stats.pages) ?
                parseFloat(this.state.stats.readPages / this.state.stats.pages * 100).toFixed(0) + '%' : '-'
            }
          ]}
          modalIsOpen={this.state.statsIsVisible}
          closeModal={this.toggleStats}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = store => ({
  books: store.books.items.sort((a, b) => a.title > b.title ? 1 : (a.title < b.title ? -1 : 0)),
  categories: store.categories.items,
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