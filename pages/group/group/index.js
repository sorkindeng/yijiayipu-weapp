const { User } = require('../../../utils/av-weapp-min.js');
const UserService = require('../../../model/userService.js');

const util = require('../../../utils/util.js');

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
    
    console.log('pages group group index onLoad start.')
    this.fetchData();
    console.log('pages group group index onLoad wait......')
  },

  ////////////////////////////////////////////////////////////////
  fetchData: function(){
    const user = User.current();

    var groupLists = [];
    var groupData = {};
    util.taskSequence().then(() => {
      const jgroup = user.get('jgroup');    // 自己的jp群
      const jgroupName = user.get('jgroupName');
      groupData = {};
      if (jgroup) {
        console.log('jgroup', jgroup)
        groupData.groupId = jgroup.id;
        groupData.groupName = jgroupName;
        groupData.isManager = true;
        //console.log('groupData', groupData);
        return UserService.fetchMembers(groupData.groupId).then((members) => {
          groupData.groupMembers = members;
          groupLists.push(groupData);
          console.log('获取到数据，设置数据用于显示。groupId=', groupData.groupId);
          this_page.setData({ groupLists: groupLists })
        })
      }
    }).then(()=>{
      const userGroupListsJoin = user.get('groupListsJoin') || {};      //自己加入的群
      console.log('自己加入的群,userGroupListsJoin', userGroupListsJoin)
      var groupId = '';
      var groupName = '';
      for (let item in userGroupListsJoin){
        groupData = {};
        groupId = item;
        groupName = userGroupListsJoin[item];
        groupData.groupId = groupId;
        groupData.groupName = groupName;
        groupData.isManager = false;
        UserService.fetchMembers(groupId).then((members) => {
          groupData.groupMembers = members
          groupLists.push(groupData);
          console.log('获取到数据，设置数据用于显示。groupId=', groupId);
          this_page.setData({ groupLists: groupLists })
        })
      }
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
    console.log('pages group group index onShow start.')
  
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