import axios from 'axios';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import api_instance from '../../../utils/api';
import styles from './SummaryReportOne.module.css';


class SummaryReportOne extends React.Component {
    constructor(props) {
        super(props);

        const fromDate = new Date();
        const tmp = new Date(fromDate);
        const toDate = new Date(tmp.setDate(fromDate.getDate() + 5));

        this.state = {
            from_date: fromDate.toISOString().slice(0, 10),
            to_date: toDate.toISOString().slice(0, 10),
            isValidDate: true,
            searchData: [],
            search_type: "checkout",
            paymentAccountArr: [],
            otherServiceArr: [],
            fieldArr: [
                {
                    key: "bookingCode",
                    value: "Mã Booking"
                },
                {
                    key: "checkinDate",
                    value: "Ngày checkin"
                },
                {
                    key: "checkoutDate",
                    value: "Ngày checkout"
                },
                {
                    key: "customerName",
                    value: "Tên khách hàng"
                },
                {
                    key: "phoneNumber",
                    value: "Số điện thoại"
                },
                {
                    key: "totalService",
                    value: "Tổng DV sử dụng"
                },
                {
                    key: "roomService",
                    value: "DV phòng ở"
                }
            ]
        }
    }

    componentDidMount() {
        this.getOtherServiceArr().then(() => {
            this.getPaymentAccountArr();
        })
    }

    getOtherServiceArr() {
        return new Promise((resolve, reject) => {
            api_instance.get(`/api/get_all_other_service`)
                .then((response) => {
                    if (response.status === 200) {
                        this.updateState('otherServiceArr', response.data);
                        let fieldArr = JSON.parse(JSON.stringify(this.state.fieldArr));
                        for (const item of response.data) {
                            fieldArr.push({
                                key: item.service_name,
                                value: item.service_name
                            })
                        }
                        this.updateState('fieldArr', fieldArr);
                        resolve();
                    }
                }).catch((err) => {
                    console.log(err);
                    reject();
                })
        })
    }
    getPaymentAccountArr() {
        return new Promise((resolve, reject) => {
            api_instance.get('/api/all_payment_account')
                .then((response) => {
                    if (response.status === 200) {
                        this.updateState('paymentAccountArr', response.data);
                        let fieldArr = JSON.parse(JSON.stringify(this.state.fieldArr));
                        fieldArr.push({
                            key: "totalPayment",
                            value: "Tổng DV thanh toán"
                        });
                        for (const item of response.data) {
                            fieldArr.push({
                                key: item.account_name,
                                value: item.account_name
                            })
                        }
                        this.updateState('fieldArr', fieldArr);
                        resolve();
                    }
                }).catch((err) => {
                    console.log(err);
                    reject();
                })
        })
    }


    handleChangeDate(event) {
        setTimeout(() => {
            this.checkValidation();
        });
        this.updateState(event.target.name, event.target.value);
    }

    checkValidation() {
        let isValidDate = false;
        const fromDate = new Date(this.state.from_date);
        const toDate = new Date(this.state.to_date);
        isValidDate = toDate.getTime() >= fromDate.getTime() && ((toDate.getTime() - fromDate.getTime()) <= 432000000);
        this.updateState('isValidDate', isValidDate);
        return isValidDate;
    }

    updateState(key, value) {
        this.setState({
            [key]: value
        });
    }

    handleSearchByDate() {
        if (this.checkValidation()) {
            let path = '';
            switch (this.state.search_type) {
                case "checkin":
                    path = `/api/booking_summary_by_checkin`;
                    break;
                case "checkout":
                    path = `/api/booking_summary_by_checkout`;
                    break;
                default:
                    break;
            }
            api_instance.get(path, {
                params: {
                    from_date: this.state.from_date,
                    to_date: this.state.to_date
                }
            }).then((response) => {
                if (response.status === 200) {
                    response.data = response.data.map(item => {
                        return {
                            booking_id: item.booking_id,
                            checkin_date: item.checkin_date,
                            checkout_date: item.checkout_date,
                            contact_name: item.contact_name,
                            contact_phone: item.contact_phone,
                            totalService: item.totalService || 0
                        }
                    })
                    response.data = response.data.reduce((finalList, item) => {
                        const idx = finalList.findIndex(item1 => item1.booking_id === item.booking_id);
                        if (idx === -1) {
                            this.getDataForBookingItem(item.booking_id);
                            finalList.push(item);
                        }
                        return finalList;
                    }, [])
                    this.updateState('searchData', response.data);
                }
            }).catch((err) => {
                console.log(err);
            })
        }
    }

    getDataForBookingItem(bookingId) {
        const requestOne = api_instance.get(`/api/booking_room_item?booking_id=${bookingId}`);
        const requestTwo = api_instance.get(`/api/booking_other_service?booking_id=${bookingId}`);
        const requestThree = api_instance.get(`/api/booking_payment_transaction?booking_id=${bookingId}`);

        axios.all([requestOne, requestTwo, requestThree]).then(axios.spread((...responses) => {
            if (responses && responses.length > 0) {
                this.updateSearchData(bookingId, responses);
            }
        })).catch((err) => {
            console.log(err);
        })
    }

    updateSearchData(bookingId, responses) {
        let searchDataArr = JSON.parse(JSON.stringify(this.state.searchData));
        let roomServiceValue = 0;
        let otherServiceValue = 0;
        let allPaymentValue = 0;
        const idx = searchDataArr.findIndex(item => item.booking_id === bookingId);

        if (idx !== -1) {
            // Update room service
            for (const item of responses[0].data) {
                roomServiceValue = roomServiceValue + (item.quantity * item.unit_price);
            }
            searchDataArr[idx]['roomService'] = roomServiceValue;

            // Update other services
            for (const item1 of this.state.otherServiceArr) {
                const idx1 = responses[1].data.findIndex(item2 => item2.service_name === item1.service_name);
                searchDataArr[idx][item1.service_name] = (idx1 !== -1) ? responses[1].data[idx1].quantity * responses[1].data[idx1].unit_price : 0;
                otherServiceValue = otherServiceValue + searchDataArr[idx][item1.service_name];
            }
            searchDataArr[idx]['totalService'] = roomServiceValue + otherServiceValue;
            searchDataArr[idx]['totalPayment'] = 0;

            // Update payment accounts
            for (const item3 of this.state.paymentAccountArr) {
                const idx3 = responses[2].data.findIndex(item4 => item4.payment_account_name === item3.account_name);
                searchDataArr[idx][item3.account_name] = (idx3 !== -1) ? parseInt(responses[2].data[idx3].payment_value) : 0;
                allPaymentValue = parseInt(allPaymentValue) + searchDataArr[idx][item3.account_name];
            }
            searchDataArr[idx]['totalPayment'] = allPaymentValue;

            // Update state object
            this.updateState('searchData', searchDataArr);
        }
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <h4 className="p-3">Tổng hợp báo cáo 01</h4>
                        <div className={styles.functionsGroup}>
                            <div className={styles.functionsDate}>
                                <div>
                                    <div>Từ ngày:</div>
                                    <input className="form-control" type="date" name="from_date" onChange={(e) => this.handleChangeDate(e)} value={this.state.from_date} />
                                </div>
                                <div>
                                    <div className="mr-2">Đến ngày:</div>
                                    <input className="form-control" type="date" name="to_date" onChange={(e) => this.handleChangeDate(e)} value={this.state.to_date} />
                                </div>

                                <div className={"dropdown " + styles.dropdownCustom}>
                                    <div className="form-control dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Tìm theo ngày checkout
                                    </div>
                                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                        <div className="dropdown-item">Tìm theo ngày checkout</div>
                                    </div>
                                </div>

                                <button className="btn btn-primary" onClick={() => { this.handleSearchByDate() }}>Xem dữ liệu</button>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="table-responsive">
                            <table className="table table-sm table-hover table-bordered">
                                <thead className={"thead-light " + styles.theadCustom}>
                                    <tr>
                                        {this.state.fieldArr.map((item, index) => {
                                            return (
                                                <th scope="col" key={index}>{item.value}</th>
                                            )
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.searchData.map((item, index) => {
                                        return (
                                            <tr key={index} className={styles.trCustom}>
                                                {Object.keys(item).map((key, idx1) => {
                                                    return (
                                                        <td key={idx1}>{item[key] || ''}</td>
                                                    )
                                                })}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default SummaryReportOne;