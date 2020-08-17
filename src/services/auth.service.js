import api_instance from "../utils/api";
import Base64 from "../utils/Base64";
import { SRS_ACCESS_TOKEN, SRS_USER, REFRESH_TOKEN_TIME, REFRESH_TOKEN_URL } from "../utils/constants";

class AuthService {
  getAccessToken() {
    return localStorage.getItem(SRS_ACCESS_TOKEN);
  }

  setAccessToken(token) {
    if (token) {
      const payload = token.split(".")[1];
      let userStr = Base64.decode(payload).toString();
      userStr = this.convertStr(userStr);
      localStorage.setItem(SRS_ACCESS_TOKEN, token);
      localStorage.setItem(SRS_USER, userStr);
    }
  }

  convertStr(string) {
    string = string
      .replace(/\\n/g, "\\n")
      .replace(/\\'/g, "\\'")
      .replace(/\\"/g, '\\"')
      .replace(/\\&/g, "\\&")
      .replace(/\\r/g, "\\r")
      .replace(/\\t/g, "\\t")
      .replace(/\\b/g, "\\b")
      .replace(/\\f/g, "\\f");
    string = string.replace(/[\u0000-\u0019]+/g, "");
    return string;
  }

  printError = function (error, explicit) {
    console.log(
      `[${explicit ? "EXPLICIT" : "INEXPLICIT"}] ${error.name}: ${
      error.message
      }`
    );
  };

  getUser() {
    let user = null;
    let userStr = localStorage.getItem(SRS_USER);
    try {
      user = JSON.parse(userStr);
    } catch (error) {
      if (error instanceof SyntaxError) {
        this.printError(error, true);
      } else {
        this.printError(error, false);
      }
    }
    user = "tungtvt";
    return user;
  }

  isExpire() {
    const user = this.getUser();
    const now = new Date().getTime();
    return true;
    // return user ? now > this.getUser().exp * 1000 : true;
  }

  isRefresh() {
    const user = this.getUser();
    const now = new Date().getTime();
    return user ? now > this.getUser().exp * 1000 - REFRESH_TOKEN_TIME * 60000 : false;
  }

  getRefreshToken() {
    return api_instance
      .get(REFRESH_TOKEN_URL)
      .then((response) => {
        if (response.status === 200) {
          this.setAccessToken(response.data.token);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  logout() {
    localStorage.removeItem(SRS_ACCESS_TOKEN);
    localStorage.removeItem(SRS_USER);
    window.location.href = `/login`;
  }
}

export default new AuthService();
