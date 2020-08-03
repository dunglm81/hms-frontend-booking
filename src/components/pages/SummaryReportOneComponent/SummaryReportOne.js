import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

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
            isValidDate: true
        }
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

                                <button className="btn btn-primary ml-4" onClick={this.handleSearchByDate}>Xem dữ liệu</button>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="table-responsive">
                            <table className="table table-sm table-hover table-bordered">
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Họ tên</th>
                                        <th scope="col">Số điện thoại</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Chỉnh sửa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* {this.state.searchData.map((item) => {
                                        return (
                                            <tr key={item.contact_id} className={styles.trCustom}>
                                                <td>{item.contact_name}</td>
                                                <td>{item.phone_1}</td>
                                                <td>{item.email}</td>
                                                <td onClick={() => this.editContactItem(item)}>
                                                    <div><FontAwesomeIcon icon="edit" /></div>
                                                </td>
                                            </tr>
                                        )
                                    })} */}
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