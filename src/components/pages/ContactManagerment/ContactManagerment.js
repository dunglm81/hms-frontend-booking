import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import api_instance from '../../../utils/api';
import Pagination from '../../utility/PaginationComponent/Pagination';
import styles from './ContactManagerment.module.css';

class ContactManagerment extends React.Component {
    constructor(props) {
        super(props);

        var initial_data = [];
        this.state = {
            searchData: initial_data,
            pagination: {
                totalPage: 0,
                totalElement: 0,
                currentPage: 0,
                rowPerPage: 0
            },
            autocompleteData: [],
            showAutocomplete: false
        }
    }

    componentDidMount() {
        this.requestData('Nguyễn', 1, 50);
    }

    requestData(name, currentPage, pageSize, isAutoComplete) {
        var get_params = `?contact_name=${name}&current_page=${currentPage}&page_size=${pageSize}`;

        api_instance.get(`api/search_contact_by_name_paging${get_params}`)
            .then((response) => {
                if (response.status === 200) {
                    if (isAutoComplete) {
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
                    } else {
                        this.setState({
                            searchData: response.data[4],
                            pagination: {
                                totalPage: response.data[2].total_page,
                                totalElement: response.data[0].total_item,
                                currentPage: response.data[3].current_page,
                                rowPerPage: response.data[1].page_size
                            }
                        });
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                var message;
                if (error.response.status === 409) {
                    message = error.response.data;
                    this.setState({ modalMessage: message });
                } else {
                    this.setState({ modalMessage: error });
                }

                this.setShow(true);
            });
    }

    handleCurrentPage = (currentPage) => {
        this.requestData('Nguyễn', currentPage, 50);
    }

    handleChangeAutoCompleteInput = (event) => {
        const value = event.target.value;
        if (value.length > 6) {
            this.requestData(value, 1, 20, true);
        } else {
            this.setState({
                showAutocomplete: false
            })
        }
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <h1>Danh sách khách hàng</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="table-responsive">
                            <table className="table table-sm table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">Họ tên</th>
                                        <th scope="col">Số điện thoại</th>
                                        <th scope="col">Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.searchData.map((item) => {
                                        return (
                                            <tr key={item.contact_id}>
                                                <td>{item.contact_name}</td>
                                                <td>{item.phone_1}</td>
                                                <td>{item.email}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <Pagination data={this.state.pagination} onSelectCurrentPage={this.handleCurrentPage} />
                        </div>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default ContactManagerment;