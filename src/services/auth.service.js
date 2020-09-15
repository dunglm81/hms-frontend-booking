import api_instance from "../utils/api";
import Base64 from "../utils/Base64";
import { HMS_ACCESS_TOKEN, HMS_EXPIRE, HMS_ORG, HMS_USER, REFRESH_TOKEN_URL, HMS_ORG_CODE } from "../utils/constants";

class AuthService {
  getAccessToken() {
    return localStorage.getItem(HMS_ACCESS_TOKEN);
  }

  getExpire() {
    return localStorage.getItem(HMS_EXPIRE);
  }

  getUserStr() {
    return localStorage.getItem(HMS_USER);
  }

  setAccessToken(token) {
    if (token) {
      const payload = token.split(".")[1];
      const userStr = this.convertStr(Base64.decode(payload).toString());
      const userStrArr = userStr.split(",");
      const idx = userStrArr.findIndex((item) => item.includes('"exp":'));
      if (idx !== -1) {
        localStorage.setItem(HMS_EXPIRE, userStrArr[idx].split(":")[1]);
        localStorage.setItem(HMS_ACCESS_TOKEN, token);
        localStorage.setItem(HMS_USER, userStr);
      }
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

  isExpire() {
    const expire = this.getExpire();
    const now = new Date().getTime();
    return expire ? now > parseInt(expire) * 1000 : true;
  }

  isRefresh() {
    const expire = this.getExpire();
    const now = new Date().getTime();
    return expire ? now > parseInt(expire) * 1000 - 300000 : false;
  }

  getOrg() {
    let org = null;
    let orgStr = localStorage.getItem(HMS_ORG);
    try {
      org = JSON.parse(orgStr);
    } catch (error) {
      if (error instanceof SyntaxError) {
        this.printError(error, true);
      } else {
        this.printError(error, false);
      }
    }
    return org;
  }

  getOrgCode() {
    return localStorage.getItem(HMS_ORG_CODE);
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
    localStorage.removeItem(HMS_ACCESS_TOKEN);
    localStorage.removeItem(HMS_USER);
    localStorage.removeItem(HMS_EXPIRE);
    localStorage.removeItem(HMS_ORG);
    localStorage.removeItem(HMS_ORG_CODE);
    window.location.href = `/login`;
  }
}

export default new AuthService();
