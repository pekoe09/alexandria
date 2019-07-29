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
import ViewBar from '../common/ViewBar'
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
      deletionConfirmationIsOpen: false,
      searchPhrase: '',
      searchPhraseToUse: ''
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

  handlePhraseChange = searchPhraseEvent => {
    let searchPhrase = searchPhraseEvent.target.value
    if (searchPhrase.trim().length > 0) {
      this.setState({ searchPhrase })
    } else {
      this.setState({ searchPhrase: '' })
    }
  }

  handleSearch = () => {
    this.setState({ searchPhraseToUse: this.state.searchPhrase })
  }

  getFilteredCategories = () => {
    let searchPhrase = this.state.searchPhraseToUse.toLowerCase()
    let filtered = this.props.categories
    if (this.state.searchPhraseToUse.length > 0) {
      filtered = this.props.categories.filter(c =>
        c.name.toLowerCase().includes(searchPhrase)
      )
    }
    return filtered
  }

  columns = [
    {
      Header: 'Name',
      accessor: 'name',
      headerStyle: {
        textAlign: 'left'
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
      Header: 'Code',
      accessor: 'code',
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
        <ViewBar
          headerText='Categories'
          addBtnText='Add category'
          handleOpenEdit={this.toggleEditModalOpen}
          handlePhraseChange={this.handlePhraseChange}
          handleSearch={this.handleSearch}
          searchPhrase={this.state.searchPhrase}
        />
        <ListTable
          data={this.getFilteredCategories()}
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
  categories: store.categories.items.sort((a, b) => a.code > b.code ? 1 : (a.code < b.code ? -1 : 0)),
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