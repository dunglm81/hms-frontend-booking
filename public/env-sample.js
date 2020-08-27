(function (window) {
  if (window) {
    window.__env = window.__env || {};

    window.__env.beUrl = `http://${window.location.hostname}:3333`;
    window.__env.enableDebug = true;
    window.__env.feSubUrl = `/booking`;
    window.__env.beSubUrl = `api/`;
    window.__env.timeOutApi = 600000;
    window.__env.redirectTabName = `reservationreport`;
  }
})(this);
