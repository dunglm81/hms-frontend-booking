import { Subject } from "rxjs";
import apiService from "../services/api.service";
import { ENVIRONMENT, FE_SUB_URL } from "./constants";

const subject = new Subject();
export const dataService = {
  setData: data =>
    subject.next({
      value: data
    }),
  clearData: () => subject.next(),
  getData: () => subject.asObservable()
};

export function saveDataToStorage(key, valueObj) {
  localStorage.setItem(key, JSON.stringify(valueObj));
}

export function getDataToStorage(key) {
  return localStorage.getItem(key);
}

export function logFn(key, value) {
  if (ENVIRONMENT().enableDebug) {
    if (typeof value === "object") {
      console.log(`TVT ${key} = ` + JSON.stringify(value));
    } else {
      console.log(`TVT ${key} = ` + value);
    }
  }
}

export function routeToPage(history, path) {
  path = FE_SUB_URL + path;
  if (history) {
    history.push(path);
  } else {
    window.open(path, "_blank");
  }
}

export function createBookingServiceRooms(bookingId, fromDate, toDate) {
  return new Promise((resolve, reject) => {
    apiService.getBookingRoomItems(bookingId).then((response) => {
      if (response.status === 200) {
        let promiseArr = [];
        response.data.map(item => {
          for (let idx = 0; idx < item.quantity; idx++) {
            const obj = {
              booking_id: bookingId,
              booking_service_id: item.booking_service_id,
              service_id: item.service_id,
              service_name: item.service_name,
              room_id: null,
              room_name: "",
              using_date: item.using_date,
              room_index: (idx + 1),
              booking_checkin_date: fromDate,
              booking_checkout_date: toDate
            }
            const promise = apiService.insertBookingServiceRoom(obj);
            promiseArr.push(promise);
          }
          return item;
        })
        Promise.all(promiseArr).then(() => {
          resolve();
          // setTimeout(() => {
          //   routeToPage(history, `/viewbooking?booking_id=${bookingId}`);
          // }, 1000);
        }).catch((err) => {
          console.log(err);
          reject();
        })
      }
    }).catch((err) => {
      console.log(err);
      reject();
    })
  })
}
