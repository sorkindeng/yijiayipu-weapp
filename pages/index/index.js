//index.js
const AV = require('../../utils/av-weapp-min.js');

//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World，By yijiayipu',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  /////////////////////////////////////////////////////////////
  onLoad: function () {
    console.log('page index load...');
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
    this.login().then().catch(error => consolo.error(error.message));
    console.log('page index loaded.');
  },
  ///////////////////////////////////////////////////////////////////////
  onReady: function () {
    console.log('page index ready!');
    console.log('AV.user.id=', AV.User.current().id);
  },
  ///////////////////////////////////////////////////////////////////////
  onShow: function () {
    console.log('page index show');
  },
  ////////////////////////////////////////////////////////////
  login: function () {
    return AV.Promise.resolve(AV.User.current())
      .then(user => user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null)
      .then(user => user ? user : AV.User.loginWithWeapp())
      .catch(error => consolo.error(error.message));
  },
  

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo;

    wx.setStorageSync('userInfo', e.detail.userInfo);

    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
