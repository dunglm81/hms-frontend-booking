import { Subject } from "rxjs";
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
