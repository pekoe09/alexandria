import React from 'react'
import { connect } from 'react-redux'
import LocationList from './LocationList'
import withCRUD from '../common/withCRUD'
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

const Locations = props => {
  const LocationsWrapped = withCRUD(LocationList)
  return (
    <LocationsWrapped
      repository={'locations'}
      defaultSort={defaultSort}
      addItem={props.addLocation}
      getAllItems={props.getAllLocations}
      updateItem={props.updateLocation}
      deleteItem={props.deleteLocation}
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