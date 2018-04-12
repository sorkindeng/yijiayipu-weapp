const { User } = require('../../utils/av-weapp-min.js');
const AV = require('../../utils/av-weapp-min.js');

//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {
      nickName: '未设置昵称',
      avatarUrl:'../../static/images/user_default2x.png'
    },
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  ///////////////////////// 生命周期函数--监听页面加载
  onLoad: function (options) {
    if (app.globalData.userInfo){
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo;

    wx.setStorageSync('userInfo', e.detail.userInfo);
    let user = User.current();
    user.set('wxUserInfo', e.detail.userInfo);
    user.save();    // 异步，不影响后续操作

    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})