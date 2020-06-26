import { Auth } from 'aws-amplify';
import React, { Component } from 'react';

import api_instance from '../utils/api';

export default class Navbar extends Component {
  handleLogOut = async event => {
    event.preventDefault();
    try {
      Auth.signOut();
      this.props.auth.setAuthStatus(false);
      this.props.auth.setUser(null);
    } catch (error) {
      console.log(error.message);
    }
  }
  handleSendAPI = async event => {
    event.preventDefault();

    api_instance.post('get_menu', {
      firstName: 'Dung',
      lastName: 'Le'
    })
      .then(function (response) {
        console.log("OK");
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });


  }
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#"><img src="qh-logo.png" width="100px" alt="Quản lý ks Queen" loading="lazy" /></a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div id="navbarSupportedContent" className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Lễ tân
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="/reservationreport">Tình hình đặt phòng</a>
                <a className="dropdown-item" href="/reservationdetail">Booking</a>
                <a className="dropdown-item" href="/contact">Tạo KH</a>
                <a className="dropdown-item" href="/createbooking">Tạo Booking</a>

                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="/Search_booking">Tìm kiếm</a>
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="#" tabIndex="-1" aria-disabled="true">Nhà hàng</a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="#" tabIndex="-1" aria-disabled="true">Báo cáo</a>
            </li>
          </ul>



          {this.props.auth.isAuthenticated && this.props.auth.user && (
            <p>
              Hello {this.props.auth.user.username}
            </p>
          )}

          {!this.props.auth.isAuthenticated && (
            <div>
              <a href="/register" className="btn btn-outline-success my-2 my-sm-0">
                <strong>Register</strong>
              </a>
              <a href="/login" className="btn btn-outline-success my-2 my-sm-0">
                Log in
                    </a>
            </div>
          )}
          {this.props.auth.isAuthenticated && (
            <a href="/" onClick={this.handleLogOut} className="btn btn-outline-success my-2 my-sm-0">
              Log out
            </a>
          )}

          <a href="/" onClick={this.handleSendAPI} className="btn btn-outline-success my-2 my-sm-0">
            Call API
                </a>

        </div>
      </nav>
    )
  }
}
