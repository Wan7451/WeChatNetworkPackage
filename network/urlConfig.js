/**
 * 小程序网络配置文件
 */


var host = "http://192.168.203.250/"



var isDebug=true;
var url = {
  host,
  //1.1 第三方微信小程序注册/登录
  loginUrl: `${host}sso/member/weixin`,
  //1.2 获取用户个人信息
  getUserInfo: `${host}wireless/account/userInfo`,
};

module.exports = { url, isDebug}
