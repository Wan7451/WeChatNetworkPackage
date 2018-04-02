
var url = require("../network/urlConfig.js").url;
var httpUtils = require("../network/HttpUtils.js");

const KEY_USER_INFO = "USER_INFO";

/**
 * 获取用户信息
 */
function getUserInfo(resp) {

  httpUtils.request({
    url: url.getUserInfo,
    data: {},
    success: function (data) {
      wx.setStorageSync(KEY_USER_INFO, data)
      if (resp) {
        resp.success(data);
      }
    }
  }
  );
}


/**
 * 缓存获取用户信息
 */
function getUserInfoFromCache(resp) {
  var info = wx.getStorageSync(KEY_USER_INFO);
  if (info) {
    if (resp) {
      resp.success(info);
    }
    return;
  }
  httpUtils.request({
    url: url.getUserInfo,
    data: {},
    success: function (data) {
      wx.setStorageSync(KEY_USER_INFO, data)
      if (resp) {
        resp.success(data);
      }
    }
  }
  );
}




/**
 * 发起登录
 */
function login(resp) {
  //wx登陆
  wx.login({
    success: function (res) {
      if (res.code) {
        debugger
        var code = res.code;
        //wx获取用户信息
        // wx.getSetting({
        //   success: res => {
        //     // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        //     if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                success: function (res) {
                  var userInfo = res.userInfo
                  var nickName = userInfo.nickName
                  var avatarUrl = userInfo.avatarUrl
                  var gender = userInfo.gender //性别 0：未知、1：男、2：女
                  var province = userInfo.province
                  var city = userInfo.city
                  var country = userInfo.country
                  //注册/登陆逻辑
                  loginRequest({
                    code: code,
                    nickName: nickName,
                    avatar: avatarUrl,
                    gender: gender,
                    city: city,
                    province: province
                  }, {
                      success: function (data) {
                        if (resp) {
                          resp.success(data);
                        }
                      }
                    });


                },
                //wx授权失败
                //注册/登陆逻辑
                fail: function ({ errMsg }) {
                  //没有用户信息的登陆
                  loginRequest({
                    code: code,
                    nickName: "",
                    avatar: "",
                    gender: "",
                    city: "",
                    province: ""
                  }, {
                      success: function (data) {
                        if (resp) {
                          resp.success(data);
                        }
                      }
                    });
                  console.log(errMsg);
                }

              })
            // }
        //   }
        // })
      }
    },
    //wx登陆失败
    fail: function ({ errMsg }) {
      httpUtils.showErrorToast(errMsg);
    }
  })
}



function loginRequest(data, resp) {

  httpUtils.request({
    url: url.loginUrl,
    data: data,
    success: function (data) {
      httpUtils.saveHttpHeader(data.userId, data.token);
      if (resp)
        resp.success(data);
    }
  }
  );
}




module.exports = {
  login, getUserInfo, getUserInfoFromCache
}
