import React from 'react';
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import './App.css'
import ColorTest from '../common/ColorTest'
import FrontPage from '../layout/FrontPage'
import Layout from '../layout/Layout'
import AuthorsList from '../authors/AuthorList'
import CategoryList from '../categories/CategoryList'
import LocationList from '../locations/LocationList'
import PublisherList from '../publishers/PublisherList'
import CategoryEdit from '../categories/CategoryEdit';

class App extends React.Component {
  render() {
    return (
      <Layout>
        <Route exact path='/' render={() => <FrontPage />} />
        <Route exact path='/authors' render={() => <AuthorsList />} />
        <Route exact path='/categories' render={() => <CategoryList />} />
        <Route exact path='/locations' render={() => <LocationList />} />
        <Route exact path='/publishers' render={() => <PublisherList />} />
        <Route exact path='/colortest' render={() => <ColorTest />} />
      </Layout>
    )
  }
}

export default withRouter(connect(
  null
)(App))
