import "./Navbar.css";
import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Navbar extends Component {
  render() {
    return (
      <div className="sticky-top container-custom">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="/">
            <img
              src="qh-logo.png"
              width="100px"
              alt="Quản lý ks Queen"
              loading="lazy"
            />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div id="navbarSupportedContent" className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <a className="nav-link" href="/">
                  Home <span className="sr-only">(current)</span>
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="/"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Lễ tân
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li className="dropdown-item">
                    <Link className="nav-link" to="/reservationreport">
                      Tình hình đặt phòng
                    </Link>
                  </li>
                  <li className="dropdown-item">
                    <Link className="nav-link" to="/reservationdetail">
                      Booking
                    </Link>
                  </li>
                  <li className="dropdown-item">
                    <Link className="nav-link" to="/contact">
                      Tạo KH
                    </Link>
                  </li>
                  <li className="dropdown-item">
                    <Link className="nav-link" to="/createbooking">
                      Tạo Booking
                    </Link>
                  </li>
                  <li className="dropdown-item">
                    <Link className="nav-link" to="/contactmanagerment">
                      QL Khách hàng
                    </Link>
                  </li>
                  <li className="dropdown-item">
                    <Link className="nav-link" to="/viewbooking?booking_id=31">
                      View Booking
                    </Link>
                  </li>
                  <li className="dropdown-item">
                    <Link className="nav-link" to="/booking_search">
                      Truy vấn Booking
                    </Link>
                  </li>
                  <li className="dropdown-item">
                    <Link className="nav-link" to="/summary_report_01">
                      Báo cáo 01
                    </Link>
                  </li>
                  <div className="dropdown-divider"></div>
                  <li className="dropdown-item">
                    <Link className="nav-link" to="/Search_booking">
                      Tìm kiếm
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link disabled"
                  href="/"
                  tabIndex="-1"
                  aria-disabled="true"
                >
                  Nhà hàng
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link disabled"
                  href="/"
                  tabIndex="-1"
                  aria-disabled="true"
                >
                  Báo cáo
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}
