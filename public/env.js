(function (window) {
  if (window) {
    window.__env = window.__env || {};
    window.__env.beUrl = `http://localhost/backend-booking`;
    window.__env.enableDebug = true;
    window.__env.feSubUrl = `/booking`;
    window.__env.redirectTabName = `reservationreport`;
    window.__env.refreshTokenTime = 5;
  }
})(this);
