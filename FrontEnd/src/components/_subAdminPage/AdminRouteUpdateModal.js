import React, { Component } from "react";
import { connect } from "react-redux";

import { Button, Modal, Alert, Spinner, Form } from "react-bootstrap";

import { actionUpdateRoute, actionGetRoutes } from "../../_actions/Route";
import { FaPencilAlt } from "react-icons/fa";

import { actionGetStations } from "../../_actions/Station";
import { actionGetTrains } from "../../_actions/Train";

class DeleteModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      train_id: 1,
      price: "",
      starting_point: 1,
      destination: 2,
      start_time: "",
      arrived: ""
    };
  }
  componentDidMount = () => {
    const { train, price, start, dest, start_time, arrived } = this.props.data;
    this.setState({
      train_id: train.id,
      price,
      starting_point: start.id,
      destination: dest.id,
      start_time,
      arrived
    });
    this.props.actionGetStations();
    this.props.actionGetTrains();
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleFormSubmit = async e => {
    e.preventDefault();
    const dataroute = { id: this.props.data.id, data: this.state };
    await this.props.actionUpdateRoute(dataroute);
    // console.log(this.state );
    // console.log(this.props.route.update_route.status);
    if (this.props.route.update_route.status) {
      this.modalClose();
      await this.props.actionGetRoutes();
    }
  };

  modalClose = () => {
    this.setState({
      modal: false
    });
  };

  modalShow = () => {
    this.setState({
      modal: true
    });
  };

  render() {
    // const { loading, message, message_status } = this.props.auth;
    const { data: stations } = this.props.station;
    const { data: trains } = this.props.train;
    return (
      <>
        <Modal
          show={this.state.modal}
          onHide={this.modalClose}
          animation={false}
        >
          <Modal.Body>
            <div className="table-wrapper">
              <div className="table-title">
                <div className="row">
                  <div className="col-sm-5">
                    <h2>
                      Route <b>Update</b>
                    </h2>
                  </div>
                  <div className="col-sm-7">
                    <Button
                      className="btn btn-primary"
                      onClick={this.modalClose}
                    >
                      <span>Back</span>
                    </Button>
                  </div>
                </div>
              </div>
              <Form onSubmit={this.handleFormSubmit}>
                <Form.Group>
                  <Form.Label>Train</Form.Label>
                  <Form.Control
                    as="select"
                    name="train_id"
                    id="train_id"
                    onChange={this.handleChange}
                    value={this.state.train_id}
                    required
                  >
                    {trains.map(function(value, index) {
                      return (
                        <option value={value.id} key={index}>
                          {value.name} - {value.category} ({value.seats})
                        </option>
                      );
                    })}
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    id="price"
                    onChange={this.handleChange}
                    value={this.state.price}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Start Point</Form.Label>
                  <Form.Control
                    as="select"
                    name="starting_point"
                    id="starting_point"
                    onChange={this.handleChange}
                    value={this.state.starting_point}
                    required
                  >
                    {stations.map(function(value, index) {
                      return (
                        <option value={value.id} key={index}>
                          {value.area} ({value.code}) - {value.name}
                        </option>
                      );
                    })}
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Destination</Form.Label>
                  <Form.Control
                    as="select"
                    name="destination"
                    id="destination"
                    onChange={this.handleChange}
                    value={this.state.destination}
                    required
                  >
                    {stations.map(function(value, index) {
                      return (
                        <option value={value.id} key={index}>
                          {value.area} ({value.code}) - {value.name}
                        </option>
                      );
                    })}
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Time Start</Form.Label>
                  <Form.Control
                    type="text"
                    name="start_time"
                    id="start_time"
                    onChange={this.handleChange}
                    value={this.state.start_time}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Arrived</Form.Label>
                  <Form.Control
                    type="text"
                    name="arrived"
                    id="arrived"
                    onChange={this.handleChange}
                    value={this.state.arrived}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Button type="submit" id="add-form-button">
                    Update
                  </Button>
                </Form.Group>
              </Form>
            </div>
          </Modal.Body>
        </Modal>
        <Button variant="light" onClick={this.modalShow}>
          <FaPencilAlt />
        </Button>
      </>
    );
  }
}

const mapStateToProps = state => {
  return { station: state.station, train: state.train, route: state.route };
};

function mapDispatchToProps(dispatch) {
  return {
    actionGetStations: () => dispatch(actionGetStations()),
    actionGetTrains: () => dispatch(actionGetTrains()),
    actionUpdateRoute: data => dispatch(actionUpdateRoute(data)),
    actionGetRoutes: () => dispatch(actionGetRoutes())
  };
}

const RouteUpdateModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteModal);

export default RouteUpdateModal;
