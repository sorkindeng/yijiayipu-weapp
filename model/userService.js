// model/userService.js
const { User } = require('../utils/av-weapp-min.js');
const AV = require('../utils/av-weapp-min.js');

const util = require('../utils/util.js')

const Group = AV.Object.extend('Group');
const GroupFans = AV.Object.extend('yjp_GroupFans');
const Subuser = AV.Object.extend('Subuser');

// 检查用户注册(初始化)数据
///////////////////////////////////////////////////////////////
const checkRegData = () => {
  return new Promise((resolve)=>{
    const user = User.current();
    if (!user) return resolve();     //参数检查

    const userGroup = user.get('ownGroup');
    if (userGroup) {
      console.log('老用户！')
      return resolve();    //老用户  
    }

    //新用户，初始化数据:  新建群，加群成员，加关注
    console.log('新用户，开始初始化数据...')
    _initUserGroup().then(()=>resolve());
  })
}

//受邀加入群， memberId 已经在邀请前生成了，直接加入; 完成user与subuser的绑定，将加入的群记录到用户的joinGroupLists字段中。
//////////////////////////////////////////////////////////////////////////////////
const joinGroup = (groupId, memberId)=>{
  return new Promise((resolve) => {
    console.log(`userService joinGroup(${groupId}, ${memberId})`);
    if ((!groupId) || (!memberId)) return resolve();     //参数检查

    const user = User.current();
    if (!user)   return resolve();     //参数检查

    let group = AV.Object.createWithoutData('Group', groupId);
    let su = AV.Object.createWithoutData('Subuser', memberId);
    su.set('user', user);
    su.save().then((su) => {
      console.log('userService joinGroup subuser=', su);
      user.addUnique('joinGroupLists', [groupId]);
      return user.save();
    }).then((user) => {
      console.log('userService joinGroup user=', user);
      resolve();
    }).catch(error => console.error(error.message));
  })
}
//受邀加入群， groupMemberId 已经在邀请前生成了，直接加入; 将自己的用户链接填入groupfans中，将加入的群记录到用户的groupListsJoin字段中。
//////////////////////////////////////////////////////////////////////////////////
const joinGroupWithgmid = (groupMemberId) => {
  return new Promise((resolve) => {
    const user = User.current();
    if (!user) return resolve();     //参数检查
      
    var groupId = '';
    var groupName = '';
    var groupFans = AV.Object.createWithoutData('yjp_GroupFans', groupMemberId);
    groupFans.fetch().then(()=>{
      console.log('userService joinGroupWithgmid groupFans:', groupFans);
      const group = groupFans.get('group');
      if (group)  groupId = group.id;
      groupName = groupFans.get('groupname') || '';
      console.log('userService joinGroupWithgmid groupId, groupName', groupId, groupName);

      groupFans.set('user', user);
      return groupFans.save();
    }).then(()=>{
      var userGroupListsJoin = user.get('groupListsJoin') || {};
      userGroupListsJoin[groupId] = groupName;
      console.log('userService joinGroupWithgmid userGroupListsJoin', userGroupListsJoin);
      user.set('groupListsJoin', userGroupListsJoin);
      return user.save();
    }).then(()=> resolve())
    .catch(error => console.error(error.message));
  })
}
////////////////////////////////////////////////////////////////////////////
const fetchMembers = function(groupId){
  return new Promise((resolve)=>{
    if (!groupId) return resolve();     //参数检查
    const group = AV.Object.createWithoutData('yjp_Group', groupId);
    console.log('userService fetchMembers group.id=', group.id);
    const query = new AV.Query(GroupFans).equalTo('group', group);
    query.find().then((rets) => {
      if (rets.length > 0) {
        console.log('GroupFans Query rets.length', rets.length);
        let member = {};
        let fansLists = new Array();
        rets.forEach(function (ret) {
          member = {}
          member.id = ret.id;
          member.roleType = ret.get('roleType');
          member.nickname = ret.get('showName');
          member.birthday = ret.get('showBirthday') || '生日未设置';
          member.age = (ret.get('showBirthday') ? util.getAges(ret.get('showBirthday')) : 'x')
          member.age = member.age + ' 岁';
          fansLists.push(member);
        });
        //console.log('fansLists', fansLists);
        return resolve(fansLists);
      } else {
        console.log('group无成员数据', group);
      }
      resolve();
    })
  })
}
////  克隆 jp 2 zp， 1.创建zp； 2.将jp中的成员复制到zp中；3.设置zp中成员所处角色的zp信息
////  jp 最多为三代， 自己，父亲，母亲，配偶，孩子。对应的 zp 信息数据
//                      自己(0代，isMaster=true，up指向-1代的父亲)，
//                      父亲(-1代，isMaster=true，up为空)
//                      母亲(-1代，isMaster = false，up指向 - 1代的父亲)
//                      配偶(0代，isMaster = false，up指向 0 代的自己)
//                      孩子(1代，isMaster = true，up指向 0 代的自己)
//////////////////////////////////////////////
function cloneJp2Zp() {
  const user = User.current();
  var zpGroup = new Group();
  var zpGroupName = user.id.slice(-5) + '的zp群';
  return util.taskSequence().then(()=>{
    console.log('userService cloneJp2Zp');
    if (!user) return ;     //参数检查
  
    zpGroup.set('groupName', zpGroupName);
    zpGroup.set('founder', user);
    zpGroup.set('manager', user);
    zpGroup.set('familyClass', user.get('familyClass'));    // 姓氏从用户信息中获取，用户信息中的姓氏信息是从编辑家谱信息中保存时同时保存到用户表的
    return zpGroup.save();
  }).then((zpGroup)=>{
    console.log('userService cloneJp2Zp create group:', zpGroup);
    user.set('zgroup', zpGroup);
    user.set('zgroupName', zpGroupName);
    user.save();    //异步，不影响后续操作
    //////////////////////// clone
    var jpGroup = user.get('jgroup');
    var query = new AV.Query(GroupFans).equalTo('group', jpGroup);
    return query.find();
  }).then((members) =>{ 
    console.log('userService cloneJp2Zp GroupFans Query members.length', members.length);
    let member;
    let fansObjects = [];
    members.forEach(function (ret) {
      member = new GroupFans();
      member.set('group', zpGroup);
      member.set('groupname', zpGroupName);
      member.set('roleType', ret.get('roleType'));
      member.set('showName', ret.get('showName'));
      member.set('showBirthday', ret.get('showBirthday'));
      fansObjects.push(member);
    });
    return AV.Object.saveAll(fansObjects);
  }).then((objects)=>{
    console.log('userService cloneJp2Zp 一次处理结束, objects:', objects);
    // 需要二次处理。设置彼此之间的关系。
    // 先找到 自己 和 父亲 ，然后在确定关系以及其他数据。
    let meIndex, fatherIndex;
    objects.forEach(function(ret, idx){
      if (ret.get('roleType') =='自己' ) meIndex = idx;
      if (ret.get('roleType') == '父亲') fatherIndex = idx;
    })
    console.log('userService cloneJp2Zp 二次处理，meIndex, fatherIndex', meIndex, fatherIndex);
    objects.forEach(function (ret, idx) {
      if (ret.get('roleType') == '自己') {
        objects[idx].set('GNumber', 0);
        objects[idx].set('isMaster', true);
        objects[idx].set('upGroupFans', objects[fatherIndex]);
        objects[idx].set('user', user);
      }
      if (ret.get('roleType') == '父亲') {
        objects[idx].set('GNumber', -1);
        objects[idx].set('isMaster', true);
      }
      if (ret.get('roleType') == '母亲') {
        objects[idx].set('GNumber', -1);
        objects[idx].set('isMaster', false);
        objects[idx].set('upGroupFans', objects[fatherIndex]);
      }
      if (ret.get('roleType') == '配偶') {
        objects[idx].set('GNumber', 0);
        objects[idx].set('isMaster', false);
        objects[idx].set('upGroupFans', objects[meIndex]);
      }
      if (ret.get('roleType') == '孩子') {
        objects[idx].set('GNumber', 1);
        objects[idx].set('isMaster', true);
        objects[idx].set('upGroupFans', objects[meIndex]);
      }
    })
    console.log('userService cloneJp2Zp 二次处理，准备保存，objects:', objects);
    return AV.Object.saveAll(objects);
  })
}
//////////////////////////////////////////////
const _initUserGroup = ()=> {
  return new Promise((resolve, reject)=>{
    console.log('initUserGroup');
    const user = User.current();
    const group = new Group();
    const groupName = user.id.slice(-5) + '的群';
    console.log('initUserGroup groupName:', groupName);
    group.set('groupName', groupName);
    group.set('founder', user);
    group.set('manager', user);

    let subuser = new Subuser();
    subuser.set('user', user);
    let su2 = new Subuser();
    let su3 = new Subuser();

    AV.Object.saveAll([subuser, su2, su3]).then((users)=>{
      let members = {};
      members[subuser.id] = { 'roleType': '自己', 'showName': '自己', 'showBirthday': '' };
      members[su2.id] = { 'roleType': '父亲', 'showName': '父亲', 'showBirthday': '' };
      members[su3.id] = { 'roleType': '母亲', 'showName': '母亲', 'showBirthday': '' };
      group.set('members', members);
      return group.save();
    }).then(group => {
      console.log('group.id', group.id);
      user.set('ownGroup', group);
      user.set('ownGroupName', groupName);
      return user.save();
    }).then(()=> {
      resolve();
    }).catch(error => {
      console.error(error.message);
      resolve();
    })
  })
}
//////////////////////////////////////////////

module.exports = {
  checkRegData: checkRegData,
  fetchMembers: fetchMembers,
  joinGroup: joinGroup,
  joinGroupWithgmid: joinGroupWithgmid,
  cloneJp2Zp: cloneJp2Zp,
}
