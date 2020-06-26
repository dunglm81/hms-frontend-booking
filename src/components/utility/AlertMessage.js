import React  from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert'

const AlertMessage = (props) => {
  return (
    <Alert show={props.show} variant={props.alertType}>
      <Alert.Heading>{props.heading}</Alert.Heading>
      <p>{props.alertContent}</p>
      <hr />
      <div className="d-flex justify-content-end">
        <Button onClick={props.onClick} variant="outline-success">Close</Button>
      </div>
    </Alert>
  );
}
export default AlertMessage;
