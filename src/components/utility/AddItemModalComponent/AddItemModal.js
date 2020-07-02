import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

class AddItemModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            typeModal: '',
            fieldArr: [],
            title: '',
            date: '',
            money: '',
            account: '',
            service: '',
            quantity: '',
            unitprice: ''
        }
    }

    static getDerivedStateFromProps(props, state) {
        let title = '';
        let fieldArr = [];
        switch (props.typeModal) {
            case 'transactions':
                title = 'Thêm giao dịch thanh toán';
                fieldArr = [
                    {
                        key: 'date',
                        keyAlt: 'Ngày'
                    },
                    {
                        key: 'money',
                        keyAlt: 'Số tiền'
                    },
                    {
                        key: 'account',
                        keyAlt: 'Tài khoản'
                    }
                ]
                break;
            case 'otherService':
                title = 'Thêm dịch vụ';
                fieldArr = [
                    {
                        key: 'service',
                        keyAlt: 'Tên dịch vụ'
                    },
                    {
                        key: 'quantity',
                        keyAlt: 'Số lượng'
                    },
                    {
                        key: 'unitprice',
                        keyAlt: 'Đơn giá'
                    }
                ]
                break;
            default:
        }
        return {
            typeModal: props.typeModal,
            fieldArr: fieldArr,
            title: title
        }
    }

    handleChangeInput(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
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
                            return (
                                <div className="input-group mb-3" key={index}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">{item.keyAlt}:</span>
                                    </div>
                                    <input onChange={(e) => {
                                        this.handleChangeInput(e)
                                    }} type={(item.key === 'date') ? 'date' : 'text'} className="form-control" value={this.state[item.key]} name={item.key} required />
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
                        this.props.inOnHide(this.state)
                        this.setState({
                            title: '',
                            date: '',
                            money: '',
                            account: '',
                            service: '',
                            quantity: '',
                            unitprice: ''
                        })
                    }}>Thêm</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default AddItemModal;
