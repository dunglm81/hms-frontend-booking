import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import apiService from '../../../services/api.service';
import api_instance from '../../../utils/api';
import { routeToPage } from '../../../utils/util';
import AddItemModal from '../../utility/AddItemModalComponent/AddItemModal';
import styles from './CreateBooking.module.css';


class CreateBooking extends Component {
    constructor(props) {
        super(props);
        let from_date = new Date();
        let tmp = new Date(from_date);
        let to_date = new Date(tmp.setDate(from_date.getDate() + 2));

        this.state = {
            titleArr: [],
            typeArr: [],
            bodyArr: [],
            fromDate: from_date.toISOString().slice(0, 10),
            toDate: to_date.toISOString().slice(0, 10),
            autoNameData: [],
            autoPhoneData: [],
            showAutoName: false,
            showAutoPhone: false,
            autoNameValue: '',
            autoPhoneValue: '',
            contactId: -1,
            description: '',
            showTable: false,
            showAddContactModal: false
        }
    }

    handleChangeAutoCompleteInput = (event) => {
        const type = event.target.name;
        const value = event.target.value;

        switch (type) {
            case 'name':
                this.setState({
                    autoNameValue: value
                })
                if (value.length > 6) {
                    this.getCustomer(value, 'contact_name');
                } else {
                    this.setState({
                        showAutoName: false
                    })
                }
                break;
            case 'phone':
                this.setState({
                    autoPhoneValue: value
                })
                if (value.length > 1) {
                    this.getCustomer(value, 'contact_phone');
                } else {
                    this.setState({
                        showAutoPhone: false
                    })
                }
                break;
            default:
        }

    }

    handleSearchByDate = (event) => {
        event.preventDefault();
        this.requestData();
    }

    getCustomer(value, path) {
        var get_params = `?${path}=${value}&current_page=1&page_size=20`;

        switch (path) {
            case 'contact_name':
                api_instance.get(`api/search_contact_by_name_paging${get_params}`)
                    .then((response) => {
                        if (response.status === 200) {
                            if (response.data[4].length > 0) {
                                this.setState({
                                    autoNameData: response.data[4],
                                    showAutoName: true
                                });
                            } else {
                                this.setState({
                                    showAutoName: false
                                })
                            }

                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                break;
            case 'contact_phone':
                api_instance.get(`api/search_contact_by_phone_paging${get_params}`)
                    .then((response) => {
                        if (response.status === 200) {
                            if (response.data[4].length > 0) {
                                this.setState({
                                    autoPhoneData: response.data[4],
                                    showAutoPhone: true
                                });
                            } else {
                                this.setState({
                                    showAutoPhone: false
                                })
                            }
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                break;
            default:
        }
    }

    requestData() {
        const fromDate = new Date(this.state.fromDate);
        const tmp = fromDate.setDate(fromDate.getDate() - 1);
        const yesterday = new Date(tmp).toISOString().slice(0, 10);
        const get_params = `?from_date=${yesterday}&to_date=${this.state.toDate}`;

        api_instance.get(`api/room_service_booking_status${get_params}`)
            .then((response) => {
                if (response.status === 200) {
                    let data = response.data;
                    data = this.createBookingArr(data);
                    if (data) {
                        this.setState({
                            titleArr: data[1],
                            typeArr: data[3],
                            bodyArr: data[0],
                            showTable: true
                        });
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    createBookingArr(data) {
        const usingDateArr = data[1];
        const arr = usingDateArr.map(item => {
            return {
                using_date: item,
                quantity: 0,
                unit_price: 0,
                description: ''
            };
        })

        data[3] = data[3].map(item => {
            item.data = arr.map(item1 => {
                const idx1 = data[0].findIndex(item2 => item2.date === item1.using_date);
                if (idx1 !== -1) {
                    item1[item.service_name] = data[0][idx1][item.service_name];
                }
                return item1;
            })
            return item;
        })
        return data;
    }

    handleBookingDataInput(event, typeInput, date, serviceId) {
        let arr = JSON.parse(JSON.stringify(this.state.typeArr));
        const idx = arr.findIndex(item => item.service_id === serviceId);

        if (idx !== -1) {
            let dataArr = arr[idx].data;
            const idx1 = dataArr.findIndex(item1 => item1.using_date === date);
            if (idx1 !== -1) {
                dataArr = dataArr.map((item2, idx2) => {
                    if (idx2 > 0 && idx2 < dataArr.length - 1) {
                        if ((typeInput === 'quantity' || typeInput === 'unit_price') && idx2 >= idx1) {
                            item2[typeInput] = event.target.value;
                        } else if (idx2 === idx1) {
                            item2[typeInput] = event.target.value;
                        }
                    }
                    return item2;
                });
            }

            arr[idx].data = dataArr;
            this.setState({
                typeArr: arr
            });
        }
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
            booking_room_items: this.convertBookingArr()
        }
        this.createBookingRequest(submitObj);
    }

    convertBookingArr() {
        let arr = JSON.parse(JSON.stringify(this.state.typeArr));
        const bookingRoomItems = arr.reduce((finalList, item) => {
            const bookingRoomItem = item.data.filter((item1, idx1) => 0 < idx1 && idx1 < item.data.length - 1)
                .map(item1 => {
                    return {
                        service_id: item.service_id,
                        using_date: item1.using_date,
                        quantity: item1.quantity.toString(),
                        unit_price: item1.unit_price.toString(),
                        description: item1.description
                    }
                })
            finalList = [...finalList, ...bookingRoomItem];
            return finalList;
        }, []);
        return bookingRoomItems;
    }

    createBookingRequest(data) {
        api_instance.post(`api/new_booking`, data)
            .then((response) => {
                if (response.status === 200 && response.data) {
                    this.createBookingServiceRooms(response.data.booking_id);
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    createBookingServiceRooms(bookingId) {
        apiService.getBookingRoomItems(bookingId).then((response) => {
            if (response.status === 200) {
                let promiseArr = [];
                response.data.map(item => {
                    for (let idx = 0; idx < item.quantity; idx++) {
                        const obj = {
                            booking_id: bookingId,
                            booking_service_id: item.booking_service_id,
                            service_id: item.service_id,
                            service_name: item.service_name,
                            room_id: null,
                            room_name: "",
                            using_date: item.using_date,
                            room_index: (idx + 1),
                            booking_checkin_date: this.state.fromDate,
                            booking_checkout_date: this.state.toDate
                        }
                        const promise = apiService.insertBookingServiceRoom(obj);
                        promiseArr.push(promise);
                    }
                    return item;
                })
                Promise.all(promiseArr).then(() => {
                    setTimeout(() => {
                        routeToPage(this.props.history, `/viewbooking?booking_id=${bookingId}`);
                    }, 1000);
                }).catch((err) => {
                    console.log(err);
                })
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    handleSelectAutoCompleteItem(item) {
        if (item && item.contact_id) {
            this.setState({
                showAutoName: false,
                showAutoPhone: false,
                autoNameValue: item.contact_name,
                autoPhoneValue: item.phone_1 || item.phone_2,
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

    handleOnBlurInput() {
        setTimeout(() => {
            this.setState({
                showAutoName: false,
                showAutoPhone: false
            })
        }, 300)
    }

    createNewContact() {
        this.setState({
            showAddContactModal: true
        })
    }

    displayAddContactModal(display, submitObj) {
        if (submitObj) {
            this.setState({
                autoNameValue: submitObj.contact_name || '',
                autoPhoneValue: submitObj.phone_1 || ''
            });
        }

        this.setState({
            showAddContactModal: display
        })
    }

    render() {
        return (
            <>
                <Container>
                    <Row>
                        <Col>
                            <h2>Tạo booking</h2>
                            <div className={styles.inputGroup}>
                                <div className={styles.inputGroupZero}>
                                    <div>Số điện thoại:</div>
                                    <input className="form-control" type="text" pattern="[0-9]*" onBlur={() => { this.handleOnBlurInput() }} onChange={this.handleChangeAutoCompleteInput} value={this.state.autoPhoneValue} name="phone" />
                                    {this.state.showAutoPhone && this.state.autoPhoneData.length > 0 ?
                                        <div className={styles.phoneListPopup + ' list-group'}>
                                            {(this.state.autoPhoneData || []).map((item, idx) => {
                                                return (
                                                    <div key={idx} className={styles.datalistItem + ' list-group-item'} onClick={() => {
                                                        this.handleSelectAutoCompleteItem(item);
                                                    }}>
                                                        <div>{item.phone_1 || item.phone_2}</div>
                                                        <div>{item.contact_name}</div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        : null}
                                    {/* <button className="btn btn-primary" onClick={() => { this.createNewContact() }}>Tạo KH mới</button> */}
                                </div>
                                <div className={styles.inputGroupOne}>
                                    <div>Khách hàng:</div>
                                    <input className="form-control" type="text" onBlur={() => { this.handleOnBlurInput() }} onChange={this.handleChangeAutoCompleteInput} value={this.state.autoNameValue} name="name" />
                                    {this.state.showAutoName && this.state.autoNameData.length > 0 ?
                                        <div className={styles.nameListPopup + ' list-group'}>
                                            {(this.state.autoNameData || []).map((item, idx) => {
                                                return (
                                                    <div key={idx} className={styles.datalistItem + ' list-group-item'} onClick={() => {
                                                        this.handleSelectAutoCompleteItem(item);
                                                    }}>
                                                        <div title={item.contact_name}>{item.contact_name}</div>
                                                        <div>{item.phone_1 || item.phone_2}</div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        : null}
                                </div>
                                <div className={styles.inputGroupTwo}>
                                    <div>
                                        <div>Ngày đến:</div>
                                        <input className="form-control" type="date" name="from_date" onChange={(e) => this.handleChangeDate(e.target.value, 'fromDate')} value={this.state.fromDate} required />
                                    </div>
                                    <div>
                                        <div className="mr-2">Ngày đi:</div>
                                        <input className="form-control" type="date" name="to_date" onChange={(e) => this.handleChangeDate(e.target.value, 'toDate')} value={this.state.toDate} required />
                                    </div>


                                    <button className="btn btn-primary ml-4" onClick={this.handleSearchByDate}>Xem dữ liệu</button>
                                </div>

                                {this.state.showTable ?
                                    <div className={styles.inputGroupThree}>
                                        <div>Ghi chú:</div>
                                        <input type="text" className="form-control" onChange={this.handleChangeNoteInput} />
                                    </div> : null}
                            </div>
                        </Col>
                    </Row>

                    {this.state.showTable ? <Row>
                        <div className="table-responsive">
                            <table className="table table-sm table-hover table-bordered">
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col"></th>
                                        {(this.state.titleArr || []).map((item, index1) => { return <th className={styles.thCustom} scope="col" key={index1}>{item}</th> })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        (this.state.typeArr || []).map((item, index2) => {
                                            return (
                                                <tr key={index2}>
                                                    <th scope="row">{item.service_name}</th>
                                                    {(item.data || []).map((item1, index3) => {
                                                        return (
                                                            <td key={index3}>
                                                                {item1[item.service_name]}
                                                                {(index3 > 0 && index3 < item.data.length - 1) ? <div>
                                                                    <div className={styles.tdCustom}>
                                                                        <div>SL:</div> <input type="number" className="form-control" onChange={(e) => this.handleBookingDataInput(e, 'quantity', item1.using_date, item.service_id)} name={item.service_name} value={item1.quantity} />
                                                                    </div>
                                                                    <div className={styles.tdCustom}>
                                                                        <div>ĐG:</div> <input type="number" className="form-control" onChange={(e) => this.handleBookingDataInput(e, 'unit_price', item1.using_date, item.service_id)} name={item.service_name} value={item1.unit_price} />
                                                                    </div>
                                                                    <div className={styles.tdCustom}>
                                                                        <div>MT:</div> <input className="form-control" onChange={(e) => this.handleBookingDataInput(e, 'description', item1.using_date, item.service_id)} name={item.service_name} />
                                                                    </div>
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
                        </div>
                        <div className="d-flex justify-content-center w-100 mt-3">
                            <button className="btn btn-primary" onClick={this.handleInputData}>Lưu dữ liệu</button>
                        </div>

                    </Row> : null}
                </Container>
                {this.state.showAddContactModal ? <AddItemModal typeModal="newContact" inShow={this.state.showAddContactModal} inOnHide={(state) => {
                    this.displayAddContactModal(false, state);
                }}></AddItemModal> : null}
            </>
        )
    }
}

export default CreateBooking;