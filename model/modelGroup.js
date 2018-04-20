// model/modelGroup.js
const AV = require('../utils/av-weapp-min.js');

const util = require('../utils/util.js')

/**
 * 群组
 * @param {string} objectId                */
class modelGroup {
  constructor(groupId = '') {
    Object.assign(this, {
      _objectId: groupId,
      _data: {},
      _changedData:{},
      _hasChanged:false
    })
    this.__init();
  }

  __init() {
    try{
      this._data = wx.getStorageSync(this._objectId);
    } catch(e) { console.log(e); }
  }
  get objectId() { return this._objectId; }
  get groupId() { return this._objectId; }
  get groupName() { return this._data.groupName; }

  get managerId() { return this._data.managerId; }
  set managerId(value) {
    this._changedData.managerId = value;
    this._hasChanged = true;
  }
  get founderId() { return this._data.founderId; }
  set founderId(value) {
    this._changedData.founderId = value;
    this._hasChanged = true;
  }

  getValue(key) {
    return this._data[key];
  }
  setValue(key, value){
    this._changedData[key] = value;
    this._hasChanged = true;
  }

  getMembersArray() {
    let members = this._data.members || {};
    let membersArray = [];
    for (let key in members) {
      members[key].mid = key;
      let birthday = members[key].showBirthday;
      members[key].birthday = birthday || '生日未设置';
      let age = (birthday ? util.getAges(birthday) : 'x')
      members[key].age = age + ' 岁';
      membersArray.push(members[key]);
    }
    return membersArray;
  }

//  移除成员， 云端移除数据，然后更新缓存
//  直接更新群组中成员数据， subuser中的数据不作处理。
///////////////////////////////////////////////////
  removeMember(memberId){
    return new Promise((resolve, reject) => {
      var group = AV.Object.createWithoutData('Group', this._objectId);
      const that = this;

      util.taskSequence().then(() => {
        console.log('modelGroup removeMember memberId=', memberId);
        let membersObject = JSON.parse(JSON.stringify(that._data.members));   //深拷贝。
        delete membersObject[memberId];               //数值改变。需要先保证提交保存云端，本地_data才能更新。
        console.log('========membersObject', membersObject);
        console.log('========that._data', that._objectId, that._data);
        group.set('members', membersObject);
        return group.save();
      }).then((group) => {
        //更新缓存
        delete that._data.members[memberId];
        console.log('========更新缓存后，that._data.members', that._data.members);
        wx.setStorageSync(that._objectId, that._data)
        resolve();
      }).catch((error) => {
        console.error(error.message);
        reject(error);
      });
    })    
  }
//  保存成员数据， member{mid: ,xx}  如果mid为空则新建， mid有值则更新
//  新建时，需要先增加 subuser
//  云端保存，然后更新缓存。
//////////////////////////////////////////////////////////////////
  saveMember(member){
    return new Promise((resolve, reject) => {
      var group = AV.Object.createWithoutData('Group', this._objectId);
      const that = this;

      let mid = member.mid;
      util.taskSequence().then(() => {
        if (!mid) {
          const Subuser = AV.Object.extend('Subuser');
          let su = new Subuser();
          return su.save().then((su) => {
            console.log('modelGroup saveMember su.save, su=',su );
            member.mid = su.id;      
          })
        }
      }).then(()=>{
        console.log('modelGroup saveMember member=', member);
        mid = member.mid;
        let membersObject = JSON.parse(JSON.stringify(that._data.members));   //深拷贝。
        membersObject[mid] = member;                                      //数值改变。需要先保证提交保存云端，本地_data才能更新。
        console.log('========membersObject', membersObject);
        console.log('========that._data', that._objectId, that._data);
        group.set('members', membersObject);
        return group.save();
      }).then((group) => {
        //更新缓存
        that._data.members[mid] = member;
        console.log('========更新缓存后，that._data.members', that._data.members);
        wx.setStorageSync(that._objectId, that._data)
        resolve();
      }).catch((error) => {
        console.error(error.message);
        reject(error);
      });
    })
  }


//  保存数据，提交到云端保存，并更新缓存。
//////////////////////////////////////////////////////////////////////////////////////
  saveData(){
    return new Promise((resolve, reject) => {
      if (!this._hasChanged) return resolve();
      var group = AV.Object.createWithoutData('Group', this._objectId);
      const that = this;
      for (let key in that._changedData) {
        group.set(key, that._changedData[key])
      }
      group.save().then(() => {
        //更新缓存
        for (let key in that._changedData) {
          that._data[key] = that._changedData[key];
        }
        wx.setStorageSync(that._objectId , that._data)
        this._hasChanged = false;
        resolve();
      }).catch((error) => {
        console.error(error.message);
        reject(error);
      });
    })
  }
}

module.exports = modelGroup;