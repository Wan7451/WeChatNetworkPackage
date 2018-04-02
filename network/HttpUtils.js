
const KEY_UER_ID = "UERID";
const KEY_TOKEN = "TOKEN";
const REPEAT_COUNT = 2; //重试次数
var DEBUG = require("urlConfig.js").isDebug;
var requestQueue = []; //请求队列

/**
 * 获取请求需要的Header
 */
function getHttpHeader() {
  var userId = wx.getStorageSync(KEY_UER_ID);
  var token = wx.getStorageSync(KEY_TOKEN);

  return {
    'userId': userId,
    'token': token,
    'content-type': 'application/x-www-form-urlencoded'
  };
}

/**
 * 返回用户ID
 */
function getUserId() {
  return wx.getStorageSync(KEY_UER_ID);
}

/**
 * 缓存header中的数据
 */
function saveHttpHeader(userId, token) {
  wx.setStorageSync(KEY_UER_ID, userId);
  wx.setStorageSync(KEY_TOKEN, token);
}

/**
 * 发起请求
 * 
 * req.url    请求地址
 * req.data   请求参数
 * req.success  服务返回的确数据，data中的数据
 * req.fail   请求失败，对象可无该方法
 */
function request(req) {
  req.repeatCount = 0;
  req.isLoding = false;
  requestQueue.push(req);
  handleRequest();
}

/**
 * 处理请求
 */
function handleRequest() {
  //取出队列第一个请求
  var req = requestQueue.shift();
  if (!req) return;

  if (DEBUG) {
    console.log("======>url:" + req.url);
    console.log("======>params:" + Obj2String(req.data));
    console.log("======>header:" + Obj2String(getHttpHeader()));
  }
  //是否展示loading
  if (!req.isLoding) {
    req.isLoding = true;
    wx.showLoading({
      title: ' ',
    });
  }
  //发起请求
  wx.request({
    url: req.url,
    data: req.data,
    header: getHttpHeader(),
    method: "POST",
    success: function (res) {
      if (DEBUG) {
        console.log("======>result:" + Obj2String(res.data));
        console.log("======>result:" + Obj2String(res.data.data));
      }
      var data = getResultData(res);
      if (data) {
        //请求成功
        wx.hideLoading();
        req.isLoding = false;
        req.success(data);
        //递归处理其他请求
        handleRequest();
      } else if (getResultCode(res) == -401) {
        //处理 -401
        relogin(req);
      } else if (req.repeatCount < REPEAT_COUNT) {
        //加入队列再次请求，最多3次
        req.repeatCount++;
        requestQueue.push(req);
        //递归处理其他请求
        handleRequest();
      } else {
        //超出3次，显示错误处理
        wx.hideLoading();
        req.isLoding = false;
        handleError(res);
        if (isHostMethod(req, "fail")) {
          req.fail();
        }
      }

    },
    fail: function ({ errMsg }) {
      if (DEBUG) {
        console.log("======>error:" + errMsg);
      }
      if (req.repeatCount < REPEAT_COUNT) {
        //加入队列再次请求，最多3次
        req.repeatCount++;
        requestQueue.push(req);
        //递归处理其他请求
        handleRequest();
        return;
      }
      if (isHostMethod(req, "fail")) {
        req.fail(errMsg);
      }

      req.isLoding = false;
      wx.hideLoading();
      if (!errMsg) {
        return;
      }
      showErrorToast(errMsg);
    }

  })
}


/**
 * 对象是否含有方法
 */
function isHostMethod(object, property) {
  var t = typeof object[property];
  return t == 'function' || (!!(t == 'object' && object[property])) || t == 'unknown';
}

/**
 * 对象toString
 */
function Obj2String(obj) {
  var description = "";
  for (var i in obj) {
    description += i + " = " + obj[i] + "\t";
  }
  return description;
}






/**
 * 处理 wxRequest 成功后返回的数据
 * 
 * 返回 服务其中 data 的数据
 */
function getResultData(res) {
  //网络错误
  if (res.statusCode != 200) {
    return;
  }
  //服务器返回 null
  var data = res.data;
  if (!data) {
    return;
  }
  //服务器返回数据处理
  if (data.retCode == 0) {
    //返回的正确数据
    return data.data;
  }
}

/**
 * 处理 wxRequest 成功后返回的数据
 * 
 * 返回 服务其中 data 的数据
 */
function getResultCode(res) {
  //网络错误
  if (res.statusCode != 200) {
    return;
  }
  //服务器返回 null
  var data = res.data;
  if (!data) {
    return;
  }
  return data.retCode;
}


/**
 * 处理 wxRequest 成功后返回的数据
 * 
 * 返回 服务其中 data 的数据
 */
function handleError(res) {
  
  //网络错误
  if (res.statusCode != 200) {
    showErrorToast("[" + res.statusCode + "]异常");
    return;
  }
  //服务器返回 null
  var data = res.data;
  if (!data) {
    showErrorToast();
    return;
  }
  //服务器返回数据处理
  if (data.retCode == 0) {
    //返回的正确数据
    return data.data;
  } else if (data.msg) {
    //返回的错误信息
    showErrorToast(data.msg);
  } else {
    //处理错误
    showErrorToast();
  }
}


/**
 * 重新登录
 */
function relogin(req) {
  var loginUtils = require("LoginUtils.js");
  loginUtils.loginOut();
  loginUtils.login({
    logined: function () {
      requestQueue.push(req);
    }
  });
}

/**
 * 错误提示
 */
function showErrorToast(msg) {
  wx.showToast({
    title: msg ? msg : "服务器异常",
    icon: "none",
    duration: 2000
  });
}




module.exports = {
  saveHttpHeader, request, showErrorToast, isHostMethod, getUserId
}