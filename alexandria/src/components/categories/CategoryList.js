import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  ListTable,
  ViewHeader,
  StyledButton
} from '../common/alexandriaComponents'
import '../common/alexandria-react-table.css'
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory
} from '../../actions/categoryActions'
import CategoryEdit from './CategoryEdit'
import DeletionConfirmation from '../common/DeletionConfirmation'

class CategoryList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editModalIsOpen: false,
      rowToEdit: null,
      modalError: '',
      deletionTargetId: '',
      deletionTargetName: '',
      deletionConfirmationIsOpen: false
    }
  }

  componentDidMount = async () => {
    await this.props.getAllCategories()
  }

  toggleEditModalOpen = () => {
    this.setState({
      modalError: '',
      editModalIsOpen: !this.state.editModalIsOpen,
      rowToEdit: null
    })
  }

  handleSave = async (category) => {
    if (category._id) {
      await this.props.updateCategory(category)
    } else {
      await this.props.addCategory(category)
    }
    if (this.props.error) {
      this.setState({ modalError: 'Could not save the category' })
    }
  }

  handleRowClick = (state, rowInfo) => {
    return {
      onClick: (e) => {
        this.setState({
          editModalIsOpen: true,
          rowToEdit: rowInfo.original,
          modalError: ''
        })
      }
    }
  }

  handleDeleteRequest = (item, e) => {
    e.stopPropagation()
    this.setState({
      deletionTargetId: item._id,
      deletionTargetName: item.name,
      deletionConfirmationIsOpen: true
    })
  }

  handleDeleteConfirmation = async (isConfirmed) => {
    if (isConfirmed) {
      await this.props.deleteCategory(this.state.deletionTargetId)
    }
    this.setState({
      deletionConfirmationIsOpen: false,
      deletionTargetId: '',
      deletionTargetName: ''
    })
  }

  columns = [
    {
      Header: 'Name',
      accessor: 'name',
      style: {
        textAlign: 'center'
      }
    },
    {
      Header: 'Level',
      accessor: 'level',
      style: {
        textAlign: 'center'
      }
    },
    {
      Header: 'Number',
      accessor: 'number',
      style: {
        textAlign: 'center'
      }
    },
    {
      Header: '',
      accessor: 'delete',
      Cell: (row) => (
        <StyledButton
          onClick={(e) => this.handleDeleteRequest(row.original, e)}
          bsstyle='rowdanger'
        >
          Delete
        </StyledButton>
      ),
      style: {
        textAlign: 'center'
      },
      sortable: false,
      filterable: false,
      maxWidth: 80
    }
  ]

  render() {
    return (
      <React.Fragment>
        <ViewHeader text='Categorys' />
        <StyledButton
          bsstyle='primary'
          onClick={this.toggleEditModalOpen}
          style={{ marginLeft: 10 }}
        >
          Add category
        </StyledButton>
        <ListTable
          data={this.props.categories}
          columns={this.columns}
          getTrProps={this.handleRowClick}
          defaultPageSize={20}
          minRows={1}
        />
        <CategoryEdit
          category={this.state.rowToEdit}
          modalIsOpen={this.state.editModalIsOpen}
          closeModal={this.toggleEditModalOpen}
          handleSave={this.handleSave}
          modalError={this.state.modalError}
        />
        <DeletionConfirmation
          headerText={`Deleting ${this.state.deletionTargetName}`}
          bodyText='Are you sure you want to go ahead and delete this?'
          modalIsOpen={this.state.deletionConfirmationIsOpen}
          closeModal={this.handleDeleteConfirmation}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = store => ({
  categories: store.categories.items,
  loading: store.categories.loading,
  error: store.categories.error
})

export default withRouter(connect(
  mapStateToProps,
  {
    getAllCategories,
    addCategory,
    updateCategory,
    deleteCategory
  }
)(CategoryList))