import React from 'react'
import { connect } from 'react-redux'
import { bookStats } from '../books/bookStats'
import FrontPage from './FrontPage'

const getStats = (currentUser, books, categories) => {
  let stats = null
  if (currentUser) {
    console.log('getting stats', books, categories)
    stats = bookStats(books, categories)
  }
  return stats
}

const FrontPageContainer = ({ currentUser, books, categories }) => {
  return (
    <div>
      <FrontPage
        currentUser={currentUser}
        stats={getStats(currentUser, books, categories)}
      />
    </div>
  )
}

const mapStateToProps = store => ({
  currentUser: store.users.currentUser,
  books: store.books.items,
  categories: store.categories.items
})

export default connect(
  mapStateToProps
)(FrontPageContainer)