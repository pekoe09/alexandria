import entityService from '../services/entityServices'

export const BOOKS_GETALL_BEGIN = 'BOOKS_GETALL_BEGIN'
export const BOOKS_GETALL_SUCCESS = 'BOOKS_GETALL_SUCCESS'
export const BOOKS_GETALL_FAILURE = 'BOOKS_GETALL_FAILURE'
export const BOOK_CREATE_BEGIN = 'BOOKS_CREATE_BEGIN'
export const BOOK_CREATE_SUCCESS = 'BOOK_CREATE_SUCCESS'
export const BOOK_CREATE_FAILURE = 'BOOK_CREATE_FAILURE'
export const BOOK_UPDATE_BEGIN = 'BOOK_UPDATE_BEGIN'
export const BOOK_UPDATE_SUCCESS = 'BOOK_UPDATE_SUCCESS'
export const BOOK_UDPATE_FAILURE = 'BOOK_UPDATE_FAILURE'
export const BOOK_DELETE_BEGIN = 'BOOK_DELETE_BEGIN'
export const BOOK_DELETE_SUCCESS = 'BOOK_DELETE_SUCCESS'
export const BOOK_DELETE_FAILURE = 'BOOK_DELETE_FAILURE'

const getAllBooksBegin = () => ({
  type: BOOKS_GETALL_BEGIN
})

const getAllBooksSuccess = books => ({
  type: BOOKS_GETALL_SUCCESS,
  payload: { books }
})

const getAllBooksFailure = error => ({
  type: BOOKS_GETALL_FAILURE,
  payload: { error }
})

const addBookBegin = () => ({
  type: BOOK_CREATE_BEGIN
})

const addBookSuccess = book => ({
  type: BOOK_CREATE_SUCCESS,
  payload: { book }
})

const addBookFailure = error => ({
  type: BOOK_CREATE_FAILURE,
  payload: { error }
})

const updateBookBegin = () => ({
  type: BOOK_UPDATE_BEGIN
})

const updateBookSuccess = book => ({
  type: BOOK_UPDATE_SUCCESS,
  payload: { book }
})

const updateBookFailure = error => ({
  type: BOOK_UDPATE_FAILURE,
  payload: { error }
})

const deleteBookBegin = () => ({
  type: BOOK_DELETE_BEGIN
})

const deleteBookSuccess = id => ({
  type: BOOK_DELETE_SUCCESS,
  payload: { id }
})

const deleteBookFailure = error => ({
  type: BOOK_DELETE_FAILURE,
  payload: { error }
})

export const getAllBooks = () => {
  return async (dispatch) => {
    dispatch(getAllBooksBegin())
    try {
      const books = await entityService.getAll('books')
      dispatch(getAllBooksSuccess(books))
    } catch (error) {
      console.log(error)
      dispatch(getAllBooksFailure(error))
    }
  }
}

export const addBook = (book) => {
  return async (dispatch) => {
    dispatch(addBookBegin())
    try {
      book = await entityService.addEntity('books', book)
      dispatch(addBookSuccess(book))
    } catch (error) {
      console.log(error)
      dispatch(addBookFailure(error))
    }
  }
}

export const updateBook = (book) => {
  return async (dispatch) => {
    dispatch(updateBookBegin())
    try {
      book = await entityService.updateEntity('books', book)
      dispatch(updateBookSuccess(book))
    } catch (error) {
      console.log(error)
      dispatch(updateBookFailure(error))
    }
  }
}

export const deleteBook = (id) => {
  return async (dispatch) => {
    dispatch(deleteBookBegin())
    try {
      await entityService.removeEntity('books', id)
      dispatch(deleteBookSuccess(id))
    } catch (error) {
      console.log(error)
      dispatch(deleteBookFailure(error))
    }
  }
}