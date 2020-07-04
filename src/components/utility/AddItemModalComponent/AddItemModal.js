import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import styles from './AddItemModal.module.css';

class AddItemModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fieldArr: [],
            title: ''
        }
    }

    componentDidMount() {
        this.updateStateObj(this.props.typeModal);
    }

    updateStateObj(typeModal) {
        let title = '';
        let fieldArr = '';

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
                        keyAlt: 'Tên dịch vụ',
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
            default:
        }
        isValidate = arr[0].validate && arr[1].validate && arr[2].validate;
        if (!isValidate) {
            this.setState({
                fieldArr: arr
            })
        }

        return isValidate;
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
                                    typeInput = 'number';
                                default:
                            }
                            return (
                                <div key={index}>
                                    {item.validate ? null : <p className={styles.validateCustom}>{item.keyAlt} không hợp lệ</p>}
                                    <div className={styles.modalCustom + ' input-group mb-3'}>
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">{item.keyAlt}:</span>
                                        </div>
                                        <input onChange={(e) => {
                                            this.handleChangeInput(e, index)
                                        }} type={typeInput} className="form-control" value={item.value} name={item.key} required />
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
                        if (this.checkValidate()) {
                            this.props.inOnHide(this.state)
                            this.setState({
                                title: '',
                                fieldArr: []
                            })
                        }
                    }}>Thêm</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default AddItemModal;
