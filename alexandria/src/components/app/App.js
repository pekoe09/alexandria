import React from 'react';
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import './App.css'
import ColorTest from '../common/ColorTest'
import FrontPageContainer from '../layout/FrontPageContainer'
import Layout from '../layout/Layout'
import { Authors } from '../authors'
import { Books } from '../books'
import { Categories } from '../categories'
import { Locations } from '../locations'
import { Publishers } from '../publishers'
import ReadingsView from '../readings/ReadingsView'

class App extends React.Component {
  render() {
    return (
      <Layout>
        <Route exact path='/' render={() => <FrontPageContainer />} />
        <Route exact path='/authors' render={() => <Authors />} />
        <Route exact path='/books' render={() => <Books />} />
        <Route exact path='/categories' render={() => <Categories />} />
        <Route exact path='/locations' render={() => <Locations />} />
        <Route exact path='/publishers' render={() => <Publishers />} />
        <Route exact path='/readings' render={() => <ReadingsView />} />
        <Route exact path='/colortest' render={() => <ColorTest />} />
      </Layout>
    )
  }
}

export default withRouter(connect(
  null
)(App))
