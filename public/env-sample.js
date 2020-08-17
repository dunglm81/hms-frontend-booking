(function (window) {
  if (window) {
    window.__env = window.__env || {};

    window.__env.beUrl = `http://${window.location.hostname}:9002`;
    window.__env.feUrl = `http://${window.location.hostname}:9000`;
    window.__env.enableDebug = true;
    window.__env.leftLogoUrl = `logo-insmart.jpg`;
    window.__env.leftLogoAlt = `Insmart Logo`;
    window.__env.rightLogoUrl = `logo-manulife.jpg`;
    window.__env.rightLogoAlt = `Manulife Logo`;
    window.__env.feSubUrl = `/manulife`;
    window.__env.beSubUrl = `api/pdf_reporting/manulife`;
    window.__env.companyName = `Manulife`;
    window.__env.timeOutFe = {
      minutes: 15,
      seconds: 0
    };
    window.__env.timeOutApi = 600000;
    window.__env.redirectTabName = `approval_letter`;
    window.__env.filterDayNumber = 3;
    window.__env.tabArr = [
      {
        name: `approval_letter`,
        nameAlt: "Thư thông báo"
      },
      {
        name: `temporarily_close`,
        nameAlt: "Thư tạm đóng"
      },
      {
        name: `more_document`,
        nameAlt: "Thư bổ sung chứng từ"
      },
      {
        name: `declined`,
        nameAlt: "Thư từ chối"
      }
    ];
  }
})(this);
