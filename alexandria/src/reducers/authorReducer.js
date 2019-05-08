import {
  AUTHORS_GETALL_BEGIN,
  AUTHORS_GETALL_SUCCESS,
  AUTHORS_GETALL_FAILURE,
  AUTHOR_CREATE_BEGIN,
  AUTHOR_CREATE_SUCCESS,
  AUTHOR_CREATE_FAILURE,
  AUTHOR_UPDATE_BEGIN,
  AUTHOR_UPDATE_SUCCESS,
  AUTHOR_UDPATE_FAILURE,
  AUTHOR_DELETE_BEGIN,
  AUTHOR_DELETE_SUCCESS,
  AUTHOR_DELETE_FAILURE
} from '../actions/authorActions'

const initialState = {
  items: [],
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null
}

const authorReducer = (store = initialState, action) => {
  switch (action.type) {
    case AUTHORS_GETALL_BEGIN:
      return {
        ...store,
        loading: true,
        error: null
      }
    case AUTHORS_GETALL_SUCCESS:
      return {
        ...store,
        items: action.payload.authors,
        loading: false,
        error: null
      }
    case AUTHORS_GETALL_FAILURE:
      return {
        ...store,
        loading: false,
        error: action.payload.error
      }
    case AUTHOR_CREATE_BEGIN:
      return {
        ...store,
        creating: true,
        error: null
      }
    case AUTHOR_CREATE_SUCCESS:
      return {
        ...store,
        items: store.items.concat(action.payload.author),
        creating: false,
        error: null
      }
    case AUTHOR_CREATE_FAILURE:
      return {
        ...store,
        creating: false,
        error: action.payload.error
      }
    case AUTHOR_UPDATE_BEGIN:
      return {
        ...store,
        updating: true,
        error: null
      }
    case AUTHOR_UPDATE_SUCCESS:
      const updated = action.payload.author
      return {
        ...store,
        items: store.items.map(c => c._id === updated._id ? updated : c),
        updating: false,
        error: null
      }
    case AUTHOR_UDPATE_FAILURE:
      return {
        ...store,
        updating: false,
        error: action.payload.error
      }
    case AUTHOR_DELETE_BEGIN:
      return {
        ...store,
        deleting: true,
        error: null
      }
    case AUTHOR_DELETE_SUCCESS:
      return {
        ...store,
        items: store.items.filter(c => c._id !== action.payload.id),
        deleting: false,
        error: null
      }
    case AUTHOR_DELETE_FAILURE:
      return {
        ...store,
        deleting: false,
        error: action.payload.error
      }
    default:
      return store
  }
}

export default authorReducer