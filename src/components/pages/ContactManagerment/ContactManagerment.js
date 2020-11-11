import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import apiService from '../../../services/api.service';

import api_instance from '../../../utils/api';
import AddItemModal from '../../utility/AddItemModalComponent/AddItemModal';
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
            autocompleteValue: '',
            showAutocomplete: false,
            showAddContactModal: false,
            editContactItemData: {}
        }
    }

    componentDidMount() {
        this.requestData('', 1, 20);
    }

    requestData(name, currentPage, pageSize, isAutoComplete) {
        var get_params = `?contact_name=${name}&current_page=${currentPage}&page_size=${pageSize}`;

        apiService.searchContactByNamePaging(get_params).then(response => {
            if(response.status === 200) {
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
        }).catch(err => {
        })
    }

    handleCurrentPage = (currentPage) => {
        this.requestData('', currentPage, 20);
    }

    handleChangeAutoCompleteInput = (event) => {
        const value = event.target.value;
        this.setState({
            autocompleteValue: value
        });

        if (value.length > 6) {
            this.requestData(value, 1, 20, true);
        } else {
            this.setState({
                showAutocomplete: false
            })
        }
    }

    handleOnBlurInput() {
        setTimeout(() => {
            this.setState({
                showAutocomplete: false
            })
        }, 300)
    }

    filterByName() {
        this.requestData(this.state.autocompleteValue, 1, 20)
    }

    handleSelectAutoCompleteItem(item) {
        if (item && item.contact_id) {
            this.setState({
                autocompleteValue: item.contact_name,
                showAutocomplete: false
            })
            this.requestData(item.contact_name, 1, 20);
        }
    }

    handleOnKeyup(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            this.filterByName();
            this.setState({
                showAutocomplete: false
            });
        }
    }

    displayAddContactModal(display, submitObj) {
        if (submitObj) {
            this.setState({
                autocompleteValue: submitObj.contact_name || '',
            });
            this.requestData(this.state.autocompleteValue, 1, 20);
        }

        this.setState({
            showAddContactModal: display
        })
    }

    createNewContact() {
        this.setState({
            showAddContactModal: true,
            editContactItemData: {}
        })
    }

    editContactItem(item) {
        this.setState({
            editContactItemData: item,
            showAddContactModal: true
        })
    }

    render() {
        return (
            <>
                <Container>
                    <Row>
                        <Col>
                            <h4 className="p-3">Danh sách khách hàng</h4>
                            <div className={styles.functionsGroup}>
                                <input className="form-control mr-1" onKeyUp={(e) => { this.handleOnKeyup(e) }} onBlur={() => { this.handleOnBlurInput() }} onChange={(e) => this.handleChangeAutoCompleteInput(e)} type="text" placeholder="Tên khách hàng..." value={this.state.autocompleteValue} />
                                {this.state.showAutocomplete && this.state.autocompleteData.length > 0 ?
                                    <div className={styles.datalistPopup}>
                                        {(this.state.autocompleteData || []).map((item, idx) => {
                                            return (
                                                <div key={idx} className={styles.datalistItem} onClick={() => {
                                                    this.handleSelectAutoCompleteItem(item);
                                                }} title={item.contact_name}>{item.contact_name}</div>
                                            )
                                        })}
                                    </div> : null}
                                <button className="btn btn-primary mr-5" onClick={() => { this.filterByName() }}>Tìm kiếm</button>
                                <button className="btn btn-primary" onClick={() => { this.createNewContact() }}>Tạo KH mới</button>
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
                                        {this.state.searchData.map((item) => {
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
                                        })}
                                    </tbody>
                                </table>
                                <Pagination data={this.state.pagination} onSelectCurrentPage={this.handleCurrentPage} />
                            </div>
                        </Col>
                    </Row>
                </Container>
                {this.state.showAddContactModal ? <AddItemModal editData={this.state.editContactItemData} typeModal="newContact" inShow={this.state.showAddContactModal} inOnHide={(state) => {
                    this.displayAddContactModal(false, state);
                }}></AddItemModal> : null}
            </>
        )
    }
}

export default ContactManagerment;