import {
  LOCATIONS_GETALL_BEGIN,
  LOCATIONS_GETALL_SUCCESS,
  LOCATIONS_GETALL_FAILURE,
  LOCATION_CREATE_BEGIN,
  LOCATION_CREATE_SUCCESS,
  LOCATION_CREATE_FAILURE,
  LOCATION_UPDATE_BEGIN,
  LOCATION_UPDATE_SUCCESS,
  LOCATION_UDPATE_FAILURE,
  LOCATION_DELETE_BEGIN,
  LOCATION_DELETE_SUCCESS,
  LOCATION_DELETE_FAILURE
} from '../actions/locationActions'

const initialState = {
  items: [],
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null
}

const locationReducer = (store = initialState, action) => {
  switch (action.type) {
    case LOCATIONS_GETALL_BEGIN:
      return {
        ...store,
        loading: true,
        error: null
      }
    case LOCATIONS_GETALL_SUCCESS:
      return {
        ...store,
        items: action.payload.locations,
        loading: false,
        error: null
      }
    case LOCATIONS_GETALL_FAILURE:
      return {
        ...store,
        loading: false,
        error: action.payload.error
      }
    case LOCATION_CREATE_BEGIN:
      return {
        ...store,
        creating: true,
        error: null
      }
    case LOCATION_CREATE_SUCCESS:
      return {
        ...store,
        items: store.items.concat(action.payload.location),
        creating: false,
        error: null
      }
    case LOCATION_CREATE_FAILURE:
      return {
        ...store,
        creating: false,
        error: action.payload.error
      }
    case LOCATION_UPDATE_BEGIN:
      return {
        ...store,
        updating: true,
        error: null
      }
    case LOCATION_UPDATE_SUCCESS:
      const updated = action.payload.location
      return {
        ...store,
        items: store.items.map(c => c._id === updated._id ? updated : c),
        updating: false,
        error: null
      }
    case LOCATION_UDPATE_FAILURE:
      return {
        ...store,
        updating: false,
        error: action.payload.error
      }
    case LOCATION_DELETE_BEGIN:
      return {
        ...store,
        deleting: true,
        error: null
      }
    case LOCATION_DELETE_SUCCESS:
      return {
        ...store,
        items: store.items.filter(c => c._id !== action.payload.id),
        deleting: false,
        error: null
      }
    case LOCATION_DELETE_FAILURE:
      return {
        ...store,
        deleting: false,
        error: action.payload.error
      }
    default:
      return store
  }
}

export default locationReducer