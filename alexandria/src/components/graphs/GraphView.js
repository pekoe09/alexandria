import React from 'react'
import {Row, Col, Modal} from 'react-bootstrap'
import {StyledForm} from '../common/alexandriaComponents'
import PropTypes from 'prop-types'
import GraphCriteria from './GraphCriteria'
import GraphContainer from './GraphContainer'
import KPIContainer from './KPIContainer'

class GraphView extends React.Component {
  render() {
    return (
      <Modal
        show={this.props.modalIsOpen}
        onHide={this.props.closeModal}
        animation={false}
        dialogClassName="wide-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <GraphCriteria 
              criteriaForm={this.props.criteriaForm}
            />
          </Row>
          <Row>
            <Col md={9}>
              <GraphContainer />
            </Col>
            <Col md={3}>
              <KPIContainer />
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    )
  }
}

export default GraphView

GraphView.propTypes = {
  title: PropTypes.string,
  criteriaForm: PropTypes.instanceOf(StyledForm).isRequired,
  modalIsOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired
}