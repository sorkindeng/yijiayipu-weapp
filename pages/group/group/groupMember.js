const { User } = require('../../../utils/av-weapp-min.js');
const AV = require('../../../utils/av-weapp-min.js');


//群组成员
//方案1：新增时不能新增关系为“自己”的成员； 修改时当关系为“自己”时不能修改关系字段；关系为“自己”的记录不能删除；
//(ok)方案2：自己，父亲，母亲，为系统确认的成员，不能删除，不能修改他们的关系字段(只能修改姓名/出生日期)，不能新增。只能新增(配偶/孩子)

Page({
  data: {
    user: null,
    error: null,
    isDefaultMamber: false,
    roleArray: ['配偶', '孩子'],
    roleType: '选择关系',
    nickname: '',
    birthday: '',
    gmid: '',
    groupId:'',
    groupName: '',
  },
  /////////////////////////////////////////////////////////////////
  onLoad: function (opts) {
    const user = User.current();
    this.setData({ 
        user: user,
        groupId: opts.groupId,
        groupName: opts.groupName,
      });
    console.log('groupId=', opts.groupId);
    console.log('groupName=', opts.groupName);
    const groupMemberId = opts.gmid;
    const roleType = opts.roletype;

    //groupMemberId(this.data.gmid)为空时是新增记录，否则为修改记录
    console.log('gmid=', groupMemberId);
    console.log('roletype=', opts.roletype);
    console.log('nickname=', opts.nickname);
    console.log('birthday=', opts.birthday);
    if (groupMemberId){
      //修改信息
      if (this.data.roleArray.indexOf(roleType) < 0 ){
        this.setData({ isDefaultMamber: true });
      }
      this.setData({
        gmid: opts.gmid,
        roleType: opts.roletype,
        nickname: opts.nickname,
        birthday: opts.birthday,
      })
    }
  },
  ///////////////////////////////////////////////////////////////////////
  onReady: function () {
    console.log('page groupMember ready!');
  },
  ///////////////////////////////////////////////////////////////////////
  onShow: function () {
    console.log('page groupMember show');
  },
  /////////////////////////////////////////////////////
  bindNameChange: function (e) {
    this.setData({ error: null });
  },
  //////////////////////////////////////////////////////
  bindBirthdayChange: function(e){
    this.setData({ birthday: e.detail.value, error:null });
  },
  /////////////////////////////////////////////////////
  bindRoleChange: function(e){
    this.setData({ roleType: this.data.roleArray[e.detail.value], error: null });
  },
  //////////////////////////////////////////////
  submit_form: function(e){
    console.log('submit_form detail.value', e.detail.value);
    const roleType = e.detail.value.roleType;
    const name = e.detail.value.nickname;
    const birthday = e.detail.value.birthday;
    if ( (this.data.isDefaultMamber==false) &&  (this.data.roleArray.indexOf(roleType)) < 0 ){
      this.setData({ error:'请先选择关系类型！' })
    } else if (!name){
      this.setData({ error: '请输入姓名！' })
    }else{
      //新增 或者 修改(gmid已经有值)
      console.log('保存成员信息。');
      var groupMember;
      if (this.data.gmid){
        groupMember = AV.Object.createWithoutData('yjp_GroupFans', this.data.gmid);
      }else{
        //var groupId = this.data.user.get('jgroup').objectId;
        var groupId = this.data.groupId;
        var group = AV.Object.createWithoutData('yjp_Group', groupId);
        var GroupFans = AV.Object.extend('yjp_GroupFans');
        groupMember = new GroupFans();
        groupMember.set('group', group);
        groupMember.set('groupname', this.data.groupName);
        //groupMember.set('upGroupFans', this.data.user);
      }
      groupMember.set('showName', name);
      groupMember.set('roleType', roleType);
      groupMember.set('showBirthday', birthday);
      groupMember.save().then(() => {
        wx.redirectTo({
          url: '/pages/group/group/group',
        })
      }).catch(error => consolo.error(error.message));
    }
  },
  //////////////////////////////////////////////
  bind_del: function (e) {
    //删除
    if (this.data.gmid) {
      const groupMember = AV.Object.createWithoutData('yjp_GroupFans', this.data.gmid);
      groupMember.destroy().then(() => {
        wx.reLaunch({
          url: '/pages/group/group/group',
        })
      }).catch(error => consolo.error(error.message));
    }
  },
  //////////////////////////////////////////////////////////////////////////////////
  onShareAppMessage: function (opts) {
    console.log(opts);
    let sharePath = '/pages/start/start?gmid=' + this.data.gmid;
    console.log('pages groupMember onShareAppMessage, path=', sharePath);
    return {
      title: '一加一，靠谱，一加一，靠谱，',
      path:  sharePath,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }

  }
});