import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  StyledButton,
  StyledTable
} from '../common/alexandriaComponents'
import '../common/alexandria-react-table.css'
import ViewBar from '../common/ViewBar'

function AuthorList(props) {
  const [searchPhrase, setSearchPhrase] = useState('')
  const [searchPhraseToUse, setSearchPhraseToUse] = useState('')

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

  const getFilteredAuthors = useCallback(() => {
    let searchPhrase = searchPhraseToUse.toLowerCase()
    let filtered = props.items
    if (searchPhraseToUse.length > 0) {
      filtered = props.items.filter(a =>
        a.fullName.toLowerCase().includes(searchPhrase) || a.fullNameReversed.includes(searchPhrase))
    }
    return filtered
  }, [props.items, searchPhraseToUse])

  const getData = React.useMemo(() => getFilteredAuthors(), [getFilteredAuthors])

  // sarakemäärittely (columns) tapahduttava React.useMemo() -kutsun kautta
  const columns = React.useMemo(
    () => [
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
        Cell: (item) => (
          item.row.original.books.length
        ),
        style: {
          textAlign: 'center'
        }
      },
      {
        Header: '',
        accessor: 'delete',
        Cell: (item) => (
          <StyledButton
            onClick={(e) => props.handleDeleteRequest(item.row.original, e)}
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
    ],
    []
  )

  return (
    <React.Fragment>
      <ViewBar
        headerText='Authors'
        addBtnText='Add author'
        handleOpenEdit={props.toggleEditModalOpen}
        handlePhraseChange={handlePhraseChange}
        handleSearch={handleSearch}
        searchPhrase={searchPhrase}
      />
      <StyledTable
        columns={columns}
        data={getData}
        handleRowClick={props.handleRowClick}
      />
    </React.Fragment>
  )

}

export default AuthorList

AuthorList.propTypes = {
  handleDeleteRequest: PropTypes.func.isRequired,
  toggleEditModalOpen: PropTypes.func.isRequired,
  handleRowClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string
}