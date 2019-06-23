import {
  CATEGORIES_GETALL_BEGIN,
  CATEGORIES_GETALL_SUCCESS,
  CATEGORIES_GETALL_FAILURE,
  CATEGORY_CREATE_BEGIN,
  CATEGORY_CREATE_SUCCESS,
  CATEGORY_CREATE_FAILURE,
  CATEGORY_UPDATE_BEGIN,
  CATEGORY_UPDATE_SUCCESS,
  CATEGORY_UDPATE_FAILURE,
  CATEGORY_DELETE_BEGIN,
  CATEGORY_DELETE_SUCCESS,
  CATEGORY_DELETE_FAILURE
} from '../actions/categoryActions'

const initialState = {
  items: [],
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null
}

const categoryReducer = (store = initialState, action) => {
  switch (action.type) {
    case CATEGORIES_GETALL_BEGIN:
      return {
        ...store,
        loading: true,
        error: null
      }
    case CATEGORIES_GETALL_SUCCESS:
      return {
        ...store,
        items: action.payload.categories,
        loading: false,
        error: null
      }
    case CATEGORIES_GETALL_FAILURE:
      return {
        ...store,
        loading: false,
        error: action.payload.error
      }
    case CATEGORY_CREATE_BEGIN:
      return {
        ...store,
        creating: true,
        error: null
      }
    case CATEGORY_CREATE_SUCCESS:
      return {
        ...store,
        items: store.items.concat(action.payload.category),
        creating: false,
        error: null
      }
    case CATEGORY_CREATE_FAILURE:
      return {
        ...store,
        creating: false,
        error: action.payload.error
      }
    case CATEGORY_UPDATE_BEGIN:
      return {
        ...store,
        updating: true,
        error: null
      }
    case CATEGORY_UPDATE_SUCCESS:
      const updated = action.payload.category
      return {
        ...store,
        items: store.items.map(c => c._id === updated._id ? updated : c),
        updating: false,
        error: null
      }
    case CATEGORY_UDPATE_FAILURE:
      return {
        ...store,
        updating: false,
        error: action.payload.error
      }
    case CATEGORY_DELETE_BEGIN:
      return {
        ...store,
        deleting: true,
        error: null
      }
    case CATEGORY_DELETE_SUCCESS:
      return {
        ...store,
        items: store.items.filter(c => c._id !== action.payload.id),
        deleting: false,
        error: null
      }
    case CATEGORY_DELETE_FAILURE:
      return {
        ...store,
        deleting: false,
        error: action.payload.error
      }
    default:
      return store
  }
}

export default categoryReducer