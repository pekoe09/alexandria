import {
  LOGIN_BEGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_BEGIN,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE
} from '../actions/userActions'

const initialState = {
  items: [],
  currentUser: null,
  loggingIn: false,
  loggingOut: false,
  error: null
}

const userReducer = (store = initialState, action) => {
  switch (action.type) {
    case LOGIN_BEGIN:
      return {
        ...store,
        loggingIn: true,
        loggingOut: false,
        error: null
      }
    case LOGIN_SUCCESS:
      return {
        ...store,
        currentUser: action.payload.currentUser,
        loggingIn: false,
        loggingOut: false,
        error: false
      }
    case LOGIN_FAILURE:
      return {
        ...store,
        currentUser: null,
        loggingIn: false,
        loggingOut: false,
        error: action.payload.error
      }
    case LOGOUT_BEGIN:
      return {
        ...store,
        loggingOut: true,
        loggingIn: false,
        error: null
      }
    case LOGOUT_SUCCESS:
      return {
        ...store,
        currentUser: null,
        loggingOut: false,
        loggingIn: false,
        error: null
      }
    case LOGOUT_FAILURE:
      return {
        ...store,
        loggingOut: false,
        loggingIn: false,
        error: action.payload.error
      }
    default:
      return store
  }
}

export default userReducer