const { User } = require('../../../utils/av-weapp-min.js');
const AV = require('../../../utils/av-weapp-min.js');
const Follower = AV.Object.extend('yjp_Follower');
const Group = AV.Object.extend('yjp_Group');
const GroupFans = AV.Object.extend('yjp_GroupFans');
const util = require('../../../utils/util.js')
const UserService = require('../../../model/userService.js');

var this_page;

Page({
  data: {
    user: null,
    error: null,
    groupId: '',
    groupName: '',
    familyClass: '',
    originArea: '',
    region: ['广东省', '广州市', '海珠区'],
    memberData: [],
      //[{ "idx": "01", "id": "",  "nickname": "自己", "roleType":"自己" , "birthday":"2000-12-30" ,"age": "18岁" },],
  },
  onLoad: function (opts) {
    console.log('onLoadddddd pages-group-group-group', opts);
    this_page = this;
    const user = User.current();
    this.setData({
      user: user,
    });

    var groupId = opts.groupId;
    console.log('opts.groupId=', groupId);
    //测试
    if (!groupId) {
      groupId = User.current().get('jgroup').id;
    }
    this.fetchData(groupId);
  },
  ///////////////////////////////////////////////////////////////////////////
  fetchData: function(groupId){
    var group = AV.Object.createWithoutData('yjp_Group', groupId);
    group.fetch().then(() => {
      console.log('page group fetchData group', group);
      const groupName = group.get('groupName');
      const familyClass = group.get('familyClass')||'';
      const region = group.get('region')||'';
      const originArea = group.get('originArea')||'';
      this.setData({
        groupId: groupId,
        groupName: groupName,
        familyClass: familyClass,
        region: region,
        originArea: originArea
      })
    })

    UserService.fetchMembers(groupId)
      .then((members) => this_page.setData({ memberData: members }))
  },
  ///////////////////////////////////////////////////////////////////////
  onReady: function (opts) {
    console.log('onReadyyyyyy pages-group-group-group', opts);

  },
  ///////////////////////////////////////////////////////////////////////
  onShow: function (opts) {
    console.log('onShowwwwww pages-group-group-group', opts);

  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  //////////////////////////////////////////////
  submit_form: function (e) {
    console.log('submit_form detail.value', e.detail.value);
    const groupName = e.detail.value.groupName;
    const familyClass = e.detail.value.familyClass;
    const originArea = e.detail.value.originArea;

    if (this.data.groupId){
      var group = AV.Object.createWithoutData('yjp_Group', this.data.groupId);
      group.set('groupName', groupName);
      group.set('familyClass', familyClass);
      group.set('originArea', originArea);
      group.set('region', this.data.region);

      group.save().then(() => {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
        });
        if (User.current().get('familyClass') != familyClass ){
          User.current().set('familyClass', familyClass);
          User.current().save();
        }
      }).catch(error => consolo.error(error.message));
    }
  },
});