import React from 'react'
import styled, { css } from 'styled-components'
import {
  useTable,
  useFlexLayout,
  usePagination,
  useSortBy
} from 'react-table'
import { Button, Nav, NavItem } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Form } from 'react-bootstrap'

const ListTable = styled.div`
  margin: 10px;
`

const StyledTable = ({ columns, data, handleRowClick }) => {
  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30, width: 150, maxWidth: 200
    })
  )

  const {
    getTableProps,
    getTableBodyProps,
    headers,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0 }
    },
    useFlexLayout,
    useSortBy,
    usePagination    
  )

  return (
    <>      
      <table {...getTableProps} className='rt-table'>
        <thead className='rt-thead'>
          <tr className='rt-tr'>
            {headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps)} className='rt-th'>
                {column.render('Header')}
                <span>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? ' 🔽'
                      : ' 🔼'
                    : ''}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody {...getTableBodyProps} className='rt-tbody'>
          {page.map(
            (row, i) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps({ onClick: () => handleRowClick(row) })} className='rt-tr'>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()} className='rt-td'>{cell.render('Cell')}</td>
                  })}
                </tr>
              )
            }
          )}
        </tbody>
      </table>

      <div className='rt-pagination'>
        <StyledButton 
          onClick={() => gotoPage(0)} 
          disabled={!canPreviousPage}
          className='rt-paginationbutton'
        >
          {'<<'}
        </StyledButton>{' '}
        <StyledButton 
          onClick={() => previousPage()} 
          disabled={!canPreviousPage}
          className='rt-paginationbutton'
        >
          {'<'}
        </StyledButton>{' '}
        
        <span>
          Page{' '}
          {pageIndex + 1} of {pageOptions.length}
          {' '}
        </span>
        <span>
          | Go to page: {' '}
          <input
            type='number'
            defaultValue={pageIndex + 1}
            max={pageCount}
            min={1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '50px' }}
          />{' '}
        </span>
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
          style={{
            background: '#007BFF',
            border: "none",
            padding: "6px 12px",
            margin: "0 5px 0 0",
            color: "white"}}
        >
          {[10, 30, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>{' '}
        <StyledButton 
          onClick={() => nextPage()} 
          disabled={!canNextPage} 
          className='rt-paginationbutton'
        >
          {'>'}
        </StyledButton>{' '}
        <StyledButton 
          onClick={() => gotoPage(pageCount - 1)} 
          disabled={!canNextPage} 
          className='rt-paginationbutton'
        >
          {'>>'}
        </StyledButton>{' '}
      </div>
    </>
  )
}

const LinkButton = ({ text, to, type }) => {
  return (
    <Link to={to}>
      <Button className={type ? type : 'primary'}>{text}</Button>
    </Link>
  )
}

const StyledButton = styled(Button)`
  color: white;
  background-color: '#572617';
  font-family: sans-serif;
  margin-right: 5px;

  ${props => props.bsstyle === 'primary' && css`
    background-color: #E06460;
    color: white;
    border-style: solid;
    border-color: #E06460;
    border-width: 1.5px;
        
    &:hover, &:focus {
      background: #9F201C;
      color: white;
      border-color: #9F201C;
      outline: none;
    }
    &:active:focus {
      background: #9F201C;
      color: white;
      border-color: #9F201C;
      outline: none;
    }
  `}

  ${props => props.bsstyle === 'rowdanger' && css`
      background: white;
      color: indianred;
      border-style: solid;
      border-color: indianred;
      border-width: 1.5px;
      font-size: 0.8em;
      font-weight: 700;
        
      &:hover, &:focus {
        background: white;
        color: indianred;
        border-color: indianred;
        outline: none;
      }
      &:active:focus {
        background: pink;
        color: indianred;
        border-color: indianred;
        outline: none;
      }
    `}

  ${props => props.bsstyle === 'warning' && css`
    background: darkorange;
    color: black;
    border-style: solid;
    border-color: darkorange;
    border-width: 1.5px;
        
    &:hover, &:focus {
      background: orange;
      color: black;
      border-color: orange;
      outline: none;
    }
    &:active:focus {
      background: orange;
      color: black;
      border-color: orange;
      outline: none;
    }
  `}

`

const StyledForm = styled(Form)`
  font-family: 'sans serif';
  margin-top: 5px;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  display: inline;
`

const StyledVerticalLink = styled(Link)`
  text-decoration: none;
  display: inline-grid;
`

const StyledNavItem = styled(NavItem)`
  color: #765003;
  background-color: #E0B660;
  padding: 6px 12px;
  border-radius: 2px;
  margin-right: 8px;
  font-family: 'sans-serif';
`

const ViewHeader = ({ text }) => {
  return <h2
    style={{
      fontFamily: 'sans-serif',
      color: 'white',
      marginLeft: 10
    }}
  >
    {text}
  </h2>
}

export {
  LinkButton,
  ListTable,
  ViewHeader,
  StyledButton,
  StyledForm,
  StyledLink,
  StyledNavItem,
  StyledTable,
  StyledVerticalLink
} 