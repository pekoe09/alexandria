import React from 'react'
import { connect } from 'react-redux'
import { withRouter, NavLink } from 'react-router-dom'
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import styled from 'styled-components'
import Login from '../users/Login'
import Logout from '../users/Logout'

const StyledNavbar = styled(Navbar)`
  marginBottom: 0;
`

const AnonymousItems = () => {
  return (
    <Nav>
      <NavItem style={{ padding: 0, marginTop: 0 }}>
        <Login />
      </NavItem>
    </Nav>
  )
}

const LoggedInItems = () => {
  return (
    <React.Fragment>
      <Nav>
        <NavLink to='/publishers'>
          <NavItem>
            Publishers
          </NavItem>
        </NavLink>
      </Nav>
      <Nav>
        <Logout />
      </Nav>
    </React.Fragment>
  )
}

const Mainbar = ({ currentUser }) => {
  return (
    <StyledNavbar
    >
      <Navbar.Brand>
        <NavLink to='/'>
          Jotain
        </NavLink>
      </Navbar.Brand>
      {currentUser && <LoggedInItems />}
      {!currentUser && <AnonymousItems />}
    </StyledNavbar>
  )
}

const mapStateToProps = store => ({
  currentUser: store.users.currentUser
})

export default withRouter(connect(
  mapStateToProps
)(Mainbar)) 