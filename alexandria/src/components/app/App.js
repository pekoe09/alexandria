import React from 'react';
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import './App.css'
import FrontPage from '../layout/FrontPage'
import Layout from '../layout/Layout'
import PublisherList from '../publishers/PublisherList'

class App extends React.Component {
  render() {
    return (
      <Layout>
        <Route exact path='/' render={() => <FrontPage />} />
        <Route exact path='/publishers' render={() => <PublisherList />} />
      </Layout>
    )
  }
}

export default withRouter(connect(
  null
)(App))
