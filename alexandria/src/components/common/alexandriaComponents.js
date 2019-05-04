import React from 'react'
import styled, { css } from 'styled-components'
import ReactTable from 'react-table'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Form } from 'react-bootstrap'

const ListTable = styled(ReactTable)`
  margin: 10px;
`

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

const ViewHeader = ({ text }) => {
  return <h2 style={{ fontFamily: 'sans-serif' }}>{text}</h2>
}

export {
  LinkButton,
  ListTable,
  ViewHeader,
  StyledButton,
  StyledForm,
  StyledLink,
  StyledVerticalLink
} 