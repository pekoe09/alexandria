import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { logout } from '../../actions/userActions'

const Logout = ({ logout, history }) => {
  const handleLogout = () => {
    logout()
    history.push('/')
  }

  return (
    <Form inline>
      <Button
        onClick={handleLogout}
        size='mini'
        style={{
          fontFamily: 'sans-serif'
        }}
      >
        Logout
      </Button>
    </Form>
  )
}

export default withRouter(connect(
  null,
  {
    logout
  }
)(Logout))