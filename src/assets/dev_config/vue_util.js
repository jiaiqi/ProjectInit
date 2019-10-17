/* eslint-disable */
import moment from "moment";
moment.locale("zh-CN")
import Vue from "vue";
import _ from "lodash";

function init_util() {
  const eventBus = new Vue()
  const common_page_path = {
    "detail": "/vpages/index.html#/detail",
    "list": "/vpages/index.html#/list",
    "simple-add": "/vpages/index.html#/simple-add",
    "simple-update": "/vpages/index.html#/simple-update",
    "start-proc": "/vpages/index.html#/startproc",
    "procdetail": "/vpages/index.html#/procdetail",
    "procdetail_v2": "/vpages/index.html#/v2/procdetail",
    "start-proc_v2": "/vpages/index.html#/v2/startproc",
    "editgrid": "/vpages/index.html#/editgrid",
  }

  Vue.prototype.emitEvent = function (eventType, data) {
    let eventKey = eventType + "#" + this.getNodePath();
    eventBus.$emit(eventKey, data)
  }

  Vue.prototype.onEvent = function (nodePath, eventType, callback) {
    let eventKey = eventType + "#" + nodePath;
    eventBus.$on(eventKey, callback)
  }

  /**
   * resolve default srvapp from vue component
   * @returns {*}
   */
  Vue.prototype.resolveDefaultSrvApp = function () {
    let app = null;
    // search $srvApp from node to root
    let node = this;
    while (!node.$srvApp) {
      if (node.$parent) {
        node = node.$parent;
      } else {
        break;
      }
    }

    if (node.$srvApp) {
      app = node.$srvApp;
    } else {
      // whole path does not have $srvApp,
      // try  page level
      if (this.$route && this.$route.query && this.$route.query.srvApp) {
        app = this.$route.query.srvApp;
      } else {
        // try top level
        let defaultApp = (window.frameElement && window.frameElement.dataset["app"]) || (top.window.pathConfig && top.window.pathConfig.application);
        app = defaultApp;
      }
    }

    return app;
  }


  /**
   *
   * @param operate_type: operate | select
   * @param service
   * @param app
   * @returns {string}
   */
  Vue.prototype.getServiceUrl = function (operate_type, service, app,url) {
    app = app || this.resolveDefaultSrvApp();
    let backendIpAddr = null;
    let pathConfig = sessionStorage.getItem('pathConfig')
    pathConfig = JSON.parse(pathConfig);
    if (window.top.pathConfig && window.top.pathConfig.gateway) {
      // 如果外层有就用外层的路径配置
      let parentServerPath = window.top.pathConfig.gateway;
      if (parentServerPath.endsWith("/")) {
        backendIpAddr = parentServerPath.substring(0, parentServerPath.length - 1)
      } else {
        backendIpAddr = parentServerPath
      }
    }else if(pathConfig !== null){
      let parentServerPath = pathConfig.gateway;
      if (parentServerPath.endsWith("/")) {
        backendIpAddr = parentServerPath.substring(0, parentServerPath.length - 1)
      } else {
        backendIpAddr = parentServerPath
      }
    }else{
      backendIpAddr = top.backendIpAddr
    }
    if(url){
      return url + "/" + app + "/" + (operate_type !== '' ?operate_type + '/':'')   + service;
    }else{
      return backendIpAddr + "/" + app + "/" +  (operate_type !== '' ?operate_type + '/':'') + service;
    }
  }

  /**
   *
   * @param operate
   * @param service
   * @param app
   * @returns {string}
   */
  Vue.prototype.downloadexport = function (uuid) {

    var app = this.resolveDefaultSrvApp();
    var page_origin = (window.location.protocol + "//" + window.location.hostname);
    var gateway_origin = (window.top.pathConfig.gateway_protocol + "://" + window.top.pathConfig.gateway_ip);
    //跨域暂时没有想到好的解决方案
    if (page_origin == gateway_origin) {
      try {

        var url = backendIpAddr + "/" + app + "/downloadexport/" + uuid;
        location.href = url;
        var loading = this.openLoading();

        const checkToken = function () {
          var token = getCookie("downloadToken");
          if (token && token == uuid) {
            clearTimeout(downloadTimer);
            loading.close();
          }
        }

        //获取cookie
        const getCookie = function (cookieName) {
          var strCookie = document.cookie;
          var arrCookie = strCookie.split(";");
          for (var i = 0; i < arrCookie.length; i++) {
            var arr = arrCookie[i].split("=");
            if (cookieName == arr[0].trim()) {
              return arr[1];
            }
          }
          return "";
        }

        var downloadTimer = setInterval(checkToken, 1000);
      } catch (e) {
        alert(e.name + ": " + e.message);
      }

    } else {
      var url = backendIpAddr + "/" + app + "/downloadexport/" + uuid;
      window.location.href = url;

    }

  }


  //打开遮罩
  Vue.prototype.openLoading = function () {

    const loading = this.$loading({
      lock: true,
      text: '加载中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    return loading;

  }


  /**
   *
   * @param operate
   * @param service
   * @param app
   * @returns {string}
   */
  Vue.prototype.downloadFailimport = function () {
    var app = this.resolveDefaultSrvApp();
    var url = backendIpAddr + "/" + app + "/downloadImportFail";


    let bx_auth_ticket = sessionStorage.getItem("bx_auth_ticket");
    var params_header = {
      "bx_auth_ticket": bx_auth_ticket
    };

    window.location.href = url + "?bx_auth_ticket=" + bx_auth_ticket;
  }


  Vue.prototype.getRootWindow = function (_window) {
    _window = _window || window;
    if (_window.top !== _window) {
      return this.getRootWindow(_window.top);
    } else {
      return _window;
    }
  };

  /**
   * 查询serviceCols, use an vuex cache here
   * @param service_name
   * @param use_type
   * @returns {*}
   */
  Vue.prototype.loadColsV2 = function (service_name, use_type) {
    let fullServiceName = this.resolveDefaultSrvApp() + "." + service_name;
    let cacheP = this.$store && this.$store.getters.getSrvCols(fullServiceName, use_type);
    if (cacheP) {
      return cacheP
    }

    let loadedP = this.doLoadColsV2(service_name, use_type)
    this.$store && this.$store.commit('addSrvCols', {
      service: fullServiceName,
      useType: use_type,
      response: loadedP,
    })

    return loadedP
  }


  function getV2RequestData(service_name, use_type) {
    return {
      serviceName: 'srvsys_service_columnex_v2_select',
      colNames: ['*'],
      condition: [
        {
          colName: 'service_name',
          value: service_name,
          ruleType: 'eq'
        },
        {
          colName: 'use_type',
          value: use_type,
          ruleType: 'eq'
        }
      ],
      order: [
        {
          colName: "seq",
          orderType: "asc"
        }
      ]
    };
  }

  Vue.prototype.doLoadColsV2 = function (service_name, use_type) {
    var data = getV2RequestData(service_name, use_type);

    var url = this.getServiceUrl("select", "srvsys_service_columnex_v2_select");
    url = url + "?colsel_v2=" + service_name;
    return this.$http.post(url, data).then(response => {
      //region mock data
      return response;
    })
  };

  Vue.prototype.loadHotTableData = function (metadata) {
    if (!this.$store) {
      return;
    }

    let table = metadata.table;
    let service = metadata.selectService;

    let cached = this.$store.getters.getTableData(table);
    if (cached) {
      return cached
    }

    // commit a placeholder for now
    this.$store && this.$store.commit("addTableData", {
      table,
      data: [],
    })

    var url = this.getServiceUrl("select", service, metadata.srvApp);
    var params = {
      serviceName: service,
      colNames: ['*'],
    };
    url = url + "?" + service;

    this.$http.post(url, params)
      .then(response => {
        let data = response.data.data
        this.$store.commit("addTableData", {
          table,
          data,
        })
      });
  };


  /**查询生成导出excel*/
  Vue.prototype.genExportExcel = function (service_name, condition, page, order, group, mapcondition) {
    // var url = this.service_api.exportExcel;
    var url = this.getServiceUrl("export", service_name);
    return this.doSelect(url, service_name, condition, page, order, group, mapcondition)
  };


  /**业务导出*/
  Vue.prototype.bizExport = function (service_name, condition, data) {
    // var url = this.service_api.exportExcel;
    var url = this.getServiceUrl("export", service_name);
    var params = {
      "serviceName": service_name,
      "colNames": ['*'],
      "condition": condition || [],
      "listData": data
    };
    url = url + "?" + service_name;
    return this.$http.post(url, params);

  };

  /**查询列表*/
  Vue.prototype.select = function (service_name, condition, page, order, group, mapcondition, app) {
    var url = this.getServiceUrl("select", service_name, app);
    return this.doSelect(url, service_name, condition, page, order, group, mapcondition)
  }

  Vue.prototype.selectFileList = function (file_no) {
    let serviceName = 'srvfile_attachment_select';
    var url = this.getServiceUrl("select", serviceName, "file");
    let condition = [
      {
        "colName": "file_no",
        "value": file_no,
        "ruleType": "eq"
      },
      {
        "colName": "is_delete",
        "value": "1",
        "ruleType": "eq"
      }
    ];

    return this.doSelect(url, serviceName, condition)
  }


  /**查询列表*/
  Vue.prototype.selectList = function (query, app) {
    let service_name = query.serviceName;
    let url = this.getServiceUrl("select", service_name, app);
    return this.$http.post(url, query);
  }

  /**查询*/
  Vue.prototype.doSelect = function (url, service_name, condition, page, order, group, mapcondition) {
    var query = {
      "serviceName": service_name,
      "colNames": ['*'],
      "condition": condition || [],
      "page": page,
      "order": order
    };

    if (group) {
      query.group = group
    }

    if (mapcondition != undefined && mapcondition != '' && mapcondition != null) {
      query["map_table_condtion"] = mapcondition;
    }

    url = url + "?" + service_name;
    return this.$http.post(url, query);
  };

  /**查询*/
  Vue.prototype.selectByUser = function (service_name, condition, page, order, group, mapcondition) {
    var url = this.getServiceUrl("select", service_name);
    var params = {
      "serviceName": service_name,
      "colNames": ['*'],
      "condition": condition,
      group: group,
      "page": page,
      "order": order
    };
    if (mapcondition != undefined && mapcondition != '' && mapcondition != null) {
      params["map_table_condtion"] = mapcondition;
    }
    url = url + "?" + service_name;
    return this.$http.post(url, params);
  };

  /**查询*/
  Vue.prototype.selectproc = function (service_name, condition, page, order, proc_type) {
    //var url = this.service_api.select;

    var url = this.getServiceUrl("select", service_name);
    var params = {
      "serviceName": service_name,
      "proc_data_type": proc_type,
      "colNames": ['*'],
      "condition": condition,
      "page": page,
      "order": order
    };
    url = url + "?" + service_name;
    return this.$http.post(url, params);
  };

  /**查询*/
  Vue.prototype.treeSelect = function (service_name, condition) {
    var url = this.getServiceUrl("select", service_name);
    var params = {
      "serviceName": service_name,
      "treeData": true,
      "colNames": ['*'],
      "condition": condition
    };
    url = url + "?" + service_name;
    return this.$http.post(url, params);
  };


  Vue.prototype.selectOne = function (service_name, condition) {
    var url = this.getServiceUrl("select", service_name);
    var params = {
      "serviceName": service_name,
      "colNames": ['*'],
      "condition": condition
    };
    url = url + "?" + service_name;
    return this.$http.post(url, params)
      .then(response => {
        if (response.body.data && response.body.data.length > 0) {
          response.body = response.body.data[0];
        } else {
          console.error("no data returned for selectOne")
        }
        return response;
      });
  };

  /**操作*/
  Vue.prototype.operate = function (requests) {
    let service = requests.length > 0 ? requests[0].serviceName : "";
    let srvApp = requests[0].srvApp;
    var url = this.getServiceUrl("operate", service, srvApp);
    return this.$http.post(url, requests);
  };

  /**删除文件*/
  Vue.prototype.deleteFile = function (params) {
    var url = this.serviceApi().deleteFile;
    return this.$http.post(url, params);
  };


  /**
   * 返回常用的页面路径
   * @param type:页面类型
   * @returns {*}
   */
  Vue.prototype.getCommonPagePath = function (type) {
    return common_page_path[type];
  }

  /**操作*/
  Vue.prototype.addTab = function (type, urlParams, tab_title) {
    if (tab_title == undefined || tab_title == null || tab_title == "") {
      tab_title = "新标签页";
    }

    var versionNo = this.getVersionNo();
    if (versionNo != "" && ("procdetail" == type || "start-proc" == type)) {
      type = type + "_" + versionNo;
    }
    let url = common_page_path[type] + urlParams;
    if (window.top.tab) {
      let page = {
        title: tab_title,
        url: url,
        icon: ""
      };

      window.top.tab.addTab(page);
    } else {
      window.open(url)
    }
  };

  Vue.prototype.addTabByUrl = function (url, tab_title) {
    let page = {
      title: tab_title || "新标签页",
      url,
    };

    if (window.top.tab && window.top.tab.addTab) {
      window.top.tab.addTab(page);
    } else {

      let strWindowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
      let newWindow = window.open(url, "CNN_WindowName", strWindowFeatures)
      newWindow.document.title = tab_title;
    }
  };


  /**操作*/
  Vue.prototype.forwardAddTab = function (address, tab_title) {

    if (tab_title == undefined || tab_title == null || tab_title == "") {
      tab_title = "新标签页";
    }

    let page = {
      title: tab_title,
      url: address,
      icon: ""
    };

    window.top.tab.addTab(page);
  };


  /**操作*/
  Vue.prototype.custAddTab = function (type, urlParams, tab_title) {

    if (tab_title == undefined || tab_title == null || tab_title == "") {
      tab_title = "新标签页";
    }

    let page = {
      title: tab_title,
      url: common_page_path[type] + urlParams,
      icon: ""
    };

    window.top.tab.addTab(page);
  };


  Vue.prototype.approval = function (requests) {
    var url = this.serviceApi().approval;
    return this.$http.post(url, requests);
  };


  //直接启动流程
  Vue.prototype.startProc = function (requests) {
    let service = requests.length > 0 ? requests[0].serviceName : "";
    var url = this.getServiceUrl("apply", service);
    url = url + "?" + service;
    return this.$http.post(url, requests);
  };

  //保存草稿
  Vue.prototype.saveDraft = function (requests) {
    let service = requests.length > 0 ? requests[0].serviceName : "";
    var url = this.getServiceUrl("apply", service);
    url = url + "?" + service;
    for (var item of requests) {
      item.proc_save_type = "save";
    }
    return this.$http.post(url, requests);
  };

  //开启已有数据流程
  Vue.prototype.startDataProc = function (requests) {

    let service = requests.length > 0 ? requests[0].serviceName : "";
    var url = this.getServiceUrl("apply", service);
    url = url + "?" + service;
    for (var item of requests) {
      item.proc_data_type = "old";
    }
    return this.$http.post(url, requests);
  };


  Vue.prototype.bxDeepClone = function (obj) {
    if (obj == null) return null;
    let newObj = obj instanceof Array ? [] : {};
    for (var i in obj) {
      newObj[i] = typeof obj[i] === "object" ? this.bxDeepClone(obj[i]) : obj[i];
    }
    return newObj;
  }

  Vue.prototype.parseDateTime = function (dateStr) {
    return moment(dateStr).toDate();
  }

  Vue.prototype.formatDateTime = function (date) {
    return moment(date).format("YYYY-MM-DD  HH:mm:ss");
  }

  Vue.prototype.parseDate = function (dateStr) {
    return moment(dateStr).toDate();
  }

  Vue.prototype.formatDate = function (date) {
    return moment(date).format("YYYY-MM-DD");
  }

  Vue.prototype.addDate = function (date, amount, flag) {
    return moment(date).add(amount, flag).toDate();
  }


  Vue.prototype.popupDialog = function (params) {

    var btninfo = params["btninfo"]

    if (params.formType.startsWith("simple-")) {
      params.formType = params.formType.substring("simple-".length);
    }

    if (!this.dialog) {
      // create dialog
      let ComponentClass = Vue.extend(Dialog)
      let dialog = new ComponentClass({
        propsData: {type: 'primary'},
        store: this.$store,
      })
      this.dialog = dialog;

      dialog.$mount()
      this.$el.appendChild(dialog.$el)
    }


    // conf and show dialog
    let dialog = this.dialog;
    dialog.service = params.service;
    if (btninfo && btninfo.application) {
      dialog.srvApp = btninfo.application;
    }


    dialog.defaultConditions = params.condition;
    dialog.defaultValues = params.data;
    dialog.mapcondition = params.mapcondition;
    if (params.otherParams != undefined && params.otherParams != null) {
      var load_old_data = params.otherParams.load_old_data;
      if (load_old_data == false) {
        dialog.initLoad = load_old_data;
      }

      dialog.buttonInfo = params.otherParams.buttonInfo;
    }
    dialog.activeForm = params.formType;
  }


  Vue.prototype.popuplistFormDialog = function (formType, service, selectService, condition, updateData) {

    if (!this.dialog) {
      // create dialog
      let ComponentClass = Vue.extend(Dialog)
      let dialog = new ComponentClass({
        propsData: { type: 'primary' },
        store: this.$store
      })
      this.dialog = dialog;

      dialog.$mount()
      this.$el.appendChild(dialog.$el)
    }


    // conf and show dialog
    let dialog = this.dialog;
    dialog.service = service;
    dialog.selectService = selectService;
    dialog.defaultConditions = condition;
    dialog.defaultValues = updateData;

    dialog.activeForm = formType;
  }

  Vue.prototype.guid = function () {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  Vue.prototype.formartMoney = function (s) {
    return formatMoney(s);
  }


  Vue.prototype.isEmptyCondition = function (condition) {
    let value = condition.value;
    if (condition.ruleType == 'isnull' || condition.ruleType == "notnull") {
      return false;
    } else if (condition.ruleType == "between") {
      return jQuery.isEmptyObject(value) || (value[0] == null && value[1] == null);
    } else {
      if (typeof value == "object") {
        return jQuery.isEmptyObject(value);
      } else {
        return value == null || value == undefined || value === "";
      }
    }
  }

  Vue.prototype.money2zh = function (money) {
    return DataUtil.money2Zh(money);
  }

  Vue.prototype.isTopComp = function () {
    return (this.$parent.$parent === this.$root)
  }

  Vue.prototype.getCurrPage = function () {
    let isInDialog = false;
    let node = this;

    while (node.$parent) {
      isInDialog = node.$parent.$vnode && node.$parent.$vnode.tag && node.$parent.$vnode.tag.endsWith("ElDialog");
      if (isInDialog) {
        break;
      } else {
        node = node.$parent;
      }
    }

    return isInDialog ? node : this.$root.$children[0].$children[0];
  }

  Vue.prototype.getOperateParams = function () {
    if (this.$route && this.$route.query && this.$route.query.operate_params) {
      return this.$route.query.operate_params
    }
    return false
  }

  Vue.prototype.getVueUrlParams = function (paraName) {
    if (this.$route && this.$route.query && this.$route.query[paraName]) {
      return this.$route.query[paraName];
    }
    return false
  }

  Vue.prototype.getinitparams = function () {
    if (this.$route && this.$route.query && this.$route.query.init_params) {
      return this.$route.query.init_params
    }
    return "";
  }

  Vue.prototype.eval = function (expr) {
    return eval(expr);
  }


  Vue.prototype.santinizeQueries = function (queries) {
    traverseObj(queries,
      (obj, key) => {
        if (key === "_rtDataCtx") {
          delete obj._rtDataCtx
        } else if (key === "data") {
          if (!obj.data || _.isEmpty(obj.data)) {
            delete obj.data
          }
        }
      },
      (obj, key) => {
        return (key === "data" || key === "child_data_list" || _.isArray(obj))
      });

  }

  Vue.prototype.weekStart = function () {
    return weekStart();
  }

  Vue.prototype.weekEnd = function () {
    return weekEnd();
  }

  Vue.prototype.monthStart = function () {
    return monthStart();
  }

  Vue.prototype.monthEnd = function () {
    return monthEnd();
  }

  Vue.prototype.toTemplateString = function (templ) {
    return "`" + templ + "`"
  }

  Vue.prototype.parseJson = function (str) {
    return Function('"use strict";return (' + str + ')')()
  }

  // noinspection JSUnusedLocalSymbols
  /**
   *
   * @param expr
   * @param data
   * @param vm
   * @returns {*}
   */
  Vue.prototype.evalBxExpr = function (expr, data, vm, defaultValue) {
    try {
      let user = top.user;
      return eval(expr)
    } catch (e) {
      console.error("fail to eval expr:" + e.stack)
      return defaultValue || null
    }
  }


  Vue.prototype.evalActionValidator = function (funcStr, data) {
    let vm = this;
    let expr = "var zz=(" + funcStr + ")(vm, data); zz"
    let test = this.evalBxExpr(expr, data, vm)
    if (test !== true) {
      this.$message.error(test + "")
      return false;
    } else {
      return true;
    }
  }

  Vue.prototype.getNodePath = function () {
    let node = this;
    while (!node.$srvApp) {
      if (node.$parent) {
        node = node.$parent;
      } else {
        break;
      }
    }
  }


  /**
   * (id | key| name | attrs[name])
   */
  Vue.prototype.getName = function () {
    let type = this.$options.name || this.$options._componentTag;
    let shortName = this.name || (this.$attrs && this.$attrs.name) || (this.$vnode && this.$vnode.key);
    return type + "#" + shortName;
  }

  Vue.prototype.getNodePath = function () {
    let tokens = [];

    // precondition: path already
    let node = this;
    while (node) {
      let isMarker = node.isMarker || (this.$attrs && this.$attrs["is-mark"] === "true");
      if (isMarker || (node.getName && _.isFunction(node.getName) && node === this)) {
        let name = node.getName();
        tokens.splice(0, 0, name);
      }

      node = node.$parent;
    }

    return tokens.join("/");
  }

  Vue.prototype.findNodeByPath = function (path) {
    // find leaf node type
    let tokens = path.split("/");
    let leafNodeType = tokens[tokens.length - 1].split("#")[0];

    // filter by their path
    return this.$root.findAnyNodeByTypeAndPredict(leafNodeType, (node) => node.getNodePath() === path);
  }

  /**
   * find descendant nodes with type and predict
   * @param type
   * @param predict
   * @returns {*}
   */
  Vue.prototype.findAnyNodeByTypeAndPredict = function (type, predict) {
    let nodeType = this.$options.name || this.$options._componentTag;
    if (nodeType && nodeType === type && (!predict || predict(this))) {
      return this;
    } else {
      for (let child of this.$children) {
        let match = child.findAnyNodeByTypeAndPredict(type, predict);
        if (match) {
          return match;
        }
      }
      return null;
    }
  }

  Vue.prototype.evalExprOrFunc = function (value, data, defaultValue) {
    try {
      if (_.isString(value)) {
        let vm = this;
        return eval(value);
      } else if (_.isFunction(value)) {
        return value(data);
      } else {
        console.error("value is not func or expr: " + value)
      }
    } catch (e) {
      if (_.isUndefined(defaultValue)) {
        throw e
      } else {
        console.error("fail to eval func or expr: " + e.stack)
        return defaultValue
      }
    }
  }

  Vue.prototype.evalVersatileFlagVar = function (flagVar, data) {
    if (_.isBoolean(flagVar)) {
      return flagVar;
    } else if (_.isFunction(flagVar)) {
      return flagVar(data);
    } else {
      return !!flagVar;
    }
  }

  Vue.prototype.getVersionNo = function () {
    var version = "";
    var path = this.$route.path;
    var paths = this.$route.path.split("/");
    if (paths.length > 1) {

      var reg = /^v\d*$/;
      var value = paths[1];
      if (reg.test(value)) {
        version = value;
      }
    }
    return version;
  }

  Vue.prototype.removeByValue = function (datas, value) {
    var _index = -1;
    for (var i = 0; i < datas.length; i++) {
      if (datas[i] == value) {
        _index = i;
        break;
      }
    }

    if (_index > -1) {
      datas.splice(_index, 1);
    }
  }


  Vue.prototype.serviceApi = function () {
    let defaultApp = this.resolveDefaultSrvApp();
    var service_api = {
      selectOne: backendIpAddr + "/" + defaultApp + "/select",
      select: backendIpAddr + "/" + defaultApp + "/select",
      selectByUser: backendIpAddr + "/" + defaultApp + "/select",
      operate: backendIpAddr + "/" + defaultApp + "/operate",
      approval: backendIpAddr + "/" + defaultApp + "/process/approval",

      uploadFile: backendIpAddr + "/file/upload",
      downloadFile: backendIpAddr + "/file/download?filePath=",
      deleteFile: backendIpAddr + "/file/delete",
      downloadFileNo: backendIpAddr + "/file/download?fileNo=",
      exportExcel: backendIpAddr + "/" + defaultApp + "/export/exportExcel",
      importExcel: backendIpAddr + "/" + defaultApp + "/bizDataImport",

      qrcode: backendIpAddr + "/" + defaultApp + "/bxsys/qrcode",

      // startProc: backendIpAddr + defaultApp + "/bxsys/startProc",
      // saveDraft: backendIpAddr + defaultApp + "/bxsys/saveDraft",
      // startDataProc: backendIpAddr + defaultApp + "/bxsys/startDataProc",
    };
    return service_api;
  }

   /**
     *  格式化日期
     *  @params date: 时间字符串或数字  仅支持String和Number类型
     *  @params type: return的时间格式，默认为0 输出 "YYYY-MM-DD" ，1 输出 "YYYY-MM-DD hh:mm:ss"，2 输出 "hh:mm:ss"
     *  @params operator: 年月日间隔符 默认"YYYY-MM-DD"
     */
  Vue.prototype.format_date = function(date,type,operator) {  // 20180808T082630
    if(date){
      if(!type){
        type = 0
      }
      if(!operator){
        operator = "-"
      }
      if(typeof date == "string"&&type==0){
        date = date.slice(0,4)+operator+date.slice(4,6)+operator+date.slice(6,8)
      }else if(typeof date == "string" && type == 1 &&date.length==15){ // 2019-09-04 12:22:22
        date = date.slice(0,4)+operator+date.slice(4,6)+operator+date.slice(6,8)+" "+date.slice(9,11)+":"+date.slice(11,13)+":"+date.slice(13,15)
      }else if(typeof date == "number" && type == 0 &&date.length==14){ // 2019-09-04 12:22:22
        date = date.slice(0,4)+operator+date.slice(4,6)+operator+date.slice(6,8)
      }else if(typeof date == "number" && type == 1 &&date.length==14){ // 2019-09-04 12:22:22
        date = date.slice(0,4)+operator+date.slice(4,6)+operator+date.slice(6,8)+" "+date.slice(8,10)+":"+date.slice(10,12)+":"+date.slice(12,14)
      }else if(typeof date == "string" && type == 2 &&date.length==15){ // 2019-09-04 12:22:22
        date.slice(9,11)+":"+date.slice(11,13)+":"+date.slice(13,15)
      }else if(typeof date == "number"){
        let dateTime = date.toString()
        dateTime = dateTime.slice(0,4)+operator+dateTime.slice(4,6)+operator+dateTime.slice(6,8)
        return dateTime
      }else{
        return "数据不规范,无法转化成标准时间"
      }
      return date
    }
  }
}

  /**
   *  秒数转化为n天n小时
   *  @param val: 秒数
   * @returns {string}
   */
  Vue.prototype.secondToTime=function(val) {
    let s = parseInt(val) // 秒
    let h = 0 // 时
    let d = 0 // 天
    if (s >= 60) { // 运行时间大于一分钟
      h = Math.round(s / 3600)
      if (h >= 24) {
        d = parseInt(h / 24)
        h = Math.round((h % 24).toFixed(1)) // 四舍五入计算小时
      }
    }
    let time = ""
    if (d < 1) {
      time = "" + h + "小时"  // 若天数小于一，则输出n小时
    } else if (h%24===0) {
      time = "" + d + "天"  // 若天数是一个整数，则输出n天
    } else {
      time = "" + d + "天" + h + "小时" // 若天数大于一且不是一个整数，则输出n天n小时
    }
    return time
  }

export default init_util;
