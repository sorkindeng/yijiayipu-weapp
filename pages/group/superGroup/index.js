const { User } = require('../../../utils/av-weapp-min.js');
const UserService = require('../../../model/userService.js');

const util = require('../../../utils/util.js')

const g_app = getApp()
var this_page;


Page({
  data: {
    user: null,
    //groupLists: [{groupId:'', groupName:'', groupMembers:[{id,roleType,nickname,birthday,age},], isManager:false},],
    groupLists: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this_page = this;
    const user = User.current();
    this.setData({ user: user });

    this.fetchData();
  },

  //  每人只能 有且仅有，归属一个zp群。
  ////////////////////////////////////////////////////////////////
  fetchData: function(){
    const user = User.current();

    var groupLists = [];
    var groupData = {};
    util.taskSequence().then(() => {
      const zgroup = user.get('zgroup');
      const zgroupName = user.get('zgroupName');
      groupData = {};
      if (zgroup) {
        console.log('zgroup', zgroup)
        groupData.groupId = zgroup.id || zgroup.objectId ;
        groupData.groupName = zgroupName;
        groupData.isManager = false;             // 比对此群的管理者，是否当前用户
        return user.fetch({include:['zgroup']}).then((userObj) =>{
          let zg = userObj.get('zgroup');
          if (zg.get('manager')){
            console.log('比对此群的管理者是否当前用户，groupManager, user:', zg.get('manager').id , user.id );
            if (zg.get('manager').id == user.id ) groupData.isManager = true;
          }
        }).then(()=>{
          return UserService.fetchMembers(groupData.groupId);
        }).then((members) => {
          groupData.groupMembers = members;
          groupLists.push(groupData)
          console.log('获取数据结束，设置数据用于显示。');
          this_page.setData({ groupLists: groupLists })
        })
      }
    })
  },
  ///////////////////////////////////////////////////////////////
  bind_cloneGroup: function (e) {
    console.log('bind_cloneGroup, start!');
    UserService.cloneJp2Zp();
    console.log('bind_cloneGroup, wait......');
  },
  ///////////////////////////////////////////////////////////////
  bind_manageGroup: function(e){
    let groupId = e.target.dataset.groupid;
    console.log('bind_manageGroup groupId=', e);
    console.log('bind_manageGroup groupId=', groupId);
    wx.navigateTo({
      url: '/pages/group/group/group?groupId=' + groupId
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (opts) {
    console.log(opts);
    return {
      title: '一加一，靠谱，一加一，靠谱，',
      path: '/pages/start/start',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }


  }
})