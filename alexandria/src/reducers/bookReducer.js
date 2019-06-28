import {
  BOOKS_GETALL_BEGIN,
  BOOKS_GETALL_SUCCESS,
  BOOKS_GETALL_FAILURE,
  BOOK_CREATE_BEGIN,
  BOOK_CREATE_SUCCESS,
  BOOK_CREATE_FAILURE,
  BOOK_UPDATE_BEGIN,
  BOOK_UPDATE_SUCCESS,
  BOOK_UDPATE_FAILURE,
  BOOK_DELETE_BEGIN,
  BOOK_DELETE_SUCCESS,
  BOOK_DELETE_FAILURE
} from '../actions/bookActions'

const initialState = {
  items: [],
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null
}

const bookReducer = (store = initialState, action) => {
  switch (action.type) {
    case BOOKS_GETALL_BEGIN:
      return {
        ...store,
        loading: true,
        error: null
      }
    case BOOKS_GETALL_SUCCESS:
      return {
        ...store,
        items: action.payload.books,
        loading: false,
        error: null
      }
    case BOOKS_GETALL_FAILURE:
      return {
        ...store,
        loading: false,
        error: action.payload.error
      }
    case BOOK_CREATE_BEGIN:
      return {
        ...store,
        creating: true,
        error: null
      }
    case BOOK_CREATE_SUCCESS:
      return {
        ...store,
        items: store.items.concat(action.payload.book),
        creating: false,
        error: null
      }
    case BOOK_CREATE_FAILURE:
      return {
        ...store,
        creating: false,
        error: action.payload.error
      }
    case BOOK_UPDATE_BEGIN:
      return {
        ...store,
        updating: true,
        error: null
      }
    case BOOK_UPDATE_SUCCESS:
      const updated = action.payload.book
      return {
        ...store,
        items: store.items.map(c => c._id === updated._id ? updated : c),
        updating: false,
        error: null
      }
    case BOOK_UDPATE_FAILURE:
      return {
        ...store,
        updating: false,
        error: action.payload.error
      }
    case BOOK_DELETE_BEGIN:
      return {
        ...store,
        deleting: true,
        error: null
      }
    case BOOK_DELETE_SUCCESS:
      return {
        ...store,
        items: store.items.filter(c => c._id !== action.payload.id),
        deleting: false,
        error: null
      }
    case BOOK_DELETE_FAILURE:
      return {
        ...store,
        deleting: false,
        error: action.payload.error
      }
    default:
      return store
  }
}

export default bookReducer