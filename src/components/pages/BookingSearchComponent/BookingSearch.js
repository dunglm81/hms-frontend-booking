import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import api_instance from '../../../utils/api';
import styles from './BookingSearch.module.css';

class BookingSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTable: true,
            contact_name: '',
            contact_phone: '',
            room_night: '',
            checkin: '',
            checkout: '',
            active_field: '',
            resultArr: []
        }
    }

    handleChangeAutoCompleteInput(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleOnFocus(event) {
        this.setState({
            active_field: event.target.name
        })

        for (const key in this.state) {
            if (this.state.hasOwnProperty(key)) {
                if (key !== 'showTable' && key !== 'active_field' && key !== 'resultArr') {
                    this.setState({
                        [key]: ''
                    });
                }
            }
        }
    }

    searchBooking() {
        const searchType = this.state.active_field;
        const searchValue = this.state[searchType];
        api_instance.get(`/api/booking_search?search_type=${searchType}&search_value=${searchValue}`)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        resultArr: response.data
                    })
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    render() {
        return (
            <>
                <Container>
                    <Row>
                        <Col>
                            <h2>Truy vấn Booking</h2>
                            <div className={styles.inputGroup + ' d-flex flex-row flex-wrap w-100'}>
                                <div className={'d-flex flex-row flex-nowrap align-items-center'}>
                                    <div>Số điện thoại:</div>
                                    <input className="form-control" type="text" onFocus={(e) => { this.handleOnFocus(e) }} onChange={(e) => { this.handleChangeAutoCompleteInput(e) }} value={this.state.contact_phone} name="contact_phone" />
                                </div>
                                <div className={'d-flex flex-row flex-nowrap align-items-center'}>
                                    <div>Khách hàng:</div>
                                    <input className="form-control" type="text" onFocus={(e) => { this.handleOnFocus(e) }} onChange={(e) => { this.handleChangeAutoCompleteInput(e) }} value={this.state.contact_name} name="contact_name" />
                                </div>
                                <div className={'d-flex flex-row flex-nowrap align-items-center'}>
                                    <div>Đêm ở:</div>
                                    <input className="form-control" type="date" onFocus={(e) => { this.handleOnFocus(e) }} onChange={(e) => { this.handleChangeAutoCompleteInput(e) }} value={this.state.room_night} name="room_night" />
                                </div>
                                <div className={'d-flex flex-row flex-nowrap align-items-center'}>
                                    <div>Ngày checkin:</div>
                                    <input className="form-control" type="date" onFocus={(e) => { this.handleOnFocus(e) }} onChange={(e) => { this.handleChangeAutoCompleteInput(e) }} value={this.state.checkin} name="checkin" />
                                </div>
                                <div className={'d-flex flex-row flex-nowrap align-items-center'}>
                                    <div>Ngày checkout:</div>
                                    <input className="form-control" type="date" onFocus={(e) => { this.handleOnFocus(e) }} onChange={(e) => { this.handleChangeAutoCompleteInput(e) }} value={this.state.checkout} name="checkout" />
                                </div>
                                <div className={'d-flex flex-row flex-nowrap align-items-center'}>
                                    <div></div>
                                    <button className="btn btn-primary" onClick={() => { this.searchBooking() }}>Truy vấn</button>
                                </div>

                            </div>
                        </Col>
                    </Row>

                    {this.state.showTable ? <Row>
                        <div className="table-responsive">
                            <table className="table table-sm table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">Tên khách hàng</th>
                                        <th scope="col">Số ĐT</th>
                                        <th scope="col">Ngày checkin</th>
                                        <th scope="col">Ngày checkout</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        (this.state.resultArr || []).map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{item.contact_name}</td>
                                                    <td>{item.contact_phone}</td>
                                                    <td>{item.checkin_date}</td>
                                                    <td>{item.checkout_date}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Row> : null}
                </Container>
            </>
        )
    }
}

export default BookingSearch;