import React, { Component} from 'react';
import api_instance from '../../utils/api';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import queryString from 'query-string';

class ReservationDetail extends Component {
  constructor(props){
    super(props);
    this.state = {booking_id:'',checkin_date:'',checkout_date:''};

  }
  componentDidMount(){
    let params = queryString.parse(this.props.location.search);
    if(params.booking_id){
      this.setState({booking_id:params.booking_id});
      //display booking info
    } else {
      //display New booking
      console.log("New booking");
      this.newBooking();
    }

  }
  handleChange = (event) => {
    this.setState({
        [event.target.name]: event.target.value
      });
  }
  render(){
    return(
      <div></div>
    )
  }
  newBooking = () => {
    return (
      <Container>
        <Row>
          <Col>
            <h1>Tạo booking</h1>
            <form>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">Ngày checking:</span>
                </div>
                <input  type="date" className="form-control"  name="from_date" placeholder="Chọn ngày" onChange={this.handleChange}  value={this.state.checking_date} required/>
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">Ngày checkout:</span>
                </div>
                <input  type="date" className="form-control"  name="to_date" placeholder="Chọn ngày" onChange={this.handleChange}  value={this.state.checkout_date} required/>
                <button className="btn btn-primary" onClick={this.handleChange}>Xem dữ liệu</button>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    )
  }
}
export default ReservationDetail;
