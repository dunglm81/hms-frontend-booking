import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import api_instance from '../../../../utils/api';
import styles from './UpdateDescriptionModal.module.css';

class UpdateDescriptionModal extends React.Component {
    constructor(props) {
        super(props);
        const description = props.data.description || '';
        this.state = {
            description: description
        }
    }

    componentDidMount() {

    }

    updateDescription(event) {
        this.setState({
            description: event.target.value
        })
    }

    submitData() {
        const submitObj = {
            booking_id: this.props.data.bookingId,
            description: this.state.description
        }
        api_instance.post(`api/update_booking_description`, submitObj)
            .then((response) => {
                if (response.status === 200) {
                    this.props.inOnHide(this.state.description);
                }
            })
            .catch((error) => {
                console.log(error);
            })
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
                        Cập nhật ghi chú
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <textarea className={styles.textareaCustom} value={this.state.description} onChange={(e) => this.updateDescription(e)}></textarea>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        this.props.inOnHide()
                    }}>Hủy</Button>
                    <Button variant="primary" onClick={() => {
                        this.submitData();
                    }}>Cập nhật</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default UpdateDescriptionModal;