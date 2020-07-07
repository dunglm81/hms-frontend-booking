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
            customerType: ['Cá nhân', 'Doanh nghiệp']
        }
    }

    componentDidMount() {
        this.updateStateObj(this.props.typeModal, this.props.editData);
    }

    updateStateObj(typeModal, editData) {
        let title = '';
        let fieldArr = '';
        let customerType = this.state.customerType[0];

        switch (typeModal) {
            case 'transactions':
                title = 'Thêm giao dịch thanh toán';
                fieldArr = [
                    {
                        key: 'date',
                        keyAlt: 'Ngày',
                        value: '',
                        validate: true
                    },
                    {
                        key: 'money',
                        keyAlt: 'Số tiền',
                        value: '',
                        validate: true
                    },
                    {
                        key: 'account',
                        keyAlt: 'Tài khoản',
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
                        validate: true
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
                        key: 'category',
                        keyAlt: 'Loại KH',
                        value: customerType,
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
                    fieldArr[4].value = editData.contact_id || '';
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
        let arr = JSON.parse(JSON.stringify(this.state.fieldArr));
        arr[index].value = event.target.value;
        this.setState({
            fieldArr: arr
        })
    }

    submitNewContact() {
        const submitData = {
            contact_name: this.state.fieldArr[0].value,
            phone_1: this.state.fieldArr[1].value,
            email: this.state.fieldArr[2].value,
            customerType: this.state.fieldArr[3].value,
            contact_id: this.state.fieldArr[4].value
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
        let arr = JSON.parse(JSON.stringify(this.state.fieldArr));

        switch (this.props.typeModal) {
            case 'transactions':
                const regexDate = /^([0-9]{4})\-([0-9]{2})\-([0-9]{2})$/;
                arr[0].validate = regexDate.test(arr[0].value);
                arr[1].validate = (arr[1].value);
                arr[2].validate = (arr[2].value);
                break;
            case 'otherService':
                arr[0].validate = (arr[0].value);
                arr[1].validate = (arr[1].value);
                arr[2].validate = (arr[2].value);
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
                this.props.inOnHide(this.state)
                this.setState({
                    title: '',
                    fieldArr: []
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
                                case 'money':
                                case 'phone':
                                    typeInput = 'number';
                                default:
                            }
                            if (index === 4 && this.props.typeModal === 'newContact') {
                                return null;
                            }
                            return (
                                <div key={index}>
                                    {item.validate ? null : <p className={styles.validateCustom}>{item.keyAlt} không hợp lệ</p>}
                                    <div className={styles.modalCustom + ' input-group mb-3'}>
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">{item.keyAlt}:</span>
                                        </div>
                                        {item.key !== 'category' ? <input onChange={(e) => {
                                            this.handleChangeInput(e, index)
                                        }} type={typeInput} className="form-control" value={item.value} name={item.key} required /> :
                                            <select className="form-control" name="category" onChange={(e) => {
                                                this.handleChangeInput(e, index)
                                            }}>
                                                {(this.state.customerType.map((item1, index1) => {
                                                    return <option key={index1}>{item1}</option>
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
