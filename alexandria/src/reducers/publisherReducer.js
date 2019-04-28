import {
  PUBLISHERS_GETALL_BEGIN,
  PUBLISHERS_GETALL_SUCCESS,
  PUBLISHERS_GETALL_FAILURE,
  PUBLISHER_CREATE_BEGIN,
  PUBLISHER_CREATE_SUCCESS,
  PUBLISHER_CREATE_FAILURE,
  PUBLISHER_UPDATE_BEGIN,
  PUBLISHER_UPDATE_SUCCESS,
  PUBLISHER_UDPATE_FAILURE,
  PUBLISHER_DELETE_BEGIN,
  PUBLISHER_DELETE_SUCCESS,
  PUBLISHER_DELETE_FAILURE
} from '../actions/publisherActions'

const initialState = {
  items: [],
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null
}

const publisherReducer = (store = initialState, action) => {
  switch (action.type) {
    case PUBLISHERS_GETALL_BEGIN:
      return {
        ...store,
        loading: true,
        error: null
      }
    case PUBLISHERS_GETALL_SUCCESS:
      return {
        ...store,
        items: action.payload.publishers,
        loading: false,
        error: null
      }
    case PUBLISHERS_GETALL_FAILURE:
      return {
        ...store,
        loading: false,
        error: action.payload.error
      }
    case PUBLISHER_CREATE_BEGIN:
      return {
        ...store,
        creating: true,
        error: null
      }
    case PUBLISHER_CREATE_SUCCESS:
      return {
        ...store,
        items: store.items.concat(action.payload.publisher),
        creating: false,
        error: null
      }
    case PUBLISHER_CREATE_FAILURE:
      return {
        ...store,
        creating: false,
        error: action.payload.error
      }
    case PUBLISHER_UPDATE_BEGIN:
      return {
        ...store,
        updating: true,
        error: null
      }
    case PUBLISHER_UPDATE_SUCCESS:
      const updated = action.payload.publisher
      return {
        ...store,
        items: store.items.map(c => c._id === updated._id ? updated : c),
        updating: false,
        error: null
      }
    case PUBLISHER_UDPATE_FAILURE:
      return {
        ...store,
        updating: false,
        error: action.payload.error
      }
    case PUBLISHER_DELETE_BEGIN:
      return {
        ...store,
        deleting: true,
        error: null
      }
    case PUBLISHER_DELETE_SUCCESS:
      return {
        ...store,
        items: store.items.filter(c => c._id !== action.payload.id),
        deleting: false,
        error: null
      }
    case PUBLISHER_DELETE_FAILURE:
      return {
        ...store,
        deleting: false,
        error: action.payload.error
      }
    default:
      return store
  }
}

export default publisherReducer