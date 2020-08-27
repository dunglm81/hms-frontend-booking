import { library } from "@fortawesome/fontawesome-svg-core";
import { faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
import React, { Component } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/NavbarComponent/Navbar";
import BookingSearch from "./components/pages/BookingSearchComponent/BookingSearch";
import ContactManagerment from "./components/pages/ContactManagerment/ContactManagerment";
import CreateBooking from "./components/pages/CreateBookingComponent/CreateBooking";
import ReservationReport from "./components/pages/ReservationReport";
import SummaryReportOne from "./components/pages/SummaryReportOneComponent/SummaryReportOne";
import ViewBooking from "./components/pages/ViewBookingComponent/ViewBooking";
import authService from "./services/auth.service";
import { ENVIRONMENT, FE_SUB_URL } from "./utils/constants";


library.add(faEdit, faTimes);

class App extends Component {
  state = {
    userStr: '',
    isExpire: false,
    isAuthenticating: true
  };

  updateState(key, value) {
    this.setState({
      [key]: value
    });
  }

  async componentDidMount() {
    this.updateState("userStr", await authService.getUserStr());
    this.updateState("isExpire", await authService.isExpire());

    if (!this.state.userStr) {
      window.location.href = "/login";
    } else {
      this.updateState("isAuthenticating", false);
    }
  }

  render() {
    return (
      !this.state.isAuthenticating &&
      this.state.userStr &&
      !this.state.isExpire &&
      (
        <div className="App">
          <Router>
            <div>
              <Navbar />
              <Switch>
                {
                  <Redirect
                    exact
                    from={FE_SUB_URL + "/"}
                    to={FE_SUB_URL + "/" + ENVIRONMENT().redirectTabName}
                  />
                }
                <Route
                  exact
                  path={FE_SUB_URL + "/reservationreport"}
                  render={(props) => <ReservationReport {...props} />}
                />
                <Route
                  exact
                  path={FE_SUB_URL + "/contactmanagerment"}
                  render={(props) => <ContactManagerment {...props} />}
                />
                <Route
                  exact
                  path={FE_SUB_URL + "/booking_search"}
                  render={(props) => <BookingSearch {...props} />}
                />
                <Route
                  exact
                  path={FE_SUB_URL + "/createbooking"}
                  render={(props) => <CreateBooking {...props} />}
                />
                <Route
                  exact
                  path={FE_SUB_URL + "/summary_report_01"}
                  render={(props) => <SummaryReportOne {...props} />}
                />
                <Route
                  exact
                  path={FE_SUB_URL + "/viewbooking"}
                  render={(props) => <ViewBooking {...props} />}
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
