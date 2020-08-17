import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import queryString from 'query-string';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import api_instance from '../../../utils/api';
import AddItemModal from '../../utility/AddItemModalComponent/AddItemModal';
import ConfirmModal from '../../utility/ConfirmModalComponent/ConfirmModal';
import EditRoomServiceModal from './EditRoomServiceModalComponent/EditRoomServiceModal';
import UpdateDescriptionModal from './UpdateDescriptionModalComponent/UpdateDescriptionModal';
import styles from './ViewBooking.module.css';


const customStyle = (checkValue) => {
    let color = '';
    if (checkValue) {
        color = '#C8E6C9'
    } else {
        color = 'transparent'
    }

    return {
        'backgroundColor': color
    }
}

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
                description: '',
                status: '',
                statusAlt: ''
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
            },
            updateDescriptionModalData: {
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

    handleRequest(typeModal, itemId) {
        let path = '';
        switch (typeModal) {
            case 'transactions':
                path = `cancel_booking_payment?payment_transaction_id=${itemId}`;
                break;
            case 'otherService':
                path = `cancel_booking_other_service_item?booking_service_id=${itemId}`;
                break;
            case 'cancelBooking':
                path = `cancel_booking?booking_id=${itemId}`;
                break;
            case 'baselineBooking':
                path = `baseline_booking?booking_id=${itemId}`;
                break;
            default:
        }

        api_instance.get(`api/${path}`)
            .then((response) => {
                if (response.status === 200) {
                    if (typeModal !== 'cancelBooking' && typeModal !== 'baselineBooking') {
                        this.requestData('booking_payment_transaction');
                        this.requestData('booking_other_service');
                        this.requestData('booking_total_value');
                        this.requestData('booking_total_payment');
                    } else {
                        this.requestData('booking_detail');
                    }
                } else if (response.status === 202) {
                    alert('Vui lòng hủy tất cả các giao dịch thanh toán trước khi hủy booking này!')
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    addItem(typeModal, state) {
        let path = '';
        let submitData = {};
        switch (typeModal) {
            case 'transactions':
                path = 'new_booking_payment';
                submitData = this.getNewPaymentBody(state);
                break;
            case 'otherService':
                path = 'insert_booking_simple_service_item';
                submitData = this.getNewOtherServiceBody(state);
                break;
            default:
        }

        api_instance.post(`api/${path}`, submitData)
            .then((response) => {
                if (response.status === 200) {
                    this.requestData('booking_payment_transaction');
                    this.requestData('booking_other_service');
                    this.requestData('booking_total_value');
                    this.requestData('booking_total_payment');
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    getNewOtherServiceBody(data) {
        return {
            booking_id: this.state.bookingDetail.bookingId.toString(),
            service_id: data[0].service_id,
            service_name: data[0].service_name,
            quantity: data[1].value,
            unit_price: data[2].value,
            using_date: data[3].value,
            description: data[4].value
        }
    }

    getNewPaymentBody(data) {
        return {
            booking_id: this.state.bookingDetail.bookingId.toString(),
            payment_account_id: data[0].account_id,
            payment_account_name: data[0].account_name,
            payment_account_type: data[0].account_type,
            payment_value: data[2].value,
            payment_date: data[1].value
        };
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
                    this.requestData('booking_total_value');
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
                let statusAlt = '';
                if (obj.booking_status === 'valid') {
                    statusAlt = 'Hiệu lực';
                } else if (obj.booking_status === 'cancel') {
                    statusAlt = 'Hủy';
                } else if (obj.booking_status === 'based_line') {
                    statusAlt = 'Chốt';
                }
                this.setState({
                    bookingDetail: {
                        bookingId: obj.booking_id,
                        contactId: obj.contact_id,
                        phone: obj.contact_phone,
                        name: obj.contact_name,
                        checkinDate: obj.checkin_date,
                        checkoutDate: obj.checkout_date,
                        description: obj.description,
                        status: obj.booking_status,
                        statusAlt: statusAlt
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
            this.handleRequest(typeModal, itemId);
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

    displayUpdateDescriptionModal(display, description) {
        if (description) {
            this.requestData('booking_detail');
        }
        this.setState({
            updateDescriptionModalData: {
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
                        <div className={styles.note}>
                            <div>
                                <div>Ghi chú:</div>
                                {(this.state.bookingDetail.status === 'valid') ? <div className="ml-2" onClick={() => { this.displayUpdateDescriptionModal(true) }}><FontAwesomeIcon icon="edit" /></div> : null}
                            </div>
                            <div>{this.state.bookingDetail.description}</div>
                        </div>
                    </Row>
                    <Row className="p-3">
                        <div className="d-flex flex-row flex-nowrap p-2" style={customStyle(this.state.totalValue.value === this.state.totalPayment.value)}>
                            <div className="d-flex flex-row mr-5 align-items-center">
                                <div>Tổng dịch vụ sử dụng:</div>
                                <div className="ml-2"><b>{(this.state.totalValue.value || 0).toLocaleString()}</b></div>
                            </div>
                            <div className="d-flex flex-row align-items-center">
                                <div>Tổng giao dịch thanh toán:</div>
                                <div className="ml-2"><b>{(this.state.totalPayment.value || 0).toLocaleString()}</b></div>
                            </div>
                        </div>

                        <div className="ml-auto d-flex flex-row flex-nowrap align-items-center">
                            <div>Trạng thái: <b>{this.state.bookingDetail.statusAlt}</b></div>

                            {(this.state.bookingDetail.status === 'valid') ? <div onClick={() => {
                                this.displayConfirmModal(false, 'cancelBooking', this.state.bookingDetail.bookingId, true);
                            }}>
                                <button className="btn btn-warning ml-5">Hủy</button>
                            </div> : null}

                            {(this.state.bookingDetail.status === 'valid') ? <div onClick={() => {
                                this.displayConfirmModal(false, 'baselineBooking', this.state.bookingDetail.bookingId, true);
                            }}>
                                <button className="btn btn-primary ml-2">Chốt</button>
                            </div> : null}
                        </div>

                    </Row>
                    <div className={styles.devider}></div>

                    <Row className="p-3">
                        <div className="d-flex flex-row align-items-center">
                            <h5 className="mb-0">Dịch vụ phòng ở</h5>
                            {(this.state.bookingDetail.status === 'valid' ? <button className="btn btn-primary ml-4" onClick={() => {
                                this.displayEditRoomServiceModal(true);
                            }}>Chỉnh sửa</button> : null)}
                        </div>

                        <div className="table-responsive mt-3">
                            <table className="table table-sm table-hover table-bordered">
                                <thead className="thead-light">
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
                            {(this.state.bookingDetail.status === 'valid' ? <button className="btn btn-primary ml-4" onClick={() => {
                                this.displayAddItemModal('otherService', true);
                            }}>Thêm</button> : null)}
                        </div>

                        <div className="table-responsive mt-3">
                            <table className="table table-sm table-hover table-bordered">
                                <thead className="thead-light">
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
                                                        {this.state.bookingDetail.status === 'valid' ? <div className={styles.closeBtnCustom} onClick={() => {
                                                            this.displayConfirmModal(false, 'otherService', item.booking_service_id, true);
                                                        }}>
                                                            <FontAwesomeIcon icon="times" />
                                                        </div> : null}
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
                            {(this.state.bookingDetail.status === 'valid') ? <button className="btn btn-primary ml-4" onClick={() => {
                                this.displayAddItemModal('transactions', true);
                            }}>Thêm</button> : null}
                        </div>

                        <div className="table-responsive mt-3">
                            <div className="mb-2">Tổng giao dịch thanh toán: {(this.state.totalPayment.value || 0).toLocaleString()}</div>
                            <table className="table table-sm table-hover table-bordered">
                                <thead className="thead-light">
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
                                                    {this.state.bookingDetail.status === 'valid' ? <td key="remove">
                                                        <div className={styles.closeBtnCustom} onClick={() => {
                                                            this.displayConfirmModal(false, 'transactions', item.payment_transaction_id, true);
                                                        }}>
                                                            <FontAwesomeIcon icon="times" />
                                                        </div>
                                                    </td> : null}
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

                {this.state.updateDescriptionModalData.show ? <UpdateDescriptionModal inShow={this.state.updateDescriptionModalData.show} inOnHide={(state) => {
                    this.displayUpdateDescriptionModal(false, state);
                }} data={this.state.bookingDetail}></UpdateDescriptionModal> : null}
            </>
        )
    }

}

export default ViewBooking;