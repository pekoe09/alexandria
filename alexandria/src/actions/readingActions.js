import entityService from '../services/entityServices'

export const READINGS_GETALL_BEGIN = 'READINGS_GETALL_BEGIN'
export const READINGS_GETALL_SUCCESS = 'READINGS_GETALL_SUCCESS'
export const READINGS_GETALL_FAILURE = 'READINGS_GETALL_FAILURE'
export const READING_CREATE_BEGIN = 'READINGS_CREATE_BEGIN'
export const READING_CREATE_SUCCESS = 'READING_CREATE_SUCCESS'
export const READING_CREATE_FAILURE = 'READING_CREATE_FAILURE'
export const READING_UPDATE_BEGIN = 'READING_UPDATE_BEGIN'
export const READING_UPDATE_SUCCESS = 'READING_UPDATE_SUCCESS'
export const READING_UDPATE_FAILURE = 'READING_UPDATE_FAILURE'
export const READING_DELETE_BEGIN = 'READING_DELETE_BEGIN'
export const READING_DELETE_SUCCESS = 'READING_DELETE_SUCCESS'
export const READING_DELETE_FAILURE = 'READING_DELETE_FAILURE'

const getAllReadingsBegin = () => ({
  type: READINGS_GETALL_BEGIN
})

const getAllReadingsSuccess = readings => ({
  type: READINGS_GETALL_SUCCESS,
  payload: { readings }
})

const getAllReadingsFailure = error => ({
  type: READINGS_GETALL_FAILURE,
  payload: { error }
})

const addReadingBegin = () => ({
  type: READING_CREATE_BEGIN
})

const addReadingSuccess = reading => ({
  type: READING_CREATE_SUCCESS,
  payload: { reading }
})

const addReadingFailure = error => ({
  type: READING_CREATE_FAILURE,
  payload: { error }
})

const updateReadingBegin = () => ({
  type: READING_UPDATE_BEGIN
})

const updateReadingSuccess = reading => ({
  type: READING_UPDATE_SUCCESS,
  payload: { reading }
})

const updateReadingFailure = error => ({
  type: READING_UDPATE_FAILURE,
  payload: { error }
})

const deleteReadingBegin = () => ({
  type: READING_DELETE_BEGIN
})

const deleteReadingSuccess = id => ({
  type: READING_DELETE_SUCCESS,
  payload: { id }
})

const deleteReadingFailure = error => ({
  type: READING_DELETE_FAILURE,
  payload: { error }
})

export const getAllReadings = () => {
  return async (dispatch) => {
    dispatch(getAllReadingsBegin())
    try {
      const readings = await entityService.getAll('readings')
      dispatch(getAllReadingsSuccess(readings))
    } catch (error) {
      console.log(error)
      dispatch(getAllReadingsFailure(error))
    }
  }
}

export const addReading = (reading) => {
  return async (dispatch) => {
    dispatch(addReadingBegin())
    try {
      reading = await entityService.addEntity('readings', reading)
      dispatch(addReadingSuccess(reading))
    } catch (error) {
      console.log(error)
      dispatch(addReadingFailure(error))
    }
  }
}

export const updateReading = (reading) => {
  return async (dispatch) => {
    dispatch(updateReadingBegin())
    try {
      reading = await entityService.updateEntity('readings', reading)
      dispatch(updateReadingSuccess(reading))
    } catch (error) {
      console.log(error)
      dispatch(updateReadingFailure(error))
    }
  }
}

export const deleteReading = (id) => {
  return async (dispatch) => {
    dispatch(deleteReadingBegin())
    try {
      await entityService.removeEntity('readings', id)
      dispatch(deleteReadingSuccess(id))
    } catch (error) {
      console.log(error)
      dispatch(deleteReadingFailure(error))
    }
  }
}