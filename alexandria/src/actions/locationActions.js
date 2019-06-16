import entityService from '../services/entityServices'

export const LOCATIONS_GETALL_BEGIN = 'LOCATIONS_GETALL_BEGIN'
export const LOCATIONS_GETALL_SUCCESS = 'LOCATIONS_GETALL_SUCCESS'
export const LOCATIONS_GETALL_FAILURE = 'LOCATIONS_GETALL_FAILURE'
export const LOCATION_CREATE_BEGIN = 'LOCATIONS_CREATE_BEGIN'
export const LOCATION_CREATE_SUCCESS = 'LOCATION_CREATE_SUCCESS'
export const LOCATION_CREATE_FAILURE = 'LOCATION_CREATE_FAILURE'
export const LOCATION_UPDATE_BEGIN = 'LOCATION_UPDATE_BEGIN'
export const LOCATION_UPDATE_SUCCESS = 'LOCATION_UPDATE_SUCCESS'
export const LOCATION_UDPATE_FAILURE = 'LOCATION_UPDATE_FAILURE'
export const LOCATION_DELETE_BEGIN = 'LOCATION_DELETE_BEGIN'
export const LOCATION_DELETE_SUCCESS = 'LOCATION_DELETE_SUCCESS'
export const LOCATION_DELETE_FAILURE = 'LOCATION_DELETE_FAILURE'

const getAllLocationsBegin = () => ({
  type: LOCATIONS_GETALL_BEGIN
})

const getAllLocationsSuccess = locations => ({
  type: LOCATIONS_GETALL_SUCCESS,
  payload: { locations }
})

const getAllLocationsFailure = error => ({
  type: LOCATIONS_GETALL_FAILURE,
  payload: { error }
})

const addLocationBegin = () => ({
  type: LOCATION_CREATE_BEGIN
})

const addLocationSuccess = location => ({
  type: LOCATION_CREATE_SUCCESS,
  payload: { location }
})

const addLocationFailure = error => ({
  type: LOCATION_CREATE_FAILURE,
  payload: { error }
})

const updateLocationBegin = () => ({
  type: LOCATION_UPDATE_BEGIN
})

const updateLocationSuccess = location => ({
  type: LOCATION_UPDATE_SUCCESS,
  payload: { location }
})

const updateLocationFailure = error => ({
  type: LOCATION_UDPATE_FAILURE,
  payload: { error }
})

const deleteLocationBegin = () => ({
  type: LOCATION_DELETE_BEGIN
})

const deleteLocationSuccess = id => ({
  type: LOCATION_DELETE_SUCCESS,
  payload: { id }
})

const deleteLocationFailure = error => ({
  type: LOCATION_DELETE_FAILURE,
  payload: { error }
})

export const getAllLocations = () => {
  return async (dispatch) => {
    dispatch(getAllLocationsBegin())
    try {
      const locations = await entityService.getAll('locations')
      dispatch(getAllLocationsSuccess(locations))
    } catch (error) {
      console.log(error)
      dispatch(getAllLocationsFailure(error))
    }
  }
}

export const addLocation = (location) => {
  return async (dispatch) => {
    dispatch(addLocationBegin())
    try {
      location = await entityService.addEntity('locations', location)
      dispatch(addLocationSuccess(location))
    } catch (error) {
      console.log(error)
      dispatch(addLocationFailure(error))
    }
  }
}

export const updateLocation = (location) => {
  return async (dispatch) => {
    dispatch(updateLocationBegin())
    try {
      location = await entityService.updateEntity('locations', location)
      dispatch(updateLocationSuccess(location))
    } catch (error) {
      console.log(error)
      dispatch(updateLocationFailure(error))
    }
  }
}

export const deleteLocation = (id) => {
  return async (dispatch) => {
    dispatch(deleteLocationBegin())
    try {
      await entityService.removeEntity('locations', id)
      dispatch(deleteLocationSuccess(id))
    } catch (error) {
      console.log(error)
      dispatch(deleteLocationFailure(error))
    }
  }
}