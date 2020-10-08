import moment from "moment";
import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import apiService from '../../../services/api.service';
import { routeToPage } from '../../../utils/util';
import LeftColumnTableList from "../../utility/LeftColumnTableListComponent/LeftColumnTableList";
import styles from "./ReservationReport.module.css";

class ReservationReport extends Component {
  constructor(props) {
    super(props);
    let from_date = new Date();
    let tmp = new Date(from_date);
    let to_date = new Date(tmp.setDate(from_date.getDate() + 10));
    var initial_data = [[{ date: '', '1': 0 }], [''], ['']];
    this.state = {
      from_date: from_date.toISOString().slice(0, 10),
      to_date: to_date.toISOString().slice(0, 10),
      fromDateDisplay: "",
      toDateDisplay: "",
      showModal: false,
      modalMessage: 'Nội dung cần thông báo',
      searchData: initial_data,
      isValidDate: true
    };
    this.handleSearchByDate = this.handleSearchByDate.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  setShow = (showHide) => {
    this.updateState("showModal", showHide);
  }
  handleSearchByDate = (event) => {
    event.preventDefault();
    if (this.state.isValidDate) {
      this.requestData();
    } else {
      alert(`Ngày chọn không hợp lệ! Vui lòng chọn lại ngày trước khi cập nhật dữ liệu`);
    }
  }

  componentDidMount() {
    this.requestData();
  }

  updateState(key, value) {
    this.setState({
      [key]: value
    });
  }

  requestData() {
    apiService.getRoomServiceBookingStatus(this.state.from_date, this.state.to_date).then(response => {
      if (response.status === 200) {
        this.updateState("fromDateDisplay", moment(this.state.from_date).format("DD-MM-YYYY"));
        this.updateState("toDateDisplay", moment(this.state.to_date).format("DD-MM-YYYY"));
        this.updateState("searchData", response.data);
      }
    }).catch(err => {
      console.log(err);
    });
  }

  handleChange = (event) => {
    setTimeout(() => {
      this.checkValidation();
    });
    this.updateState(event.target.name, event.target.value);
  }

  checkValidation() {
    let isValidDate = false;
    const fromDate = new Date(this.state.from_date);
    const toDate = new Date(this.state.to_date);
    isValidDate = toDate.getTime() >= fromDate.getTime();
    this.updateState('isValidDate', isValidDate);
    return isValidDate;
  }

  render() {
    return (
      <Container>
        <Row className="mb-2">
          <Col>
            <h3 className="mt-3">Tình hình đặt phòng</h3>
            <form>
              <div className={"input-group mb-3"}>
                <div className={styles.inputGroupItem}>
                  <div className="input-group-prepend">
                    <span className="input-group-text">Từ ngày:</span>
                  </div>
                  <input type="date" name="from_date" date-format="dd/mm/yy" placeholder="Chọn ngày" value={this.state.from_date} required
                    className={"form-control " + (this.state.isValidDate ? "" : styles.alertErrorByBorder)}
                    onChange={this.handleChange} />
                  <div className={styles.dateDisplay}>{moment(this.state.from_date).format("DD-MM-YYYY")}</div>
                  {this.state.isValidDate ? null : <div className={styles.alertErrorByText}>Ngày không hợp lệ</div>}
                </div>
                <div className={styles.inputGroupItem}>
                  <div className="input-group-prepend">
                    <span className="input-group-text">Đến ngày:</span>
                  </div>
                  <input type="date" name="to_date" placeholder="Chọn ngày" value={this.state.to_date} required
                    className={"form-control " + (this.state.isValidDate ? "" : styles.alertErrorByBorder)}
                    onChange={this.handleChange}
                  />
                  <div className={styles.dateDisplay}>{moment(this.state.to_date).format("DD-MM-YYYY")}</div>
                  {this.state.isValidDate ? null : <div className={styles.alertErrorByText}>Ngày không hợp lệ</div>}
                </div>
                <button className="btn btn-primary" onClick={this.handleSearchByDate}>Xem dữ liệu</button>
              </div>
            </form>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="mb-1">Kết quả tìm kiếm từ ngày {this.state.fromDateDisplay} đến ngày {this.state.toDateDisplay}</div>
            <LeftColumnTableList header={this.state.searchData[2]} data={this.state.searchData[0]} searchBooking={(date) => {
              routeToPage(this.props.history, `/booking_search?search_type=room_night&&search_value=${date}`);
            }} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ReservationReport;
