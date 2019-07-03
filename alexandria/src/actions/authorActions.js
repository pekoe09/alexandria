import entityService from '../services/entityServices'
import { getAllBooks } from './bookActions'

export const AUTHORS_GETALL_BEGIN = 'AUTHORS_GETALL_BEGIN'
export const AUTHORS_GETALL_SUCCESS = 'AUTHORS_GETALL_SUCCESS'
export const AUTHORS_GETALL_FAILURE = 'AUTHORS_GETALL_FAILURE'
export const AUTHOR_CREATE_BEGIN = 'AUTHORS_CREATE_BEGIN'
export const AUTHOR_CREATE_SUCCESS = 'AUTHOR_CREATE_SUCCESS'
export const AUTHOR_CREATE_FAILURE = 'AUTHOR_CREATE_FAILURE'
export const AUTHOR_UPDATE_BEGIN = 'AUTHOR_UPDATE_BEGIN'
export const AUTHOR_UPDATE_SUCCESS = 'AUTHOR_UPDATE_SUCCESS'
export const AUTHOR_UDPATE_FAILURE = 'AUTHOR_UPDATE_FAILURE'
export const AUTHOR_DELETE_BEGIN = 'AUTHOR_DELETE_BEGIN'
export const AUTHOR_DELETE_SUCCESS = 'AUTHOR_DELETE_SUCCESS'
export const AUTHOR_DELETE_FAILURE = 'AUTHOR_DELETE_FAILURE'

const getAllAuthorsBegin = () => ({
  type: AUTHORS_GETALL_BEGIN
})

const getAllAuthorsSuccess = authors => ({
  type: AUTHORS_GETALL_SUCCESS,
  payload: { authors }
})

const getAllAuthorsFailure = error => ({
  type: AUTHORS_GETALL_FAILURE,
  payload: { error }
})

const addAuthorBegin = () => ({
  type: AUTHOR_CREATE_BEGIN
})

const addAuthorSuccess = author => ({
  type: AUTHOR_CREATE_SUCCESS,
  payload: { author }
})

const addAuthorFailure = error => ({
  type: AUTHOR_CREATE_FAILURE,
  payload: { error }
})

const updateAuthorBegin = () => ({
  type: AUTHOR_UPDATE_BEGIN
})

const updateAuthorSuccess = author => ({
  type: AUTHOR_UPDATE_SUCCESS,
  payload: { author }
})

const updateAuthorFailure = error => ({
  type: AUTHOR_UDPATE_FAILURE,
  payload: { error }
})

const deleteAuthorBegin = () => ({
  type: AUTHOR_DELETE_BEGIN
})

const deleteAuthorSuccess = id => ({
  type: AUTHOR_DELETE_SUCCESS,
  payload: { id }
})

const deleteAuthorFailure = error => ({
  type: AUTHOR_DELETE_FAILURE,
  payload: { error }
})

export const getAllAuthors = () => {
  return async (dispatch) => {
    dispatch(getAllAuthorsBegin())
    try {
      const authors = await entityService.getAll('authors')
      dispatch(getAllAuthorsSuccess(authors))
    } catch (error) {
      console.log(error)
      dispatch(getAllAuthorsFailure(error))
    }
  }
}

export const addAuthor = (author) => {
  return async (dispatch) => {
    dispatch(addAuthorBegin())
    try {
      author = await entityService.addEntity('authors', author)
      dispatch(addAuthorSuccess(author))
    } catch (error) {
      console.log(error)
      dispatch(addAuthorFailure(error))
    }
  }
}

export const updateAuthor = (author) => {
  return async (dispatch) => {
    dispatch(updateAuthorBegin())
    try {
      author = await entityService.updateEntity('authors', author)
      dispatch(updateAuthorSuccess(author))
      dispatch(getAllBooks())
    } catch (error) {
      console.log(error)
      dispatch(updateAuthorFailure(error))
    }
  }
}

export const deleteAuthor = (id) => {
  return async (dispatch) => {
    dispatch(deleteAuthorBegin())
    try {
      await entityService.removeEntity('authors', id)
      dispatch(deleteAuthorSuccess(id))
    } catch (error) {
      console.log(error)
      dispatch(deleteAuthorFailure(error))
    }
  }
}