import userService from '../services/userServices'

export const LOGIN_BEGIN = 'LOGIN_BEGIN'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOGOUT_BEGIN = 'LOGOUT_BEGIN'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE'

export const loginBegin = () => ({
  type: LOGIN_BEGIN
})

export const loginSuccess = currentUser => ({
  type: LOGIN_SUCCESS,
  payload: { currentUser }
})

export const loginFailure = error => ({
  type: LOGIN_FAILURE,
  payload: { error }
})

export const logoutBegin = () => ({
  type: LOGOUT_BEGIN
})

export const logoutSuccess = () => ({
  type: LOGOUT_SUCCESS
})

export const logoutFailure = error => ({
  type: LOGOUT_FAILURE
})

export const login = (credentials) => {
  return async (dispatch) => {
    dispatch(loginBegin())
    try {
      const currentUser = await userService.login(credentials)
      dispatch(loginSuccess(currentUser))
    } catch (exception) {
      console.log(exception)
      dispatch(loginFailure(exception))
    }
  }
}

export const logout = () => {
  return async (dispatch) => {
    dispatch(logoutBegin())
    try {
      userService.logout()
      dispatch(logoutSuccess())
    } catch (exception) {
      console.log(exception)
      dispatch(logoutFailure(exception))
    }
  }
}