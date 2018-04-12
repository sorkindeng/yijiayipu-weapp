// pages/detail/detail.js
const onamebook = require('../../../utils/onamebook.js')

Page({
  data: {
    name: '王',
    remark: '暂时未收录，敬请期待。',
    ptext: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opts) {

    let name = this.data.name;
    if (opts.name) name = opts.name
    
    console.log(name);
    console.log(onamebook.onames[name]);

    if (onamebook.onames[name]){
      this.setData({ 
        name: name,
        remark: onamebook.onames[name].remark,
        ptext : onamebook.onames[name].ptext 
      })
    }else{
      this.setData({name: name});
    }
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