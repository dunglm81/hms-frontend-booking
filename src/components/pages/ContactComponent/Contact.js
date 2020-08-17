import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import apiService from "../../../services/api.service";
import AlertMessage from "../../utility/AlertMessage";


class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guest_name: "",
      phone: "",
      email: "",
      category: "person",
      showAlert: false,
      alertMessage: "Nội dung cần thông báo",
      alertHeading: "Lưu ý"
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  setShowHideAlert = showHide => {
    this.setState({ showAlert: showHide });
  };

  handleSubmit = event => {
    event.preventDefault();

    apiService.createNewContact(this.state).then((response) => {
      if (response.status === 200) {
        var message = response.data;
        this.setState({ alertMessage: message });
        this.setShowHideAlert(true);
      }
    }).catch(error => {
      if (error.response.status === 409) {
        var message = error.response.data;
        this.setState({ alertMessage: message });
        this.setShowHideAlert(true);
      }
      if (error.response.status === 422) {
        let message = "Dữ liệu không đúng quy cách";
        this.setState({ alertMessage: message });
        this.setShowHideAlert(true);
      } else {
        let message = error.response.statusText;
        this.setState({ alertMessage: message });
        this.setShowHideAlert(true);
      }
    });
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h1>Tạo thông tin khách hàng</h1>
            <form>
              <div className="form-group">
                <label>Tên KH:</label>
                <input
                  type="text"
                  className="form-control"
                  name="guest_name"
                  placeholder="Nhập tên KH"
                  onChange={this.handleChange}
                  value={this.state.guest_name}
                  required
                />
              </div>
              <div className="form-group">
                <label>Điện thoại:</label>
                <input
                  type="number"
                  className="form-control"
                  name="phone"
                  placeholder="Nhập số điện thoại"
                  onChange={this.handleChange}
                  value={this.state.phone}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Nhập số email"
                  onChange={this.handleChange}
                  value={this.state.email}
                />
              </div>
              <div className="form-group">
                <label>Loại KH:</label>
                <select
                  className="form-control"
                  name="category"
                  onChange={this.handleChange}
                  value={this.state.category}
                >
                  <option value="person">Cá nhân</option>
                  <option value="business">Doanh nghiệp</option>
                </select>
              </div>
              <button className="btn btn-primary" onClick={this.handleSubmit}>
                Lưu dữ liệu
              </button>
            </form>
            <AlertMessage
              show={this.state.showAlert}
              onClick={this.setShowHideAlert.bind(this, false)}
              alertContent={this.state.alertMessage}
              variant="warning"
              heading={this.state.alertHeading}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Contact;
