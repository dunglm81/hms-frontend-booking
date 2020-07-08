import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

class ConfirmModal extends React.Component {
    constructor(props) {
        super(props);
    }

    renderSwitchTitle() {
        let title = '';
        switch (this.props.typeModal) {
            case 'transactions':
                title = 'Xóa giao dịch thanh toán';
                break;
            case 'otherService':
                title = 'Xóa dịch vụ';
                break;
            case 'cancelBooking':
                title = 'Hủy Booking';
            default:
        }
        return title;
    }

    renderSwitchDescription() {
        let description = '';
        switch (this.props.typeModal) {
            case 'transactions':
                description = 'Bạn chắc chắn muốn xóa giao dịch này?';
                break;
            case 'otherService':
                description = 'Bạn chắc chắn muốn xóa dịch vụ này?';
                break;
            case 'cancelBooking':
                description = 'Bạn chắc chắn muốn hủy Booking này?';
            default:
        }
        return description;
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
                        {this.renderSwitchTitle()}

                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>{this.renderSwitchDescription()}</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        this.props.inOnHide(undefined)
                    }}>Hủy</Button>
                    <Button variant="primary" onClick={() => {
                        this.props.inOnHide(true)
                    }}>Xác nhận xóa</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default ConfirmModal;
