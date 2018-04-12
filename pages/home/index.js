// pages/home/index.js
const { User } = require('../../utils/av-weapp-min.js');
const UserService = require('../../model/userService.js');

const util = require('../../utils/util.js')

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

  ////////////////////////////////////////////////////////////////
  fetchData: function(){
    const user = User.current();

    var groupLists = [];
    var groupData = {};
    util.taskSequence()
      .then(() => {
        const jgroup = user.get('jgroup');
        const jgroupName = user.get('jgroupName');
        groupData = {};
        if (jgroup) {
          console.log('jgroup', jgroup)
          groupData.groupId = jgroup.id;
          groupData.groupName = jgroupName;
          groupData.isManager = true;
          //console.log('groupData', groupData);
          return UserService.fetchMembers(groupData.groupId)
            .then((members) => groupData.groupMembers = members)
            .then(() => groupLists.push(groupData))
        }
      }).then(() => {
        console.log('获取数据结束，设置数据用于显示。');
        this_page.setData({ groupLists: groupLists })
      })
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
  onShareAppMessage: function () {
  
  }
})