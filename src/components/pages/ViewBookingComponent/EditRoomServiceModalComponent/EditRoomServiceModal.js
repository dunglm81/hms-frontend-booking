import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styles from './EditRoomServiceModal.module.css';


class EditRoomServiceModal extends React.Component {

    constructor(props) {
        super(props);

        const dateArr = props.data.dateArr || [];
        const roomArr = props.data.roomArr || [];
        const data = props.data.data || {};

        this.state = {
            dateArr: dateArr,
            roomArr: roomArr,
            data: data
        }
    }

    handleChangeInput(event, fieldType, index) {
        let data = JSON.parse(JSON.stringify(this.state.data));
        let dataArr = data[event.target.name];
        if (dataArr) {
            dataArr = dataArr.map((item, idx) => {
                if ((fieldType === 'quantity' || fieldType === 'unit_price') && idx >= index) {
                    item[fieldType] = event.target.value;
                } else if (idx === index) {
                    item[fieldType] = event.target.value;
                }
                return item;
            })

            this.setState({
                data: data
            })
        }
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
                                    {this.state.dateArr.map((item, index) => { return <th scope="col" key={index}>{item}</th> })}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.roomArr.map((item1, index1) => {
                                        return (
                                            <tr key={index1}>
                                                <th scope="row">{item1}</th>
                                                {
                                                    this.state.data[item1].map((item2, index2) => {
                                                        return (
                                                            <td key={index2} className={styles.tdCustom}>
                                                                <div>Số lượng:
                                                                <input onChange={(e) => {
                                                                        this.handleChangeInput(e, 'quantity', index2);
                                                                    }} type="number" className="form-control" value={item2.quantity} name={item1} />
                                                                </div>
                                                                <div>Đơn giá:
                                                                <input onChange={(e) => {
                                                                        this.handleChangeInput(e, 'unit_price', index2);
                                                                    }} type="number"
                                                                        className={"form-control " + (item2.quantity && (!item2.unit_price || item2.unit_price === "0") ? styles.alertBorder : "")} value={item2.unit_price} name={item1} />
                                                                </div>
                                                                {(item2.quantity && (!item2.unit_price || item2.unit_price === "0")) ? <div className={styles.alertChooseUnitPrice}>Hãy chọn đơn giá!</div> : null}
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
                        this.props.inOnHide(this.state.data);
                        this.setState({
                            dateArr: [],
                            roomArr: [],
                            data: {}
                        })
                    }}>Lưu</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default EditRoomServiceModal;
