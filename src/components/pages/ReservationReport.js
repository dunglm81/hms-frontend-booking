import React, { Component} from 'react';
import api_instance from '../../utils/api';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LeftColumnTableList from '../utility/LeftColumnTableList';

class ReservationReport extends Component {
  constructor(props){
    super(props);
    let from_date = new Date();
    let tmp = new Date(from_date);
    let to_date = new Date(tmp.setDate(from_date.getDate() + 10));
    var initial_data = [[{date:'','1':0}],[''],['']];
    this.state = {from_date:from_date.toISOString().slice(0, 10),to_date:to_date.toISOString().slice(0, 10),showModal:false,modalMessage:'Nội dung cần thông báo',searchData:initial_data};
    this.handleSearchByDate = this.handleSearchByDate.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }
  setShow = (showHide) => {
    this.setState({showModal:showHide});
  }
  handleSearchByDate = (event) => {
    event.preventDefault();
    this.requestData();
  }

  componentDidMount(){
    this.requestData();
  }

  requestData() {
    var get_params = `?from_date=${this.state.from_date}&to_date=${this.state.to_date}`;

    api_instance.get(`room_service_booking_status${get_params}`)
    .then((response) => {
      if(response.status === 200){
        this.setState({
          searchData:response.data
        });
      }
    })
    .catch((error) => {
      console.log(error);
      var message;
      if (error.response.status === 409) {
        message = error.response.data;
        this.setState({modalMessage:message});
      } else {
        this.setState({modalMessage:error});
      }

      this.setShow(true);
    });
  }

  handleChange = (event)=>{
    this.setState({
      [event.target.name]:event.target.value
    });
  }
  render(){
    return(
      <Container>
        <Row>
          <Col>
            <h1>Tình hình đặt phòng</h1>
            <form>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">Từ ngày:</span>
                </div>
                <input  type="date" className="form-control"  name="from_date" placeholder="Chọn ngày" onChange={this.handleChange}  value={this.state.from_date} required/>
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">Đến ngày:</span>
                </div>
                <input  type="date" className="form-control"  name="to_date" placeholder="Chọn ngày" onChange={this.handleChange}  value={this.state.to_date} required/>
                <button className="btn btn-primary" onClick={this.handleSearchByDate}>Xem dữ liệu</button>
              </div>
            </form>
          </Col>
        </Row>
        <Row>
          <Col>
          Kết quả tìm kiếm từ ngày {this.state.from_date} đến ngày {this.state.to_date}
          <LeftColumnTableList header={this.state.searchData[2]} data={this.state.searchData[0]}/>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ReservationReport;
