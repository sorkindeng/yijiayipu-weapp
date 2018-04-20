// model/loggedUser.js
const { User } = require('../utils/av-weapp-min.js');
const AV = require('../utils/av-weapp-min.js');

//获取应用实例
//const the_app = getApp();

class loggedUser {
  static _isReady = false;
  static _user;

  static get isReady() { return loggedUser._isReady; };
  static setReady(){
    loggedUser._user = User.current();
    console.log('loggedUser._user', loggedUser._user)
    loggedUser._isReady = true;
  }
  
  static get userid() { return (loggedUser._user ? (loggedUser._user.id || loggedUser._user.objectId)  : null) }
  static get username() { return (loggedUser._user ? loggedUser._user.get('username') : null) };

  ///////////////////////////////////////////////////////////////
  static saveWxUserInfo(userInfo){
    wx.setStorageSync('wxUserInfo', userInfo);
    const user = User.current();
    user.set('wxUserInfo', userInfo);
    user.save();    // 异步，不影响后续操作

    const Subuser = AV.Object.extend('Subuser');
    const query = new AV.Query(Subuser).equalTo('user', user);
    query.first().then((su) => {
      console.log('loggedUser saveWxUserInfo subuser query.first ret=', su);
      su.set('wxUserInfo', userInfo);
      return su.save();
    }).then((su)=>{
      console.log('loggedUser saveWxUserInfo subuser query.first save ret=', su);
    })
  }

  ///////////////////////////////////////////////////////////////
  static getWxUserInfo(){
    //微信的 userInfo , 先从本地缓存获取，如果不存在，再从服务端获取，如果仍然不存在，说明用户还未授权；如果从服务端获取存在，则缓存到本地。
    var userInfo = wx.getStorageSync('wxUserInfo')
    console.log('loggedUser wx.getStorageSync(userInfo):', userInfo)
    if (!userInfo) {
      const user = User.current();
      userInfo = user.get('wxUserInfo');
      console.log('loggedUser user.get(wxUserInfo):', userInfo);
      if (userInfo) {
        console.log('loggedUser 从服务端获取到wxUserInfo', userInfo);
        wx.setStorageSync('wxUserInfo', userInfo);
      }
    }
    return userInfo;    
  }
}

module.exports = loggedUser;