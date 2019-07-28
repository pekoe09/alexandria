import React from 'react'
import {Row, Col, Modal} from 'react-bootstrap'
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
              getCriteriaForm={this.props.getCriteriaForm}
            />
          </Row>
          <Row>
            <Col md={9}>
              <GraphContainer 
                getCharts={this.props.getCharts}
              />
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
  getCriteriaForm: PropTypes.func.isRequired,
  getCharts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      call: PropTypes.func.isRequired
    })
  ).isRequired,
  modalIsOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired
}