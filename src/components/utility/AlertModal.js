import React  from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const AlertModal = (props) => {
  return (
    <Modal
    show={props.inShow}
    onHide={props.inOnHide}
      dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-custom-modal-styling-title">
          Kết quả xử lý
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{props.inMessage}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={props.inOnHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default AlertModal;
