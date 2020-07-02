import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import api_instance from '../../../utils/api';
import styles from './CreateBooking.module.css';

class CreateBooking extends Component {
    constructor(props) {
        super(props);
        let from_date = new Date("2020-06-11");
        let tmp = new Date(from_date);
        let to_date = new Date(tmp.setDate(from_date.getDate() + 2));

        this.state = {
            titleArr: [],
            typeArr: [],
            bodyArr: [],
            fromDate: from_date.toISOString().slice(0, 10),
            toDate: to_date.toISOString().slice(0, 10),
            autocompleteData: [],
            showAutocomplete: false,
            autoCompleteValue: '',
            contactId: -1,
            description: '',
            bookingArr: []
        }
    }

    handleChangeAutoCompleteInput = (event) => {
        const value = event.target.value;
        this.setState({
            autoCompleteValue: value
        })
        if (value.length > 6) {
            this.getCustomer(value);
        } else {
            this.setState({
                showAutocomplete: false
            })
        }
    }

    handleSearchByDate = (event) => {
        event.preventDefault();
        this.requestData();
    }

    componentDidMount() {
        this.requestData();
    }

    getCustomer(name) {
        var get_params = `?contact_name=${name}&current_page=1&page_size=20`;

        api_instance.get(`api/search_contact_by_name_paging${get_params}`)
            .then((response) => {
                if (response.status === 200) {
                    if (response.data[4].length > 0) {
                        this.setState({
                            autocompleteData: response.data[4],
                            showAutocomplete: true
                        });
                    } else {
                        this.setState({
                            showAutocomplete: false
                        })
                    }

                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    requestData() {
        var get_params = `?from_date=${this.state.fromDate}&to_date=${this.state.toDate}`;
        api_instance.get(`api/room_service_booking_status${get_params}`)
            .then((response) => {
                if (response.status === 200) {
                    const data = response.data;
                    if (data) {
                        this.setState({
                            titleArr: data[1],
                            typeArr: data[3],
                            bodyArr: data[0]
                        });
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    handleBookingDataInput(event, typeInput, date, serviceId) {
        let arr = [...this.state.bookingArr];
        const idx = arr.findIndex(item => item.service_id === serviceId && item.using_date === date);
        if (idx === -1) {
            arr.push({
                service_id: serviceId,
                using_date: date,
                [typeInput]: event.target.value
            })
        } else {
            arr[idx][typeInput] = event.target.value;
        }

        this.setState({
            bookingArr: arr
        });
    }

    handleChangeDate(value, typeDate) {
        this.setState({
            [typeDate]: value
        })
    }

    handleInputData = (event) => {
        const submitObj = {
            contact_id: this.state.contactId,
            checkin_date: this.state.fromDate,
            checkout_date: this.state.toDate,
            description: this.state.description,
            booking_room_items: this.state.bookingArr
        }
        this.createBookingRequest(submitObj);
    }

    createBookingRequest(data) {
        api_instance.post(`api/new_booking`, data)
            .then((response) => {
                if (response.status === 200) {
                    setTimeout(() => {
                        this.props.history.push('/viewbooking');
                    }, 1000);
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    handleSelectAutoCompleteItem(item) {
        if (item && item.contact_id) {
            this.setState({
                showAutocomplete: false,
                autoCompleteValue: item.contact_name,
                contactId: item.contact_id
            })
        }
    }

    handleChangeNoteInput = (event) => {
        if (event.target.value) {
            this.setState({
                description: event.target.value
            })
        }
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <h1>Tạo booking</h1>
                        <div className="mb-3">
                            <div className="d-flex flex-row align-items-center mr-2">Khách hàng:</div>
                            <input type="text" className="" onChange={this.handleChangeAutoCompleteInput} value={this.state.autoCompleteValue} />
                            {this.state.showAutocomplete && this.state.autocompleteData.length > 0 ?
                                <div className={styles.datalistPopup}>
                                    {(this.state.autocompleteData || []).map((item, idx) => {
                                        return (
                                            <div key={idx} onClick={() => {
                                                this.handleSelectAutoCompleteItem(item);
                                            }}>{item.contact_name}</div>
                                        )
                                    })}
                                </div>
                                : null}
                        </div>

                        <div className="input-group mb-3">
                            <div className="d-flex flex-row align-items-center mr-2">Ngày đến:</div>
                            <input type="date" className="" name="from_date" placeholder="Chọn ngày" onChange={(e) => this.handleChangeDate(e.target.value, 'fromDate')} value={this.state.fromDate} required />
                            <div className="d-flex flex-row align-items-center mr-2 ml-5">Ngày đi:</div>
                            <input type="date" className="" name="to_date" placeholder="Chọn ngày" onChange={(e) => this.handleChangeDate(e.target.value, 'toDate')} value={this.state.toDate} required />
                            <button className="btn btn-primary ml-3" onClick={this.handleSearchByDate}>Xem dữ liệu</button>
                        </div>
                        <div className="input-group mb-3">
                            <div className="d-flex flex-row align-items-center mr-2">Ghi chú:</div>
                            <input type="text" className="" onChange={this.handleChangeNoteInput} />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <div className="table-responsive">
                        <table className="table table-sm table-hover">
                            <thead>
                                <tr>
                                    <th scope="col"></th>
                                    {(this.state.titleArr || []).map((item, index1) => { return <th scope="col" key={index1}>{item}</th> })}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (this.state.typeArr || []).map((item, index2) => {
                                        return (
                                            <tr key={index2}>
                                                <th scope="row">{item.service_name}</th>
                                                {(this.state.bodyArr || []).map((item1, index3) => {
                                                    return (
                                                        <td key={index3}>
                                                            {item1[item.service_name]}
                                                            {(index3 > 0 && index3 < this.state.bodyArr.length - 1) ? <div>
                                                                <div>SL:</div>
                                                                <input className="form-control" onChange={(e) => this.handleBookingDataInput(e, 'quantity', item1.date, item.service_id)} name={item.service_name} />
                                                                <div>ĐG:</div>
                                                                <input className="form-control" onChange={(e) => this.handleBookingDataInput(e, 'unit_price', item1.date, item.service_id)} name={item.service_name} />
                                                                <div>Miêu tả:</div>
                                                                <input className="form-control" onChange={(e) => this.handleBookingDataInput(e, 'description', item1.date, item.service_id)} name={item.service_name} />
                                                            </div> : null}
                                                        </td>
                                                    )
                                                })}
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        <button className="btn btn-primary" onClick={this.handleInputData}>Lưu dữ liệu</button>
                    </div>
                </Row>
            </Container>
        )
    }
}

export default CreateBooking;