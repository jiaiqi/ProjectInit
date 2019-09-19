/* eslint-disable */
import Vue from 'vue'
import devSrv from './spa_mock'


function init() {
  let backendIpAddr = null;
  
  if (window.top.pathConfig && window.top.pathConfig.gateway) {
    // 如果外层有就用外层的路径配置
    let parentServerPath = window.top.pathConfig.gateway;
    if (parentServerPath.endsWith("/")) {
      backendIpAddr = parentServerPath.substring(0, parentServerPath.length - 1)
    } else {
      backendIpAddr = parentServerPath
    }
  } else {
    // 单vue页面使用配置的后台地址
    if(sessionStorage.getItem("bx_auth_ticket") === null ){
      devSrv.dummy()
    }
    let server_cfg = devSrv.server_cfg
    backendIpAddr = server_cfg.back_server_protocol + "://" + server_cfg.back_server_ip + ":" + server_cfg.back_server_port;
  }
  top.window.backendIpAddr = backendIpAddr;

  let defaultApp = (window.frameElement && window.frameElement.dataset["app"]) || (top.window.pathConfig && top.window.pathConfig.application);

  var service_api = {
    selectOne: backendIpAddr + "/" + defaultApp + "/select",
    select: backendIpAddr + "/" + defaultApp + "/select",
    selectByUser: backendIpAddr + "/" + defaultApp + "/select",
    operate: backendIpAddr + "/" + defaultApp + "/operate",
    approval: backendIpAddr + "/" + defaultApp + "/process/approval",

    uploadFile: backendIpAddr + "/file/upload",
    downloadFile: backendIpAddr + "/file/download?filePath=",
    deleteFile: backendIpAddr + "/file/delete",

    exportExcel: backendIpAddr + "/" + defaultApp + "/export/exportExcel",
    importExcel: backendIpAddr + "/" + defaultApp + "/bizDataImport",

    qrcode: backendIpAddr + "/" + defaultApp + "/bxsys/qrcode",

    // startProc: backendIpAddr + defaultApp + "/bxsys/startProc",
    // saveDraft: backendIpAddr + defaultApp + "/bxsys/saveDraft",
    // startDataProc: backendIpAddr + defaultApp + "/bxsys/startDataProc",
  }

  top.window.serviceApi = service_api;

  Vue.prototype.service_api = service_api;

  Vue.config.productionTip = false;

  // http conf, 请求跨域
  // Vue.http.options.xhr = {
  //   withCredentials: true
  // };



  // Vue.http.interceptors.push((request, next) => {
  //   request.credentials = true;
  //   request.headers.set('bx_auth_ticket', sessionStorage.getItem("bx_auth_ticket"))

  //   return function (response) {
  //     if (response.data.state == "FAILURE") {
  // if (response.data.resultCode == '0011') {
  //   if (sessionStorage.getItem("need_login_flag") != "need_login") {
  //     sessionStorage.setItem("need_login_flag", "need_login");
  //     if (this.getRootWindow().layer) {

  //       var login_page = "/main/login.html"
  //       this.getRootWindow().layer.open({
  //         title: false,
  //         type: 2,
  //         content: login_page,
  //         closeBtn: 0,
  //         area: ['300px', '350px'],
  //         shade: 0.9
  //       });

  //           } else {
  //             // 当vue页面在iframe中时，跳转到登录页面
  //             if (top !== window) {
  //               window.location.href = "/main/index.html";

  //             }
  //           }
  //         }

  //       } else if (response.data.resultCode == '0000') {

  //         if (sessionStorage.getItem("need_login_flag") != "need_login") {
  //           alert(response.data.resultMessage);
  //         }

  //       } else {

  //         if (sessionStorage.getItem("need_login_flag") != "need_login") {
  //           alert(response.data.resultMessage);
  //         }

  //       }


  //     }
  //   };

  //   next();

  // });
}

export default init;