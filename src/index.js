import React from 'react';
import ReactDOM from 'react-dom';
// import 'bulma/css/bulma.min.css';
import axios from 'axios';
import './index.css';
import App from './App';
import Amplify from "aws-amplify";
import config from "./config";
import * as serviceWorker from './serviceWorker';
import { Auth } from 'aws-amplify';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  }
});

axios.defaults.baseURL = config.base_api;
// axios.interceptors.request.use(request => {
//   console.log()
//   return request;
// }, error => {
//   console.log(error)
// })

axios.interceptors.request.use(function (config) {
  return Auth.currentSession()
    .then(session => {
      // User is logged in. Set auth header on all requests
      config.headers.Authorization = 'Bearer ' + session.accessToken.jwtToken
      return Promise.resolve(config)
    })
    .catch(() => {
      // No logged-in user: don't set auth header
      return Promise.resolve(config)
    })
})




ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
