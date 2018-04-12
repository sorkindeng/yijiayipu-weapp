//app.js
const AV = require('./utils/av-weapp-min.js');

AV.init({
  appId: 'hnVQQe0BccOx11v1qNyMgSJ3-gzGzoHsz',
  appKey: '6U0sie3qndINrG3iXBxUuSC2',
});

//app.js
App({
  version: 'v1.0.1', //版本号
  onLaunch: function (opts) {
    console.log('App onLaunch opts:', opts);
    if (opts.shareTicket){
      this.globalData.shareTicket = opts.shareTicket;
    }

    // 使用本地存储能力, 记录日志。
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    console.log('version', this.version);
  },

  globalData: {
    userInfo: null,
    userData: null,
    userGropuLists: null,
    shareTicket: null,
    sharePage: '/pages/start/start'
  },
  /*
    userData: {userid, username, groupIdj, groupIdz }
    userGroupLists: (groups)[{groupId, groupName, mark}]  
      --mark: jGroup, zGroup, member, fans, memberCheck, fansCheck
  */
});

