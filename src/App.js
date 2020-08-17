import { library } from "@fortawesome/fontawesome-svg-core";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import React, { Component } from "react";
import {
  BrowserRouter as Router,


  Redirect, Route,
  Switch
} from "react-router-dom";
import ChangePassword from "./components/auth/ChangePassword";
import ForgotPassword from "./components/auth/ForgotPassword";
import Login from "./components/auth/LoginComponent/Login";
import Register from "./components/auth/Register";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Navbar from "./components/NavbarComponent/Navbar";
import BookingSearch from "./components/pages/BookingSearchComponent/BookingSearch";
import ContactManagerment from "./components/pages/ContactManagerment/ContactManagerment";
import CreateBooking from "./components/pages/CreateBookingComponent/CreateBooking";
import ReservationDetail from "./components/pages/ReservationDetail";
import ReservationReport from "./components/pages/ReservationReport";
import SummaryReportOne from "./components/pages/SummaryReportOneComponent/SummaryReportOne";
import ViewBooking from "./components/pages/ViewBookingComponent/ViewBooking";
import ProductAdmin from "./components/ProductAdmin";
import Products from "./components/Products";
import authService from "./services/auth.service";
import PrivateRoute from "./utils/PrivateRoute";


library.add(faEdit);

class App extends Component {
  state = {
    user: null,
    isExpire: false,
    isAuthenticating: true
  };

  updateState(key, value) {
    this.setState({
      [key]: value
    });
  }

  async componentDidMount() {
    this.updateState("user", await authService.getUser());
    this.updateState("isExpire", await authService.isExpire());
    this.updateState("isAuthenticating", false);
  }

  render() {
    return (
      !this.state.isAuthenticating && (
        <div className="App">
          <Router>
            <div>
              <Navbar />
              <Switch>
                {this.state.user && !this.state.isExpire ? (
                  <Redirect exact from="/" to="/home" />
                ) : (
                    <Redirect exact from="/" to="/login" />
                  )}
                <Route
                  exact
                  path="/login"
                  render={props =>
                    this.state.user && !this.state.isExpire ? (
                      <Redirect exact from="/" to="/home" />
                    ) : (
                        <Login {...props} />
                      )
                  }
                />
                <Route
                  exact
                  path="/register"
                  render={props =>
                    this.state.user && !this.state.isExpire ? (
                      <Redirect exact from="/" to="/home" />
                    ) : (
                        <Register {...props} />
                      )
                  }
                />
                <Route
                  exact
                  path="/forgotpassword"
                  render={props =>
                    this.state.user && !this.state.isExpire ? (
                      <Redirect exact from="/" to="/home" />
                    ) : (
                        <ForgotPassword {...props} />
                      )
                  }
                />
                <Route
                  exact
                  path="/changepassword"
                  render={props =>
                    this.state.user && !this.state.isExpire ? (
                      <Redirect exact from="/" to="/home" />
                    ) : (
                        <ChangePassword {...props} />
                      )
                  }
                />
                <PrivateRoute exact path="/home" component={Home} />
                <PrivateRoute exact path="/products" component={Products} />
                <PrivateRoute exact path="/admin" component={ProductAdmin} />
                <PrivateRoute
                  exact
                  path="/createbooking"
                  component={CreateBooking}
                />
                <PrivateRoute
                  exact
                  path="/contactmanagerment"
                  component={ContactManagerment}
                />
                <PrivateRoute
                  exact
                  path="/viewbooking"
                  component={ViewBooking}
                />
                <PrivateRoute
                  exact
                  path="/booking_search"
                  component={BookingSearch}
                />
                <PrivateRoute
                  exact
                  path="/summary_report_01"
                  component={SummaryReportOne}
                />
                <PrivateRoute
                  exact
                  path="/reservationreport"
                  component={ReservationReport}
                />
                <PrivateRoute
                  exact
                  path="/reservationdetail"
                  component={ReservationDetail}
                />
              </Switch>
              <Footer />
            </div>
          </Router>
        </div>
      )
    );
  }
}

export default App;
