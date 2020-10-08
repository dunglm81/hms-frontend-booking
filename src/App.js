import { library } from "@fortawesome/fontawesome-svg-core";
import { faEdit, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import React, { Component } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Footer from "./components/FooterComponent/Footer";
import Navbar from "./components/NavbarComponent/Navbar";
import BookingSearch from "./components/pages/BookingSearchComponent/BookingSearch";
import BookingServiceRoom from "./components/pages/BookingServiceRoomComponent/BookingServiceRoom";
import ContactManagerment from "./components/pages/ContactManagerment/ContactManagerment";
import CreateBooking from "./components/pages/CreateBookingComponent/CreateBooking";
import ReservationReport from "./components/pages/ReservationReportComponent/ReservationReport";
import RoomPlan from "./components/pages/RoomPlanComponent/RoomPlan";
import SummaryReportOne from "./components/pages/SummaryReportOneComponent/SummaryReportOne";
import ViewBooking from "./components/pages/ViewBookingComponent/ViewBooking";
import authService from "./services/auth.service";
import { FE_SUB_URL, REDIRECT_TAB_NAME } from "./utils/constants";


library.add(faEdit, faTimes, faSave);

class App extends Component {
  state = {
    userStr: authService.getUserStr(),
    isExpire: authService.isExpire()
  };

  updateState(key, value) {
    this.setState({
      [key]: value
    });
  }

  async componentDidMount() {
    if (!this.state.userStr) {
      authService.logout();
    }
  }

  render() {
    return (
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
                    to={FE_SUB_URL + "/" + REDIRECT_TAB_NAME}
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
                <Route
                  exact
                  path={FE_SUB_URL + "/booking_service_room"}
                  render={(props) => <BookingServiceRoom {...props} />}
                />
                <Route
                  exact
                  path={FE_SUB_URL + "/roomplan"}
                  render={(props) => <RoomPlan {...props} />}
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
