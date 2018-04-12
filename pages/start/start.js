// pages/start/start.js
const AV = require('../../utils/av-weapp-min.js');
const UserService = require('../../model/userService.js');

//获取应用实例
const g_app = getApp()
var this_page;

Page({
  data: {
    remind: '加载中...',
    angle: 0,
    sinceYear: 2017,
    year: 2018,
    userInfo: {}
  },
//////////////////////////////////////////////////////////
  goToIndex: function () {
    wx.switchTab({
      url: '/pages/group/group/index',
    });
  },

///////////////////////// 生命周期函数--监听页面加载
  onLoad: function (opts) {
    this_page = this;
    this.setData({
      year: new Date().getFullYear()
    });
    console.log('page start onLoad opts=', opts);

    this_page.login()
      .then(() => UserService.checkRegData())
      .then(() => this_page.checkShareTicket(opts.gmid))
      .then(() => this_page.cacheData())
      .then(() => {
        console.log('app.globalData.userInfo', g_app.globalData.userInfo)
        setTimeout(function () {
          console.log('加载完成，准备显示页面。');
          this_page.setData({
            remind: ''
          });
        }, 1000);
      })
    .catch(error => consolo.error(error.message));
  },

  ////////////////////////////////////////////////////////////
  login: function () {
    return AV.Promise.resolve(AV.User.current())
      .then(user => user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null)
      .then(user => user ? user : AV.User.loginWithWeapp())
      .catch(error => consolo.error(error.message));
  }, // login end
  ////////////////////////////////////////////////////////////////////////
  checkShareTicket: function(gmid){
    if (gmid) {
      console.log('page start checkShareTicket gmid=', gmid);
      if (g_app.globalData.shareTicket) {
        console.log('通过转发链接进入，定向受邀，但是从群组中打开，shareTicket=', g_app.globalData.shareTicket);
      } else {
        console.log('通过转发链接进入，定向受邀加入群，gmid=', gmid);
        return UserService.joinGroupWithgmid(gmid);
      }
    }
  },

  // 缓存数据， 读取本地存储的缓存，如果不存在，从服务器拉取并存储。如果已经存在，直接返回。
  // 缓存用户关注的群组信息，包括自己的jgroup,zgroup, joinGroup，followGroup。
  //////////////////////////////////////////////////////////////
  cacheData: function(){
    const user = AV.User.current();

    //微信的 userInfo , 先从本地缓存获取，如果不存在，再从服务端获取，如果仍然不存在，说明用户还未授权；如果从服务端获取存在，则缓存到本地。
    var userInfo = wx.getStorageSync('userInfo')
    console.log('userInfo', userInfo)
    if (userInfo) {
      g_app.globalData.userInfo = userInfo;
      this_page.setData({ userInfo: userInfo })
    }else{
      userInfo = user.get('wxUserInfo');
      console.log('user.get(wxUserInfo) result:', userInfo);
      if(userInfo){
        console.log('从服务端获取到wxUserInfo', userInfo);
        wx.setStorageSync('userInfo', userInfo);        
        g_app.globalData.userInfo = userInfo;
        this_page.setData({ userInfo: userInfo })
      }
    }

    //console.log('AV.user', user.toJSON());
    var userData = {
      userid: user.id,
      username: user.get('username'),
      familyClass: user.get('familyClass'),
      groupIdj: user.get('jgroup'),
      groupIdz: user.get('zgroup'),
      groupNamej: user.get('jgroupName'),
      groupNamez: user.get('zgroupName'),
      groupListsJoin: user.get('groupListsJoin'),
      groupListsFollow: user.get('groupListsFollow'),
    }
    g_app.globalData.userData = userData;
    console.log('app.globalData.userData', g_app.globalData.userData);
    console.log('app.globalData.userData.userid=', g_app.globalData.userData.userid);
  },
  ///////////////////////// 生命周期函数--监听页面初次渲染完成
  onReady: function () {
    //console.log('page start onReady.')
  }, // onReady end

  /////////////////////////////////////////////////////////
  onShow: function () {
    //console.log('page start onShow.')
 
  },

})