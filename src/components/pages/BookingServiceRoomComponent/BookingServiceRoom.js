import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
            search_type: "checkin",
            roomArrOrigin: [],
            roomArr: []
        }
    }

    componentDidMount() {
        this.getDataFromServer();
    }

    getDataFromServer() {
        apiService.getRooms().then((response) => {
            if (response.status === 200) {
                this.updateState("roomArrOrigin", response.data);
                this.updateState("roomArr", response.data);
            }
        }).catch((err) => {
            console.log(err);
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
        data = data.map(item => {
            item.showAutocomplete = false;
            return item;
        })
        data = data.reduce((finalList, item) => {
            const idx = finalList.findIndex(item1 => item1.booking_id === item.booking_id);
            item.using_date = moment(item.using_date).format("DD-MM-YYYY");
            if (idx === -1) {
                finalList.push({
                    booking_id: item.booking_id,
                    using_date_arr: [item.using_date],
                    isEdit: false,
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

    handleChangeAutoCompleteInput = (idx, idx2, idx3, idx4, event) => {
        const value = event.target.value;

        this.updateRoomItem(idx, idx2, idx3, idx4, value);
        let roomArr = JSON.parse(JSON.stringify(this.state.roomArrOrigin));
        roomArr = roomArr.filter(item => item.room_name.includes(value));
        this.updateState("roomArr", roomArr);
    }

    displayRoomPopup(idx, idx2, idx3, idx4, showAutocomplete) {
        let searchData = JSON.parse(JSON.stringify(this.state.searchData));
        searchData[idx].data[idx2].data[idx3].data[idx4].showAutocomplete = showAutocomplete;
        this.updateState("searchData", searchData);

        let roomArr = JSON.parse(JSON.stringify(this.state.roomArrOrigin));
        this.updateState("roomArr", roomArr);
    }

    updateRoomItem(idx, idx2, idx3, idx4, value) {
        let searchData = JSON.parse(JSON.stringify(this.state.searchData));
        searchData[idx].data[idx2].data = searchData[idx].data[idx2].data.map((item5, idx5) => {
            if (idx5 >= idx3) {
                item5.data = item5.data.map((item6, idx6) => {
                    if (idx6 === idx4) {
                        item6.room_name = value;
                    }
                    return item6;
                });
            }
            return item5;
        })
        this.updateState("searchData", searchData);
    }

    allowEditBookingItem(idx, value) {
        let searchData = JSON.parse(JSON.stringify(this.state.searchData));
        searchData[idx].isEdit = value;
        this.updateState("searchData", searchData);
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
                        <div className={"table-responsive " + styles.tableResponsiveCustom}>
                            {
                                this.state.searchData.map((item, idx) => {
                                    return (
                                        <div key={idx}>
                                            <div className={styles.groupBtnItem}>
                                                <h4>Booking: {item.booking_id}</h4>
                                                {item.isEdit ?
                                                    <div className="d-flex flex-row align-items-center">
                                                        <div className={styles.bgBtnCustom} onClick={() => {
                                                            this.allowEditBookingItem(idx);
                                                        }}>
                                                            <FontAwesomeIcon className="mr-1" icon="save" /> Save
                                                        </div>
                                                        <div className={styles.bgBtnCustom} onClick={() => {
                                                            this.allowEditBookingItem(idx, false);
                                                        }}>
                                                            <FontAwesomeIcon className="mr-1" icon="times" /> Cancel
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className={styles.bgBtnCustom} onClick={() => {
                                                        this.allowEditBookingItem(idx, true);
                                                    }}>
                                                        <FontAwesomeIcon icon="edit" /> Edit
                                                    </div>}
                                            </div>

                                            <table className={"table table-sm table-hover table-bordered " + (item.isEdit ? "" : styles.preventEditTable)}>
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
                                                                <td>
                                                                    <div>{item2.service_name}</div>
                                                                </td>
                                                                {item2.data.map((item3, idx3) => {
                                                                    return (
                                                                        <td key={idx3} className={styles.tdCustom}>
                                                                            <div className="d-flex flex-row">
                                                                                {item3.data.map((item4, idx4) => {
                                                                                    return (
                                                                                        <div className={styles.inputContainerCustom} key={idx4}>
                                                                                            <input className={"form-control mr-2 " + styles.inputCustom}
                                                                                                value={(this.state.searchData[idx].data[idx2].data[idx3].data[idx4].room_name) || ""}
                                                                                                onBlur={() => {
                                                                                                    setTimeout(() => {
                                                                                                        this.displayRoomPopup(idx, idx2, idx3, idx4, false);
                                                                                                    }, 300);
                                                                                                }}
                                                                                                onFocus={() => {
                                                                                                    this.displayRoomPopup(idx, idx2, idx3, idx4, true);
                                                                                                }}
                                                                                                onChange={(e) => {
                                                                                                    this.handleChangeAutoCompleteInput(idx, idx2, idx3, idx4, e);
                                                                                                }}
                                                                                            />
                                                                                            {item4.showAutocomplete ?
                                                                                                <div className={styles.datalistPopup}>
                                                                                                    {(this.state.roomArr).map((item, idx5) => {
                                                                                                        return (
                                                                                                            <div key={idx5} className={styles.datalistItem} onClick={() => {
                                                                                                                this.updateRoomItem(idx, idx2, idx3, idx4, item.room_name);
                                                                                                            }} title={item.room_name}>{item.room_name}</div>
                                                                                                        )
                                                                                                    })}
                                                                                                </div> : null}
                                                                                        </div>
                                                                                    )
                                                                                })}
                                                                            </div>

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