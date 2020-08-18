import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FE_SUB_URL, NAVBAR_DROPDOWN_ARR } from "../../utils/constants";
import "./Navbar.css";

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
                  {NAVBAR_DROPDOWN_ARR.map((item, index) => {
                    return (
                      <li className="dropdown-item" key={index}>
                        <Link className="nav-link" to={FE_SUB_URL + item.link}>
                          {item.value}
                        </Link>
                      </li>
                    );
                  })}
                  <div className="dropdown-divider"></div>
                  <li className="dropdown-item">
                    <Link className="nav-link" to={FE_SUB_URL + "/search_booking"}>
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
