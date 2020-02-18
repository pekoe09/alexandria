import React from 'react'
import { connect } from 'react-redux'
import LocationList from './LocationList'
import LocationEdit from './LocationEdit'
import withCRUD from '../common/withCRUD'
import withDeletion from '../common/withDeletion'
import withEditRows from '../common/withEditRows'
import withRelatedBooks from '../common/withRelatedBooks'
import {
  addLocation,
  getAllLocations,
  updateLocation,
  deleteLocation
} from '../../actions/locationActions'

const defaultSort = (a, b) => a.fullName > b.fullName
  ? 1
  : (a.fullName < b.fullName
    ? -1
    : 0
  )

const filterBooks = (book, locationId) => {

}

const Locations = props => {
  const LocationsWrapped = withCRUD(withDeletion(withRelatedBooks(withEditRows(LocationList, LocationEdit))))
  return (
    <LocationsWrapped
      repository={'locations'}
      defaultSort={defaultSort}
      addItem={props.addLocation}
      getAllItems={props.getAllLocations}
      updateItem={props.updateLocation}
      deleteItem={props.deleteLocation}
      filterBooks={filterBooks}
    />
  )
}

export default connect(
  null,
  {
    addLocation,
    getAllLocations,
    updateLocation,
    deleteLocation
  }
)(Locations)