// model/dataCacheService.js
const { User } = require('../utils/av-weapp-min.js');
const AV = require('../utils/av-weapp-min.js');

const util = require('../utils/util.js')

const Group = AV.Object.extend('Group');
const GroupFans = AV.Object.extend('yjp_GroupFans');

//
//  缓存当前登录用户相关的数据;
//  从云端拉取数据，缓存到本地存储;
//  缓存数据与数据库中数据结构上保持一致，仅根据业务(查询)需求进行索引处理(正向索引，反向索引)，不作其他逻辑处理。
//  1.当前登录用户的数据；
//  2.当前登录用户相关的群组(创建的群，加入的群)数据；
//  3.当前登录用户相关的群组对应的各个群组的成员数据；(缓存时groupfans直接保存到group的属性中)
//  说明：每个用户默认创建一个自己的家谱群ownGroup，可加入多个别人的群joinGroupList，
//        每个用户可加入一个族谱群superGroup，此群单列，不包含在joinGroupList，
//        每个群有一个创建者(founder)，一个管理者(manager)
//  缓存的数据结构如下：
//    __user_id: $userid
//    __user_ownGroup_id: $groupid
//    __user_superGroup_id: $groupid
//    __user_joinGroupLists: [$groupid,...]
//    $userid: {user}
//    $groupid: {group} (...n)
//////////////////////////////////////////////////////////////////////////////////////////////////////
const fetch2Cache = () => {
  return new Promise((resolve, reject) => {
    const user = User.current();
    if (!user) return reject();     //参数检查

    let cacheUserId = wx.getStorageSync('__user_id');
    let cacheAtDate = wx.getStorageSync(cacheUserId+'/cacheAtDate');
    console.log('=====dataCacheService，cacheUserId(AtDate)=', cacheUserId, cacheAtDate);
    if ( cacheUserId === user.id ) return resolve();
    console.log('=====dataCacheService，从云端获取数据并缓存...');

    util.taskSequence().then(() => {
      //  cache user, 当前登录用户.
      wx.setStorageSync('__user', user);
      wx.setStorageSync('__user_id', user.id);
      wx.setStorageSync(user.id, user);

      //  cache group, 当前登录用户信息中与业务有关的查询索引 ownGroupId, superGroupId, joinGroupLists
      let gid;
      let groupObjects=[];
      let group = user.get('ownGroup');
      console.log('group1, ', group);
      if (group) {
        gid = group.id || group.objectId ;
        group = AV.Object.createWithoutData('Group', gid);
        groupObjects.push(group);
        wx.setStorageSync('__user_ownGroup_groupId', gid)
      }
      group = user.get('superGroup');
      console.log('group2, ', group);
      if (group) {
        gid = group.id || group.objectId ;
        group = AV.Object.createWithoutData('Group', gid);
        groupObjects.push(group);
        wx.setStorageSync('__user_superGroup_groupId', gid)
      }
      let joinGroupLists = user.get('joinGroupLists') || [];
      console.log('grouplists, ', joinGroupLists);
      wx.setStorageSync('__user_joinGroupLists', joinGroupLists );
      for (let idx in joinGroupLists) {
        gid = joinGroupLists[idx];
        console.log('====================gid:', gid);
        group = AV.Object.createWithoutData('Group', gid);
        groupObjects.push(group);
      }      
      return AV.Object.fetchAll(groupObjects);
    }).then((groupObjects) => {
      //  cache group object 根据objectId缓存。
      let groupIndex = [];
      groupObjects.forEach((ret)=>{
        let gid = ret.id;
        console.log('================fetch ret gid:', gid);
        groupIndex.push(gid);
        wx.setStorageSync(gid, ret);
      })
      //  cache group 索引
      wx.setStorageSync('__group_id_index', groupIndex);
      wx.setStorageSync(user.id + '/cacheAtDate', new Date());
      resolve();
    }).catch((err)=> {
      // Do something when catch error
      console.error(err);
      reject(err);
    })
  })
}

module.exports = {
  fetch2Cache,
}
