//const { User } = require('../../utils/av-live-query-weapp-min');
const { User } = require('../../utils/av-weapp-min.js');

Page({
  data: {
    user: null,
    username: '',
    error: null,
    array: ['保密', '男', '女'],
    gender: '保密',
    birthday: '2000-09-01',
  },
  onLoad: function() {
    const user = User.current();
    const gender = user.get('gender') || this.data.gender ;
    const birthday = user.get('birthday') || this.data.birthday ;  

    this.setData({
      user: user,
      gender: gender,
      birthday: birthday
    });
  },
  ///////////////////////////////
  bindGenderChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const genderArray = this.data.array;
    this.setData({
      gender: genderArray[e.detail.value]
    })
  },
  ////////////////////////////////////////////
  bindBirthdayChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      birthday: e.detail.value
    })
  },

  //////////////////////////////////////////////////////////////////
  save: function () {
    this.setData({
      error: null,
    });
    const gender = this.data.gender;
    const birthday = this.data.birthday;
    const user = User.current();
    if (gender) user.set('gender',  gender );
    if (birthday) user.set('birthday', birthday);
    user.save().then(() => {
      wx.showToast({
        title: '更新成功',
        icon: 'success',
      });
    }).catch(error => {
      this.setData({
        error: error.message,
      });
    });
  }
});