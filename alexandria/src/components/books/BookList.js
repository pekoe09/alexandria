import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  StyledButton,
  StyledForm,
  StyledTable
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

function BookList(props) {
  const [editModalIsOpen, setEditModalIsOpen] = useState(false)
  const [rowToEdit, setRowToEdit] = useState(null)
  const [modalError, setModalError] = useState('')
  const [deletionTargetId, setDeletionTargetId] = useState('')
  const [deletionTargetName, setDeletionTargetName] = useState('')
  const [deletionConfirmationIsOpen, setDeletionConfirmationIsOpen] = useState(false)
  const [searchPhrase, setSearchPhrase] = useState('')
  const [searchPhraseToUse, setSearchPhraseToUse] = useState('')
  const [advancedSearchIsVisible, setAdvancedSearchIsVisible] = useState(false)
  const [searchCriteria, setSearchCriteria] = useState(null)
  const [statsIsVisible, setStatsIsVisible] = useState(false)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    (async function getData() {
      await props.getAllBooks()
    })()
    setStats(bookStats(props.books, props.categories))
  }, [])

  const toggleEditModalOpen = () => {
    setModalError('')
    setEditModalIsOpen(!editModalIsOpen)
    setRowToEdit(null)
  }

  const handleSave = async (book) => {
    if (book._id) {
      await props.updateBook(book)
    } else {
      await props.addBook(book)
    }
    if (props.error) {
      setModalError('Could not save the book')
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
    setDeletionTargetName(item.title)
    setDeletionConfirmationIsOpen(true)
  }

  const handleDeleteConfirmation = async (isConfirmed) => {
    if (isConfirmed) {
      await props.deleteBook(deletionTargetId)
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

  const handleCriteriaSearch = criteria => {
    setSearchCriteria(criteria)
    toggleAdvancedSearch()
  }

  const toggleAdvancedSearch = () => {
    setAdvancedSearchIsVisible(!advancedSearchIsVisible)
  }

  const getSearchCriteriaString = () => {
    let criteriaStr = ''
    if (searchCriteria) {
      const criteria = searchCriteria
      criteriaStr = 'Filtered by: '
      if (criteria.title) {
        criteriaStr = `${criteriaStr}Title: "${criteria.title}" `
      }
      if (searchCriteria.author) {
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

  const getFilteredBooks = () => {
    let searchPhrase = searchPhraseToUse.toLowerCase()
    let filtered = props.books
    if (searchPhraseToUse.length > 0) {
      filtered = props.books.filter(b =>
        b.title.toLowerCase().includes(searchPhrase)
        || b.authors.some(a =>
          a.fullName.toLowerCase().includes(searchPhrase) || a.fullNameReversed.toLowerCase().includes(searchPhrase))
        || b.categories.some(c => c.name.toLowerCase().includes(searchPhrase))
      )
    } else if (searchCriteria) {
      const criteria = searchCriteria
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

  const getData = React.useMemo(() => getFilteredBooks(), [props.books, props.categories])

  const toggleStats = () => {
    setStats(statsIsVisible ? stats : bookStats(props.books, props.categories))
    setStatsIsVisible(!statsIsVisible)
  }

  const getStatsCriteriaForm = () => {
    return (
      <StyledForm></StyledForm>
    )
  }

  const getCategoryPie = () => {
    return (
      <BookCountByCategoryPie
        key={1}
        data={stats.categoryCounts}
      />
    )
  }

  const getStatusPie = () => {
    const statuses = []
    if (stats.unread) {
      statuses.push({ name: 'Not read yet', count: stats.unread })
    }
    if (stats.started) {
      statuses.push({ name: 'Part way through', count: stats.started })
    }
    if (stats.finished) {
      statuses.push({ name: 'Read', count: stats.finished })
    }

    return (
      <BookCountByStatusPie
        key={2}
        data={statuses}
      />
    )
  }

  const columns = React.useMemo(
    () => [
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
        Cell: (item) => (
          item.row.original.pages ? parseFloat(item.row.original.readPages / item.row.original.pages * 100).toFixed(0) + ' %' : '-'
        ),
        style: {
          textAlign: 'center'
        },
        maxWidth: 120
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
    ]
  )

  return (
    <React.Fragment>
      <ViewBar
        headerText='Books'
        addBtnText='Add book'
        handleOpenEdit={toggleEditModalOpen}
        handlePhraseChange={handlePhraseChange}
        handleSearch={handleSearch}
        searchPhrase={searchPhrase}
        toggleAdvancedSearch={toggleAdvancedSearch}
        showStats={toggleStats}
      />
      <div style={{ fontFamily: 'sans-serif', color: 'white', marginLeft: 10, marginRight: 10 }}>
        {searchCriteria ? getSearchCriteriaString() : ''}
      </div>
      {searchCriteria
        && <Button
          variant='link'
          style={{ color: 'white', fontFamily: 'sans-serif', fontSize: '0.9em' }}
          onClick={() => setSearchCriteria(null)}
        >
          Clear search criteria
          </Button>
      }
      <StyledTable
        columns={columns}
        data={getData}
        handleRowClick={handleRowClick}
      />
      <AdvancedBookSearch
        modalIsOpen={advancedSearchIsVisible}
        handleSearch={handleCriteriaSearch}
        closeModal={toggleAdvancedSearch}
      />
      <BookEdit
        book={rowToEdit}
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
      <GraphView
        title='Book statistics'
        getCriteriaForm={getStatsCriteriaForm}
        getCharts={[
          {
            title: 'Books in main categories',
            call: getCategoryPie
          },
          {
            title: 'Books by reading status',
            call: getStatusPie
          }
        ]}
        kpis={[
          {
            name: 'Books in total',
            value: stats ? stats.count : '-'
          },
          {
            name: 'Pages in total',
            value: stats ? stats.pages : '-'
          },
          {
            name: 'of which read',
            value: (stats && stats.pages) ?
              parseFloat(stats.readPages / stats.pages * 100).toFixed(0) + '%' : '-'
          }
        ]}
        modalIsOpen={statsIsVisible}
        closeModal={toggleStats}
      />
    </React.Fragment>
  )

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