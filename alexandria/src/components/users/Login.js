import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, FormGroup, FormControl, Button } from 'react-bootstrap'
import { login } from '../../actions/userActions'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const credentials = {
      username: this.state.username,
      password: this.state.password
    }
    await this.props.login(credentials)
    if (!this.props.error) {
      // load all data
    }
  }

  render() {
    return (
      <Form inline>
        <FormGroup>
          <FormControl
            placeholder='Username'
            name='username'
            size='mini'
            value={this.state.username}
            onChange={this.handleChange}
            style={{ marginRight: 5 }}
          />
          <FormControl
            placeholder='Password'
            name='password'
            size='mini'
            value={this.state.password}
            onChange={this.handleChange}
            style={{ marginRight: 5 }}
          />
          <Button type='submit' onClick={this.handleSubmit}>Login</Button>
        </FormGroup>
      </Form>
    )
  }
}

const mapStateToProps = store => ({
  loggingIn: store.users.loggingIn,
  error: store.users.error
})

export default withRouter(connect(
  mapStateToProps,
  {
    login
  }
)(Login))