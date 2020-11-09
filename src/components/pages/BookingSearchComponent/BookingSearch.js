import moment from "moment";
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useHistory, useLocation } from 'react-router';
import apiService from '../../../services/api.service';
import { routeToPage } from '../../../utils/util';
import styles from './BookingSearch.module.css';

const initQueryArr = [
    {
        key: "contact_phone",
        keyAlt: "Số điện thoại",
        value: ""
    },
    {
        key: "contact_name",
        keyAlt: "Khách hàng",
        value: ""
    },
    {
        key: "room_night",
        keyAlt: "Đêm ở",
        value: "",
        valueAlt: "dd/mm/yyyy"
    },
    {
        key: "checkin",
        keyAlt: "Ngày checkin",
        value: "",
        valueAlt: "dd/mm/yyyy"
    },
    {
        key: "checkout",
        keyAlt: "Ngày checkout",
        value: "",
        valueAlt: "dd/mm/yyyy"
    }
]

const BookingSearch = () => {
    const [showTable, setShowTable] = useState(true);
    const [activeField, setActiveField] = useState("");
    const [queryArr, setQueryArr] = useState(initQueryArr);
    const [resultArr, setResultArr] = useState([]);

    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
        let params = queryString.parse(location.search);
        if (params.search_type && params.search_value) {
            searchBooking(params.search_type, params.search_value);
        }
    }, [location.search]);

    const handleChangeAutoCompleteInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setQueryArr(
            queryArr.map(item => {
                if (item.key === name) {
                    item.value = value;
                    if (name === "room_night" || name === "checkin" || name === "checkout") {
                        item.valueAlt = moment(value).format("DD/MM/YYYY");
                    }
                }
                return item;
            })
        )
    }

    const handleOnFocus = (event) => {
        const name = event.target.name;
        setActiveField(name);
        setQueryArr(
            queryArr.map(item => {
                item.value = "";
                item.valueAlt = "dd/mm/yyyy";
                return item;
            })
        )
    }

    const searchBooking = (searchType, searchValue) => {
        return new Promise((resolve, reject) => {
            if (!searchType) {
                const idx = queryArr.findIndex(item => item.key === activeField);
                if (idx !== -1) {
                    searchType = queryArr[idx].key;
                    searchValue = queryArr[idx].value
                }
            }
            if (searchType && searchValue) {
                apiService.getBookingSearch(searchType, searchValue).then(response => {
                    if (response.status === 200) {
                        setResultArr(response.data);
                        resolve();
                    }
                    reject();
                }).catch(err => {
                    console.log(err);
                    reject();
                })
            }
        })

    }

    const viewBookingDetail = (bookingId) => {
        routeToPage(history, `/viewbooking?booking_id=${bookingId}`)
    }

    const refreshFilterFn = () => {
        const idx = queryArr.findIndex(item => item.key === activeField);
        if (idx !== -1) {
            const searchType = queryArr[idx].key;
            const searchValue = queryArr[idx].value;

            routeToPage(history, `/booking_search?search_type=${searchType}&search_value=${searchValue}`);
        }
    }

    const renderInputType = (key) => {
        let typeInput = "";
        switch (key) {
            case "contact_phone":
                typeInput = "number"
                break;
            case "room_night":
            case "checkin":
            case "checkout":
                typeInput = "date";
                break;
            default:
                typeInput = "text";
        }
        return typeInput;
    }

    return (
        <>
            <Container className={styles.containerCustom}>
                <Row className="p-0">
                    <Col className="p-0">
                        <h4 className="p-3">Truy vấn Booking</h4>
                        <div className={styles.inputGroup + ' d-flex flex-row flex-wrap w-100'}>
                            {(queryArr || []).map((item, idx) => {
                                return (
                                    <div className={'d-flex flex-row flex-nowrap align-items-center position-relative'} key={idx}>
                                        <div>{item.keyAlt}:</div>
                                        <input className="form-control" type={renderInputType(item.key)} onFocus={(e) => { handleOnFocus(e) }} onChange={(e) => { handleChangeAutoCompleteInput(e) }} value={item.value} name={item.key} />
                                        {(item.valueAlt && (item.key === "room_night" || item.key === "checkin" || item.key === "checkout")) ? <div className={styles.dateDisplay}>{item.valueAlt}</div> : null}
                                    </div>
                                )
                            })}

                            <div className={'d-flex flex-row flex-nowrap align-items-center'}>
                                <div></div>
                                <button className="btn btn-primary" onClick={() => { refreshFilterFn() }}>Truy vấn</button>
                            </div>
                        </div>
                    </Col>
                </Row>

                {showTable ? <Row>
                    <div className="table-responsive">
                        <table className="table table-sm table-hover table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Tên khách hàng</th>
                                    <th scope="col">Số ĐT</th>
                                    <th scope="col">Ngày checkin</th>
                                    <th scope="col">Ngày checkout</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (resultArr || []).map((item, index) => {
                                        return (
                                            <tr className={styles.trCustom} key={index} onClick={() => { viewBookingDetail(item.booking_id) }}>
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

export default BookingSearch;