import axios from 'axios';
import config from "../config";
import { Auth } from 'aws-amplify';
import Amplify from "aws-amplify";

//var idToken = localStorage.getItem('CognitoIdentityServiceProvider.7vi3jfs4t8htrbgd9i7dhms6ib.lmdung81.idToken');
Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  }
});

var api_instance = axios.create({
  baseURL: config.base_api
  /* other custom settings */
});

api_instance.interceptors.request.use(function (config) {
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
export default api_instance;
