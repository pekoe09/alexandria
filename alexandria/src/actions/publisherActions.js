import entityService from '../services/entityServices'

export const PUBLISHERS_GETALL_BEGIN = 'PUBLISHERS_GETALL_BEGIN'
export const PUBLISHERS_GETALL_SUCCESS = 'PUBLISHERS_GETALL_SUCCESS'
export const PUBLISHERS_GETALL_FAILURE = 'PUBLISHERS_GETALL_FAILURE'
export const PUBLISHER_CREATE_BEGIN = 'PUBLISHERS_CREATE_BEGIN'
export const PUBLISHER_CREATE_SUCCESS = 'PUBLISHER_CREATE_SUCCESS'
export const PUBLISHER_CREATE_FAILURE = 'PUBLISHER_CREATE_FAILURE'
export const PUBLISHER_UPDATE_BEGIN = 'PUBLISHER_UPDATE_BEGIN'
export const PUBLISHER_UPDATE_SUCCESS = 'PUBLISHER_UPDATE_SUCCESS'
export const PUBLISHER_UDPATE_FAILURE = 'PUBLISHER_UPDATE_FAILURE'
export const PUBLISHER_DELETE_BEGIN = 'PUBLISHER_DELETE_BEGIN'
export const PUBLISHER_DELETE_SUCCESS = 'PUBLISHER_DELETE_SUCCESS'
export const PUBLISHER_DELETE_FAILURE = 'PUBLISHER_DELETE_FAILURE'

const getAllPublishersBegin = () => ({
  type: PUBLISHERS_GETALL_BEGIN
})

const getAllPublishersSuccess = publishers => ({
  type: PUBLISHERS_GETALL_SUCCESS,
  payload: { publishers }
})

const getAllPublishersFailure = error => ({
  type: PUBLISHERS_GETALL_FAILURE,
  payload: { error }
})

const addPublisherBegin = () => ({
  type: PUBLISHER_CREATE_BEGIN
})

const addPublisherSuccess = publisher => ({
  type: PUBLISHER_CREATE_SUCCESS,
  payload: { publisher }
})

const addPublisherFailure = error => ({
  type: PUBLISHER_CREATE_FAILURE,
  payload: { error }
})

const updatePublisherBegin = () => ({
  type: PUBLISHER_UPDATE_BEGIN
})

const updatePublisherSuccess = publisher => ({
  type: PUBLISHER_UPDATE_SUCCESS,
  payload: { publisher }
})

const updatePublisherFailure = error => ({
  type: PUBLISHER_UDPATE_FAILURE,
  payload: { error }
})

const deletePublisherBegin = () => ({
  type: PUBLISHER_DELETE_BEGIN
})

const deletePublisherSuccess = id => ({
  type: PUBLISHER_DELETE_SUCCESS,
  payload: { id }
})

const deletePublisherFailure = error => ({
  type: PUBLISHER_DELETE_FAILURE,
  payload: { error }
})

export const getAllPublishers = () => {
  return async (dispatch) => {
    dispatch(getAllPublishersBegin())
    try {
      const publishers = await entityService.getAll('publishers')
      dispatch(getAllPublishersSuccess(publishers))
    } catch (error) {
      console.log(error)
      dispatch(getAllPublishersFailure(error))
    }
  }
}

export const addPublisher = (publisher) => {
  return async (dispatch) => {
    dispatch(addPublisherBegin())
    try {
      publisher = await entityService.addEntity('publishers', publisher)
      dispatch(addPublisherSuccess(publisher))
    } catch (error) {
      console.log(error)
      dispatch(addPublisherFailure(error))
    }
  }
}

export const updatePublisher = (publisher) => {
  return async (dispatch) => {
    dispatch(updatePublisherBegin())
    try {
      publisher = await entityService.updateEntity('publishers', publisher)
      dispatch(updatePublisherSuccess(publisher))
    } catch (error) {
      console.log(error)
      dispatch(updatePublisherFailure(error))
    }
  }
}

export const deletePublisher = (id) => {
  return async (dispatch) => {
    dispatch(deletePublisherBegin())
    try {
      await entityService.removeEntity('publishers', id)
      dispatch(deletePublisherSuccess(id))
    } catch (error) {
      console.log(error)
      dispatch(deletePublisherFailure(error))
    }
  }
}