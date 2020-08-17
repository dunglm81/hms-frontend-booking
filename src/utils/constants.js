export const ENVIRONMENT = () => {
  let env = {
    beUrl: `http://localhost:9001`,
    feUrl: `http://localhost:9000`,
    enableDebug: true,
    leftLogoUrl: "",
    leftLogoAlt: "",
    rightLogoUrl: "",
    rightLogoAlt: "",
    feSubUrl: "",
    beSubUrl: "",
    companyName: "",
    tabArr: [],
    refreshTokenTime: 5,
    timeOutFe: {
      minutes: 15,
      seconds: 0
    },
    timeOutApi: 300000,
    redirectTabName: "",
    filterDayNumber: 3
  };
  const browserWindow = window || {};
  const browserWindowEnv = browserWindow["__env"] || {};

  for (const key in browserWindowEnv) {
    if (browserWindowEnv.hasOwnProperty(key)) {
      env[key] = window["__env"][key];
    }
  }
  return env;
};

export const BE_URL = ENVIRONMENT().beUrl;

export const LOGIN_URL = `authentication/user_login`;
export const REFRESH_TOKEN_URL = `authentication/renew_jwt`;
export const REFRESH_TOKEN_TIME = ENVIRONMENT().refreshTokenTime;
export const SRS_ACCESS_TOKEN = `srs-access-token`;
export const SRS_USER = `srs-user`;
