import React from 'react'
import { connect } from 'react-redux'
import { withRouter, NavLink } from 'react-router-dom'
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import styled from 'styled-components'
import Login from '../users/Login'
import Logout from '../users/Logout'
import { StyledNav, StyledNavItem } from '../common/alexandriaComponents'

const StyledNavbar = styled(Navbar)`
  margin-bottom: 0;
  background-color: #024447;
  border-radius: 0;
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
          <StyledNavItem>
            Publishers
          </StyledNavItem>
        </NavLink>
      </Nav>
      <Nav>
        <NavLink to='/authors'>
          <StyledNavItem>
            Authors
          </StyledNavItem>
        </NavLink>
      </Nav>
      <Nav>
        <NavLink to='/categories'>
          <StyledNavItem>
            Categories
          </StyledNavItem>
        </NavLink>
      </Nav>
      <Nav>
        <NavLink to='/locations'>
          <StyledNavItem>
            Locations
          </StyledNavItem>
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
      fixed='top'
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