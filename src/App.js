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
import authService from "./services/auth.service";
import { ENVIRONMENT, FE_SUB_URL } from "./utils/constants";
import { log } from "./utils/util";


library.add(faEdit, faTimes);

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

    console.log("TVT user = " + JSON.stringify(this.state.user));

    if (!this.state.user) {
      window.location.href = "/login";
    } else {
      log("this.state.user", this.state.user);
      this.updateState("isAuthenticating", false);
    }
    this.updateState("isAuthenticating", false);
  }

  render() {
    return (
      !this.state.isAuthenticating &&
      this.state.user &&
      !this.state.isExpire && (
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
