import queryString from 'query-string';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import api_instance from '../../../utils/api';
import AddItemModal from '../../utility/AddItemModalComponent/AddItemModal';
import ConfirmModal from '../../utility/ConfirmModalComponent/ConfirmModal';
import EditRoomServiceModal from './EditRoomServiceModalComponent/EditRoomServiceModal';
import styles from './ViewBooking.module.css';

class ViewBooking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookingDetail: {
                bookingId: 0,
                contactId: 0,
                phone: 0,
                name: '',
                checkinDate: '',
                checkoutDate: '',
                description: ''
            },
            totalValue: {
                bookingId: 0,
                value: 0
            },
            totalPayment: {
                bookingId: 0,
                value: 0
            },
            roomService: {
                dateArr: [],
                roomArr: [],
                data: {}
            },
            otherService: {
                data: []
            },
            transactions: {
                data: []
            },
            confirmModalData: {
                show: false,
                itemId: -1,
                typeModal: ''
            },
            addItemModalData: {
                show: false,
                itemId: -1,
                typeModal: ''
            },
            editRoomServiceData: {
                show: false
            }
        }
    }

    componentDidMount() {
        this.getDataFromServer();
    }

    getDataFromServer() {
        this.requestData('booking_detail');
        this.requestData('booking_total_value');
        this.requestData('booking_total_payment');
        this.requestData('booking_room_item');
        this.requestData('booking_other_service');
        this.requestData('booking_payment_transaction');
    }

    requestData(path) {
        const booking_id = queryString.parse(this.props.location.search).booking_id;
        if (booking_id) {
            const param = `?booking_id=${booking_id || 1}`
            api_instance.get(`api/${path}${param}`)
                .then((response) => {
                    if (response.status === 200 && response.data) {
                        this.setFieldState(response.data, path);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }

    }

    deleteItem(typeModal, itemId) {
        const booking_id = queryString.parse(this.props.location.search).booking_id;
        if (booking_id) {
            const param = `?booking_id=${(booking_id || 1)}&item_id=${itemId}`;
            let path = '';
            switch (typeModal) {
                case 'transactions':
                    path = 'booking_payment_transaction';
                    break;
                case 'otherService':
                    path = 'booking_other_service';
                    break;
                default:
            }

            api_instance.delete(`api/${path}${param}`)
                .then((response) => {
                    this.requestData(path);
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }

    addItem(typeModal, state) {
        const booking_id = queryString.parse(this.props.location.search).booking_id;
        if (booking_id) {
            const param = `?booking_id=${booking_id}`;
            let path = '';
            switch (typeModal) {
                case 'transactions':
                    path = 'booking_payment_transaction';
                    break;
                case 'otherService':
                    path = 'booking_other_service';
                    break;
                default:
            }

            api_instance.put(`api/${path}${param}`, state)
                .then((response) => {
                    this.requestData(path);
                })
                .catch((error) => {
                    console.log(error);
                })
        }

    }

    editItem(state) {
        const submitData = {
            booking_id: this.state.bookingDetail.bookingId,
            checkin_date: this.state.bookingDetail.checkinDate,
            checkout_date: this.state.bookingDetail.checkoutDate,
            description: this.state.bookingDetail.description,
            booking_room_items: this.getBookingRoomItems(state)
        }

        api_instance.post(`api/update_booking`, submitData)
            .then((response) => {
                if (response.status === 200) {
                    this.requestData('booking_room_item');
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    getBookingRoomItems(data) {
        let bookingRoomItems = [];
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                bookingRoomItems = [...bookingRoomItems, ...data[key]];
            }
        }

        return bookingRoomItems.map(item => {
            return {
                service_id: item.service_id,
                using_date: item.using_date,
                quantity: item.quantity.toString(),
                unit_price: item.unit_price.toString(),
                description: item.description
            }
        });
    }

    setFieldState(data, type) {
        switch (type) {
            case 'booking_detail':
                const obj = data[0]
                this.setState({
                    bookingDetail: {
                        bookingId: obj.booking_id,
                        contactId: obj.contact_id,
                        phone: obj.contact_phone,
                        name: obj.contact_name,
                        checkinDate: obj.checkin_date,
                        checkoutDate: obj.checkout_date,
                        description: obj.description
                    }
                })
                break;
            case 'booking_total_value':
                this.setState({
                    totalValue: {
                        bookingId: data.booking_id,
                        value: data.total_value
                    }
                })
                break;
            case 'booking_total_payment':
                this.setState({
                    totalPayment: {
                        bookingId: data.booking_id,
                        value: data.total_payment
                    }
                })
                break;
            case 'booking_room_item':
                this.convertRoomData(data)
                break;
            case 'booking_other_service':
                this.setState({
                    otherService: {
                        data: data
                    }
                });
                break;
            case 'booking_payment_transaction':
                this.setState({
                    transactions: {
                        data: data
                    }
                });
                break;
            default:
        }
    }

    convertRoomData(data) {
        const dateArr = data.map(item => item.using_date);
        const dateArrConvert = this.removeDuplicateData(dateArr);

        const roomArr = data.map(item1 => item1.service_name);
        const roomArrConvert = this.removeDuplicateData(roomArr);

        let object = {};
        for (const item2 of roomArrConvert) {
            object[item2] = data.filter(item3 => item3.service_name === item2)
        }
        this.setState({
            roomService: {
                dateArr: dateArrConvert,
                roomArr: roomArrConvert,
                data: object
            }
        })

    }

    removeDuplicateData(data) {
        return data.reduce((finalList, item) => {
            const idx = finalList.indexOf(item);
            if (idx === -1) { finalList.push(item) }
            return finalList;
        }, []);
    }

    displayConfirmModal(isConfirm, typeModal, itemId, display) {
        if (isConfirm) {
            this.deleteItem(typeModal, itemId);
        }
        typeModal = display ? typeModal : '';
        itemId = display ? itemId : -1;
        this.setState({
            confirmModalData: {
                show: display,
                itemId: itemId,
                typeModal: typeModal
            }
        })
    }

    displayAddItemModal(typeModal, display, state) {
        if (state) {
            this.addItem(typeModal, state);
        }
        typeModal = display ? typeModal : '';

        this.setState({
            addItemModalData: {
                show: display,
                typeModal: typeModal
            }
        })
    }

    displayEditRoomServiceModal(display, state) {
        if (state) {
            this.editItem(state);
        }

        this.setState({
            editRoomServiceData: {
                show: display
            }
        })
    }

    render() {
        return (
            <>
                <Container className="mt-3">
                    <Row>
                        <div className="d-flex flex-row">
                            <h2>View Booking</h2>
                        </div>
                    </Row>
                    <Row className="p-3">
                        <div className={styles.sectionOne}>
                            <div>
                                <div>Mã booking:</div>
                                <div className="ml-2">{this.state.bookingDetail.bookingId}</div>
                            </div>
                            <div>
                                <div>Tên đoàn:</div>
                                <div className="ml-2">{this.state.bookingDetail.name}</div>
                            </div>
                            <div>
                                <div>Số điện thoại:</div>
                                <div className="ml-2">{this.state.bookingDetail.phone}</div>
                            </div>
                            <div>
                                <div>Ngày checkin:</div>
                                <div className="ml-2">{this.state.bookingDetail.checkinDate}</div>
                            </div>
                            <div>
                                <div>Ngày checkout:</div>
                                <div className="ml-2">{this.state.bookingDetail.checkoutDate}</div>
                            </div>
                        </div>
                        {this.state.bookingDetail.description ? <div className={styles.note}>
                            <div>Ghi chú:</div>
                            <div>{this.state.bookingDetail.description}</div>
                        </div> : null}

                    </Row>
                    <Row className="p-3">
                        <div className="d-flex flex-row mr-5">
                            <div>Tổng dịch vụ sử dụng:</div>
                            <div className="ml-2">{(this.state.totalValue.value || 0).toLocaleString()}</div>
                        </div>
                        <div className="d-flex flex-row">
                            <div>Tổng giao dịch thanh toán:</div>
                            <div className="ml-2">{(this.state.totalPayment.value || 0).toLocaleString()}</div>
                        </div>
                    </Row>
                    <div className={styles.devider}></div>

                    <Row className="p-3">
                        <div className="d-flex flex-row align-items-center">
                            <h5 className="mb-0">Dịch vụ phòng ở</h5>
                            <button className="btn btn-primary ml-4" onClick={() => {
                                this.displayEditRoomServiceModal(true);
                            }}>Chỉnh sửa</button>
                        </div>

                        <div className="table-responsive mt-3">
                            <table className="table table-sm table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col"></th>
                                        {this.state.roomService.dateArr.map((item, index) => { return <th scope="col" key={index}>{item}</th> })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.roomService.roomArr.map((item1, index1) => {
                                            return (
                                                <tr key={index1}>
                                                    <th scope="row">{item1}</th>
                                                    {
                                                        this.state.roomService.data[item1].map((item2, index2) => {
                                                            return (
                                                                <td key={index2}>
                                                                    <div className={styles.tdRoomCustom}>
                                                                        <div>SL:</div>
                                                                        <div>{item2.quantity}</div>
                                                                    </div >
                                                                    <div className={styles.tdRoomCustom}>
                                                                        <div>ĐG:</div>
                                                                        <div>{(item2.unit_price || 0).toLocaleString()}</div>
                                                                    </div>
                                                                </td>
                                                            )
                                                        })
                                                    }
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Row>
                    <div className={styles.devider}></div>

                    <Row className="p-3">
                        <div className="d-flex flex-row align-items-center">
                            <h5 className="mb-0">Dịch vụ khác</h5>
                            <button className="btn btn-primary ml-4" onClick={() => {
                                this.displayAddItemModal('otherService', true);
                            }}>Thêm</button>
                        </div>

                        <div className="table-responsive mt-3">
                            <table className="table table-sm table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col"></th>
                                        <th scope="col">Số lượng</th>
                                        <th scope="col">Đơn giá</th>
                                        <th scope="col">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.otherService.data.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <th scope="row">
                                                        <div className={styles.closeBtnCustom} onClick={() => {
                                                            this.displayConfirmModal(false, 'otherService', item.service_id, true);
                                                        }}>
                                                            <i className="fa fa-times" aria-hidden="true"></i>
                                                        </div>
                                                        {item.service_name}</th>
                                                    <td key="quantity">{item.quantity}</td>
                                                    <td key="unit">{(item.unit_price || 0).toLocaleString()}</td>
                                                    <td key="totalvalue">{(item.quantity * item.unit_price || 0).toLocaleString()}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Row>

                    <div className={styles.devider}></div>

                    <Row className="p-3">
                        <div className="d-flex flex-row align-items-center">
                            <h5 className="mb-0">Các giao dịch thanh toán</h5>
                            <button className="btn btn-primary ml-4" onClick={() => {
                                this.displayAddItemModal('transactions', true);
                            }}>Thêm</button>
                        </div>

                        <div className="table-responsive mt-3">
                            <table className="table table-sm table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">Ngày</th>
                                        <th scope="col">Số tiền</th>
                                        <th scope="col">Tài khoản</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.transactions.data.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td key="date">{item.payment_date}</td>
                                                    <td key="money">{(item.payment_value || 0).toLocaleString()}</td>
                                                    <td key="account">{item.payment_account_name}</td>
                                                    <td key="remove">
                                                        <div className={styles.closeBtnCustom} onClick={() => {
                                                            this.displayConfirmModal(false, 'transactions', item.payment_transaction_id, true);
                                                        }}>
                                                            <i className="fa fa-times" aria-hidden="true"></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Row>

                </Container>
                {this.state.confirmModalData.show ? <ConfirmModal inShow={this.state.confirmModalData.show} typeModal={this.state.confirmModalData.typeModal} inOnHide={(isConfirm) => {
                    this.displayConfirmModal(isConfirm, this.state.confirmModalData.typeModal, this.state.confirmModalData.itemId, false);
                }} /> : null}

                {this.state.addItemModalData.show ? <AddItemModal inShow={this.state.addItemModalData.show} typeModal={this.state.addItemModalData.typeModal} inOnHide={(state) => {
                    this.displayAddItemModal(this.state.addItemModalData.typeModal, false, state);
                }}></AddItemModal> : null}

                {this.state.editRoomServiceData.show ? <EditRoomServiceModal inShow={this.state.editRoomServiceData.show} data={this.state.roomService} inOnHide={(state) => {
                    this.displayEditRoomServiceModal(false, state);
                }}></EditRoomServiceModal> : null}
            </>
        )
    }

}

export default ViewBooking;