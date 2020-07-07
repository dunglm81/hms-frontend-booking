import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import api_instance from '../../../utils/api';
import styles from './AddItemModal.module.css';

class AddItemModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fieldArr: [],
            title: '',
            dropdownArr: []
        }
    }

    componentDidMount() {
        this.getDropdownData();
    }

    getDropdownData() {
        let path = '';
        switch (this.props.typeModal) {
            case 'transactions':
                path = `api/all_payment_account`;
                break;
            case 'otherService':
                path = `api/get_all_other_service`;
                break;
            default:
        }
        api_instance.get(path)
            .then((response) => {
                if (response.status === 200 && response.data) {
                    console.log("TVT responseData = " + JSON.stringify(response.data));
                    this.setState({
                        dropdownArr: response.data
                    })
                    this.updateStateObj(this.props.typeModal, this.props.editData);
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    updateStateObj(typeModal, editData) {
        let title = '';
        let fieldArr = '';

        switch (typeModal) {
            case 'transactions':
                title = 'Thêm giao dịch thanh toán';
                fieldArr = [
                    {
                        key: 'account',
                        keyAlt: 'Tài khoản',
                        value: '',
                        account_id: this.state.dropdownArr[0].account_id,
                        account_name: this.state.dropdownArr[0].account_name,
                        account_type: this.state.dropdownArr[0].account_type,
                        validate: true
                    },
                    {
                        key: 'date',
                        keyAlt: 'Ngày',
                        value: new Date().toISOString().slice(0, 10),
                        validate: true
                    },
                    {
                        key: 'money',
                        keyAlt: 'Số tiền',
                        value: '',
                        validate: true
                    }
                ]
                break;
            case 'otherService':
                title = 'Thêm dịch vụ';
                fieldArr = [
                    {
                        key: 'service',
                        keyAlt: 'Dịch vụ',
                        value: '',
                        validate: true,
                        service_id: this.state.dropdownArr[0].service_id,
                        service_name: this.state.dropdownArr[0].service_name,
                        service_price: this.state.dropdownArr[0].service_price
                    },
                    {
                        key: 'quantity',
                        keyAlt: 'Số lượng',
                        value: '',
                        validate: true
                    },
                    {
                        key: 'unitprice',
                        keyAlt: 'Đơn giá',
                        value: '',
                        validate: true,
                        disabled: true
                    },
                    {
                        key: 'date',
                        keyAlt: 'Ngày',
                        value: new Date().toISOString().slice(0, 10),
                        validate: true
                    },
                    {
                        key: 'description',
                        keyAlt: 'Miêu tả',
                        value: '',
                        validate: true
                    }
                ]
                break;
            case 'newContact':
                title = 'Thêm khách hàng mới';
                fieldArr = [
                    {
                        key: 'name',
                        keyAlt: 'Tên KH',
                        value: '',
                        validate: true
                    },
                    {
                        key: 'phone',
                        keyAlt: 'Điện thoại',
                        value: '',
                        validate: true
                    },
                    {
                        key: 'mail',
                        keyAlt: 'Email',
                        value: '',
                        validate: true
                    },
                    {
                        key: 'contactId',
                        keyAlt: 'contactId',
                        value: '',
                        validate: true
                    }
                ]
                if (editData) {
                    fieldArr[0].value = editData.contact_name;
                    fieldArr[1].value = editData.phone_1 || editData.phone_2;
                    fieldArr[2].value = editData.email || '';
                    fieldArr[3].value = editData.contact_id || '';
                }
                break;
            default:
        }
        this.setState({
            title: title,
            fieldArr: fieldArr
        })
    }

    handleChangeInput(event, index) {
        console.log("TVT go to change input, name = " + event.target.name);
        let arr = JSON.parse(JSON.stringify(this.state.fieldArr));
        if (event.target.name === 'money') {
            // arr[index].value = event.target.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            arr[index].value = event.target.value;
        } else {
            console.log("TVT go to !== money");
            arr[index].value = event.target.value;
            if (event.target.name === 'account') {
                console.log("TVT go to account");
                const idx = this.state.dropdownArr.findIndex(item => item.account_name === event.target.value);
                if (idx !== -1) {
                    console.log("TVT go to idx !== -1");
                    arr[index].account_id = this.state.dropdownArr[idx].account_id;
                    arr[index].account_name = this.state.dropdownArr[idx].account_name;
                    arr[index].account_type = this.state.dropdownArr[idx].account_type;
                }
            } else if (event.target.name === 'service') {
                console.log("TVT go to name service");
                const idx = this.state.dropdownArr.findIndex(item => item.service_name === event.target.value);
                if (idx !== -1) {
                    console.log("TVT go to index !== -1");
                    arr[index].service_id = this.state.dropdownArr[idx].service_id;
                    arr[index].service_name = this.state.dropdownArr[idx].service_name;
                    arr[index].service_price = this.state.dropdownArr[idx].service_price;
                }
            }
        }

        this.setState({
            fieldArr: arr
        })
    }

    submitNewContact() {
        const submitData = {
            contact_name: this.state.fieldArr[0].value,
            phone_1: this.state.fieldArr[1].value,
            email: this.state.fieldArr[2].value,
            contact_id: this.state.fieldArr[3].value
        }

        api_instance.post(`api/new_contact`, this.state.fieldArr)
            .then((response) => {
                if (response.status === 200) {
                    this.props.inOnHide(submitData)
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    checkValidate() {
        let isValidate = true;
        const regexDate = /^([0-9]{4})\-([0-9]{2})\-([0-9]{2})$/;
        let arr = JSON.parse(JSON.stringify(this.state.fieldArr));

        switch (this.props.typeModal) {
            case 'transactions':
                arr[0].validate = true;
                arr[1].validate = regexDate.test(arr[1].value);
                arr[2].validate = (arr[2].value);
                break;
            case 'otherService':
                arr[0].validate = true;
                arr[1].validate = (arr[1].value);
                arr[2].validate = (arr[2].value);
                arr[3].validate = regexDate.test(arr[3].value);
                arr[4].validate = true;
                break;
            case 'newContact':
                const regexMail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                arr[0].validate = (arr[0].value);
                arr[1].validate = (arr[1].value);
                arr[2].validate = regexMail.test(arr[2].value)
                break;
            default:
        }
        isValidate = arr[0].validate && arr[1].validate && arr[2].validate;

        if (isValidate) {
            if (this.props.typeModal === 'newContact') {
                this.submitNewContact();
            } else {
                console.log("TVT this.state.fieldArr = " + JSON.stringify(this.state.fieldArr));
                this.props.inOnHide(this.state.fieldArr);
                this.setState({
                    title: '',
                    fieldArr: [],
                    dropdownArr: []
                })
            }
        } else {
            this.setState({
                fieldArr: arr
            })
        }
    }

    render() {
        return (
            <Modal
                show={this.props.inShow}
                onHide={this.props.inOnHide}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        {this.state.title}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {
                        (this.state.fieldArr || []).map((item, index) => {
                            let typeInput = 'text';
                            switch (item.key) {
                                case 'date':
                                    typeInput = 'date'
                                    break;
                                case 'phone':
                                    typeInput = 'number';
                                default:
                            }
                            if (index === 3 && this.props.typeModal === 'newContact') {
                                return null;
                            }
                            return (
                                <div key={index}>
                                    {item.validate ? null : <p className={styles.validateCustom}>{item.keyAlt} không hợp lệ</p>}
                                    <div className={styles.modalCustom + ' input-group mb-3'}>
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">{item.keyAlt}:</span>
                                        </div>
                                        {item.key !== 'account' && item.key !== 'service' ? <input onChange={(e) => {
                                            this.handleChangeInput(e, index)
                                        }} type={typeInput} className="form-control" value={item.value} name={item.key} disabled={ item.disabled ? 'disabled' : ''}/> :
                                            <select className="form-control" name={item.key} onChange={(e) => {
                                                this.handleChangeInput(e, index)
                                            }}>
                                                {(this.state.dropdownArr.map((item1, index1) => {
                                                    return <option key={index1}>{item1.account_name || item1.service_name}</option>
                                                }))}
                                            </select>}
                                    </div>
                                </div>
                            )
                        })
                    }
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        this.props.inOnHide()
                    }}>Hủy</Button>
                    <Button variant="primary" onClick={() => {
                        this.checkValidate();
                    }}>{(this.props.editData ? 'Lưu' : 'Thêm')}</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default AddItemModal;
