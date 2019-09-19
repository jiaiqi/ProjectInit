// !!! mock !!!!
let dummy = {
  server_cfg: {
    back_server_protocol: "http",
    back_server_ip: "192.168.0.192",
    back_server_port: "8101"
    //  开发server_cfg
  },
  dummy:function (){
    if (!top.pathConfig) {
      top.pathConfig = {}
      top.pathConfig.application = "emr";  //  开发app
      top.user = localStorage.getItem("user")
      top.user = {
        create_time: "2019-08-11 22:30:15",
        create_user: "admin",
        del_flag: "否",
        dept_no: "01010101",
        email: "1@qq.com",
        id_card: null,
        login_control: "PC,IOS,ANDROID",
        mobile: null,
        modify_time: "2019-08-12 10:30:15",
        modify_user: "wangyh",
        parent_dept_no: null,
        real_name: "王永宏",
        user_disp: "wangyh/王永宏",
        user_no: "wangyh",
        user_state: "正常",
        user_type: "外部员工",
        _dept_info:{
          biz_path: null,
          create_time: "2019-07-03 11:46:48",
          create_user: "wangyh",
          create_user_disp: "/wangyh",
          del_flag: "否",
          dept_class: "dept_type_02",
          dept_full_name: null,
          dept_head: "nantaifuzeren",
          dept_level: null,
          dept_name: "斐济公司",
          dept_no: "01010101",
          dept_tel: null,
          dept_type: "真实",
          id: 7,
          is_leaf: "是",
          modify_time: "2019-08-01 16:25:23",
          modify_user: "wangyh",
          modify_user_disp: "/wangyh",
          parent_no: "010101",
          path: "/0001/0101/010101/01010101/",
          path_name: null,
          remark: null,
          reserve_col1: "continet_006",
          reserve_col2: "061"
        }
    }
    
      sessionStorage.setItem("bx_auth_ticket", "512b5255-f1f7-4336-af2e-90937808275d"); //  开发bx_auth_ticket
      sessionStorage.setItem("current_login_user", JSON.stringify(top.user)); //  开发bx_auth_ticket
    }
  }
}



export default dummy
// export default function dummy() {

// }