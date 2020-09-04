import moment from "moment";
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import apiService from "../../../services/api.service";
import { API_BOOKING_SERVICE_ROOM } from "../../../utils/constants";
import styles from "./BookingServiceRoom.module.css";

class BookingServiceRoom extends React.Component {
    constructor(props) {
        super(props);

        const fromDate = new Date();
        const tmp = new Date(fromDate);
        const toDate = new Date(tmp.setDate(fromDate.getDate() + 3));

        this.state = {
            from_date: moment(fromDate).format("YYYY-MM-DD"),
            to_date: moment(toDate).format("YYYY-MM-DD"),
            isValidDate: true,
            searchData: [],
            search_type: "checkin"
        }
    }

    componentDidMount() {

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
        isValidDate = toDate.getTime() >= fromDate.getTime();
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
                    path = API_BOOKING_SERVICE_ROOM;
                    break;
                case "checkout":
                    path = ``;
                    break;
                default:
            }

            apiService.getBookingServiceRoom(path, {
                params: {
                    from_date: this.state.from_date,
                    to_date: this.state.to_date
                }
            }).then((response) => {
                if (response.status === 200) {
                    this.setupData(response.data);
                }
            }).catch((err) => {
                console.log(err);
            })
        }
    }

    setupData(data) {
        data = data.reduce((finalList, item) => {
            const idx = finalList.findIndex(item1 => item1.booking_id === item.booking_id);
            item.using_date = moment(item.using_date).format("DD-MM-YYYY");
            if (idx === -1) {
                finalList.push({
                    booking_id: item.booking_id,
                    using_date_arr: [item.using_date],
                    data: [item]
                });
            } else {
                const idx1 = finalList.findIndex(item2 => item2.using_date_arr.indexOf(item.using_date) !== -1);
                if (idx1 === -1) {
                    finalList[idx].using_date_arr.push(item.using_date);
                }
                finalList[idx].data.push(item);
            }
            return finalList;
        }, []);

        data = data.map(item => {
            item.data = item.data.reduce((finalList, item1) => {
                const idx = finalList.findIndex(item2 => item1.service_id === item2.service_id);
                if (idx === -1) {
                    finalList.push({
                        service_id: item1.service_id,
                        service_name: item1.service_name,
                        data: [item1]
                    });
                } else {
                    finalList[idx].data.push(item1);
                }
                return finalList;
            }, []);

            item.data.map(item2 => {
                item2.data = item2.data.reduce((finalList, item3) => {
                    const idx = finalList.findIndex(item4 => item3.using_date === item4.using_date);
                    if (idx === -1) {
                        finalList.push({
                            using_date: item3.using_date,
                            data: [item3]
                        });
                    } else {
                        finalList[idx].data.push(item3);
                    }
                    return finalList;
                }, []);
                return item2;
            });
            return item;
        });

        this.updateState('searchData', data);
    }

    render() {
        return (
            <div className="container-fluid">
                <Row>
                    <Col>
                        <h4 className="p-3">Xếp phòng khách sạn</h4>
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
                                        Tìm theo ngày checkin
                                    </div>
                                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                        <div className="dropdown-item">Tìm theo ngày checkin</div>
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
                            {
                                this.state.searchData.map((item, idx) => {
                                    return (
                                        <div key={idx}>
                                            <h4>Booking: {item.booking_id}</h4>
                                            <table className="table table-sm table-hover table-bordered">
                                                <thead className={"thead-light " + styles.theadCustom}>
                                                    <tr>
                                                        <th scope="col" key="room_type">Loại phòng</th>
                                                        {item.using_date_arr.map((item1, idx1) => {
                                                            return (
                                                                <th scope="col" key={idx1}>{item1}</th>
                                                            )
                                                        })}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {item.data.map((item2, idx2) => {
                                                        return (
                                                            <tr key={idx2} className={styles.trCustom}>
                                                                <td>{item2.service_name}</td>
                                                                {item2.data.map((item3, idx3) => {
                                                                    return (
                                                                        <td key={idx3}>
                                                                            {item3.data.map((item4, idx4) => {
                                                                                return(
                                                                                    <div key={idx4}>{item4.index}</div>
                                                                                )
                                                                            })}
                                                                        </td>
                                                                    )
                                                                })}
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )
                                })
                            }

                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default BookingServiceRoom;