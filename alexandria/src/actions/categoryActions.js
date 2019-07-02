import entityService from '../services/entityServices'

export const CATEGORIES_GETALL_BEGIN = 'CATEGORIES_GETALL_BEGIN'
export const CATEGORIES_GETALL_SUCCESS = 'CATEGORIES_GETALL_SUCCESS'
export const CATEGORIES_GETALL_FAILURE = 'CATEGORIES_GETALL_FAILURE'
export const CATEGORY_CREATE_BEGIN = 'CATEGORIES_CREATE_BEGIN'
export const CATEGORY_CREATE_SUCCESS = 'CATEGORY_CREATE_SUCCESS'
export const CATEGORY_CREATE_FAILURE = 'CATEGORY_CREATE_FAILURE'
export const CATEGORY_UPDATE_BEGIN = 'CATEGORY_UPDATE_BEGIN'
export const CATEGORY_UPDATE_SUCCESS = 'CATEGORY_UPDATE_SUCCESS'
export const CATEGORY_UDPATE_FAILURE = 'CATEGORY_UPDATE_FAILURE'
export const CATEGORY_DELETE_BEGIN = 'CATEGORY_DELETE_BEGIN'
export const CATEGORY_DELETE_SUCCESS = 'CATEGORY_DELETE_SUCCESS'
export const CATEGORY_DELETE_FAILURE = 'CATEGORY_DELETE_FAILURE'

const getAllCategoriesBegin = () => ({
  type: CATEGORIES_GETALL_BEGIN
})

const getAllCategoriesSuccess = categories => ({
  type: CATEGORIES_GETALL_SUCCESS,
  payload: { categories }
})

const getAllCategoriesFailure = error => ({
  type: CATEGORIES_GETALL_FAILURE,
  payload: { error }
})

const addCategoryBegin = () => ({
  type: CATEGORY_CREATE_BEGIN
})

const addCategorySuccess = category => ({
  type: CATEGORY_CREATE_SUCCESS,
  payload: { category }
})

const addCategoryFailure = error => ({
  type: CATEGORY_CREATE_FAILURE,
  payload: { error }
})

const updateCategoryBegin = () => ({
  type: CATEGORY_UPDATE_BEGIN
})

const updateCategorySuccess = category => ({
  type: CATEGORY_UPDATE_SUCCESS,
  payload: { category }
})

const updateCategoryFailure = error => ({
  type: CATEGORY_UDPATE_FAILURE,
  payload: { error }
})

const deleteCategoryBegin = () => ({
  type: CATEGORY_DELETE_BEGIN
})

const deleteCategorySuccess = id => ({
  type: CATEGORY_DELETE_SUCCESS,
  payload: { id }
})

const deleteCategoryFailure = error => ({
  type: CATEGORY_DELETE_FAILURE,
  payload: { error }
})

export const getAllCategories = () => {
  return async (dispatch) => {
    dispatch(getAllCategoriesBegin())
    try {
      const categories = await entityService.getAll('categories')
      dispatch(getAllCategoriesSuccess(categories))
    } catch (error) {
      console.log(error)
      dispatch(getAllCategoriesFailure(error))
    }
  }
}

export const addCategory = (category) => {
  return async (dispatch) => {
    dispatch(addCategoryBegin())
    try {
      category = await entityService.addEntity('categories', category)
      dispatch(addCategorySuccess(category))
      dispatch(getAllCategories())
    } catch (error) {
      console.log(error)
      dispatch(addCategoryFailure(error))
    }
  }
}

export const updateCategory = (category) => {
  return async (dispatch) => {
    dispatch(updateCategoryBegin())
    try {
      category = await entityService.updateEntity('categories', category)
      dispatch(updateCategorySuccess(category))
      dispatch(getAllCategories())
    } catch (error) {
      console.log(error)
      dispatch(updateCategoryFailure(error))
    }
  }
}

export const deleteCategory = (id) => {
  return async (dispatch) => {
    dispatch(deleteCategoryBegin())
    try {
      await entityService.removeEntity('categories', id)
      dispatch(deleteCategorySuccess(id))
      dispatch(getAllCategories())
    } catch (error) {
      console.log(error)
      dispatch(deleteCategoryFailure(error))
    }
  }
}