import React from "react";
import { Button, Form } from "react-bootstrap";

import styles from "./Login.module.css";
import authService from "../../../services/auth.service";
import { log } from "../../../utils/util";
import { LOGIN_URL } from "../../../utils/constants";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "trinhvutung87@gmail.com",
      password: "123456",
      isValidDate: true
    };
  }

  handleChangeInput(event) {
    this.updateState(event.target.name, event.target.value);
  }

  checkValidation() {
    let isValidDate = true;
    this.updateState("isValidDate", isValidDate);
    return isValidDate;
  }

  updateState(key, value) {
    this.setState({
      [key]: value
    });
  }

  handleSubmitInput(event) {
    event.preventDefault();
    const body = {
      email: this.state.username,
      password: this.state.password
    };

    authService
      .login(LOGIN_URL, body)
      .then(response => {
        if (response.status === 200) {
          log("response.data", response.data);
          authService.setAccessToken(response.data.token);
          this.props.history.push("/home");
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className={styles.formCustom}>
        <div className={styles.formContainer}>
          <Form
            onSubmit={e => {
              this.handleSubmitInput(e);
            }}
          >
            <Form.Group controlId="formBasicEmail">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="username"
                name="username"
                value={this.state.username}
                onChange={e => {
                  this.handleChangeInput(e);
                }}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={this.state.password}
                onChange={e => {
                  this.handleChangeInput(e);
                }}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default Login;
