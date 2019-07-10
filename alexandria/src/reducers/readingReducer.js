import {
  READINGS_GETALL_BEGIN,
  READINGS_GETALL_SUCCESS,
  READINGS_GETALL_FAILURE,
  READING_CREATE_BEGIN,
  READING_CREATE_SUCCESS,
  READING_CREATE_FAILURE,
  READING_UPDATE_BEGIN,
  READING_UPDATE_SUCCESS,
  READING_UDPATE_FAILURE,
  READING_DELETE_BEGIN,
  READING_DELETE_SUCCESS,
  READING_DELETE_FAILURE
} from '../actions/readingActions'

const initialState = {
  items: [],
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null
}

const readingReducer = (store = initialState, action) => {
  switch (action.type) {
    case READINGS_GETALL_BEGIN:
      return {
        ...store,
        loading: true,
        error: null
      }
    case READINGS_GETALL_SUCCESS:
      return {
        ...store,
        items: action.payload.readings,
        loading: false,
        error: null
      }
    case READINGS_GETALL_FAILURE:
      return {
        ...store,
        loading: false,
        error: action.payload.error
      }
    case READING_CREATE_BEGIN:
      return {
        ...store,
        creating: true,
        error: null
      }
    case READING_CREATE_SUCCESS:
      return {
        ...store,
        items: store.items.concat(action.payload.reading),
        creating: false,
        error: null
      }
    case READING_CREATE_FAILURE:
      return {
        ...store,
        creating: false,
        error: action.payload.error
      }
    case READING_UPDATE_BEGIN:
      return {
        ...store,
        updating: true,
        error: null
      }
    case READING_UPDATE_SUCCESS:
      const updated = action.payload.reading
      return {
        ...store,
        items: store.items.map(c => c._id === updated._id ? updated : c),
        updating: false,
        error: null
      }
    case READING_UDPATE_FAILURE:
      return {
        ...store,
        updating: false,
        error: action.payload.error
      }
    case READING_DELETE_BEGIN:
      return {
        ...store,
        deleting: true,
        error: null
      }
    case READING_DELETE_SUCCESS:
      return {
        ...store,
        items: store.items.filter(c => c._id !== action.payload.id),
        deleting: false,
        error: null
      }
    case READING_DELETE_FAILURE:
      return {
        ...store,
        deleting: false,
        error: action.payload.error
      }
    default:
      return store
  }
}

export default readingReducer