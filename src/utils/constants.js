export const ENVIRONMENT = () => {
  let env = {
    beUrl: `http://localhost:9001`,
    enableDebug: true,
    feSubUrl: "",
    beSubUrl: "",
    refreshTokenTime: 5,
    redirectTabName: ""
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
export const HMS_ACCESS_TOKEN = `hms-access-token`;
export const HMS_USER = `hms-user`;
export const HMS_EXPIRE = `hms-expire`;

export const NAVBAR_DROPDOWN_ARR = [
  {
    key: "reservationreport",
    value: "Tình hình đặt phòng",
    link: "/reservationreport"
  },
  {
    key: "reservationdetail",
    value: "Booking",
    link: "/reservationdetail"
  },
  {
    key: "createbooking",
    value: "Tạo Booking",
    link: "/createbooking"
  },
  {
    key: "contactmanagerment",
    value: "QL Khách hàng",
    link: "/contactmanagerment"
  },
  {
    key: "booking_search",
    value: "Truy vấn Booking",
    link: "/booking_search"
  },
  {
    key: "summary_report_01",
    value: "Báo cáo 01",
    link: "/summary_report_01"
  },
  {
    key: "booking_service_room",
    value: "Xếp phòng",
    link: "/booking_service_room"
  }
];

export const FE_SUB_URL = ENVIRONMENT().feSubUrl;
export const CREATE_NEW_CONTACT_URL = `/api/new_contact`;

export const API_BOOKING_SERVICE_ROOM = `api/booking_service_room`;