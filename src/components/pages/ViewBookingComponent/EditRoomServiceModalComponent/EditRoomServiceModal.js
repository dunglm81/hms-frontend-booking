import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import styles from './EditRoomServiceModal.module.css';

class EditRoomServiceModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    handleChangeInput(event, fieldType, itemId) {
        const dataArr = this.state.data;
        const idx = dataArr.findIndex(item => item.id === itemId);
        if (idx === -1) {
            dataArr.push({
                id: itemId,
                [fieldType]: event.target.value
            })
        } else {
            dataArr[idx][fieldType] = event.target.value;
        }

        this.setState({
            data: dataArr
        });
    }

    render() {
        return (
            <Modal
                show={this.props.inShow}
                onHide={this.props.inOnHide}
                dialogClassName={styles.modalCustom}
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        Dịch vụ phòng ở
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="table-responsive mt-3">
                        <table className="table table-sm table-hover">
                            <thead>
                                <tr>
                                    <th scope="col"></th>
                                    {this.props.data.dateArr.map((item, index) => { return <th scope="col" key={index}>{item}</th> })}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.props.data.roomArr.map((item1, index1) => {
                                        return (
                                            <tr key={index1}>
                                                <th scope="row">{item1}</th>
                                                {
                                                    this.props.data.data[item1].map((item2, index2) => {
                                                        return (
                                                            <td key={index2} className={styles.tdCustom}>
                                                                <div>Số lượng:
                                                                <input onChange={(e) => {
                                                                        this.handleChangeInput(e, 'quantity', item2.booking_service_id);
                                                                    }} type="number" className="form-control" defaultValue={item2.quantity} />
                                                                </div>
                                                                <div>Đơn giá:
                                                                <input onChange={(e) => {
                                                                        this.handleChangeInput(e, 'unit_price', item2.booking_service_id);
                                                                    }} type="number" className="form-control" defaultValue={item2.unit_price} />
                                                                </div>
                                                            </td>
                                                        )
                                                    })
                                                }
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        this.props.inOnHide()
                    }}>Hủy</Button>
                    <Button variant="primary" onClick={() => {
                        this.props.inOnHide(this.state);
                        this.setState({
                            data: []
                        })
                    }}>Lưu</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default EditRoomServiceModal;
