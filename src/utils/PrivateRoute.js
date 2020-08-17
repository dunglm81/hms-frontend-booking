import React from "react";
import { Route, Redirect } from "react-router-dom";
import authService from "../services/auth.service";

function PrivateRoute({ component: Component, ...rest }) {
  const user = authService.getUser();

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

export default PrivateRoute;
