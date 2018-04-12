// pages/oname/oname.js
const onamebook = require('../../utils/onamebook.js')

Page({
  data: {
    inputShowed: false,
    inputVal: "",
    searchResult: [],
    totalCount: 0,
    listCount: 25,
    currentPage: 1,
    grids: [
      { name: '赵', bgcolor: 'bg-color1' },
      { name: '钱', bgcolor: 'bg-color3' },
      { name: '孙', bgcolor: 'bg-color4' },
      { name: '李', bgcolor: 'bg-color5' },
      { name: '王', bgcolor: 'bg-color1' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opts) {
    let totalCount = onamebook.onameindex.length;
    this.setData({ totalCount: totalCount });

    //console.log(onamebook);
    //console.log(onamebook.onameindex.length);

    this.getGridData();
  },
  getGridData: function () {
    // 1-5 的随机数，选择颜色
    let radomNum = Math.ceil(Math.random() * 5)
    let startNum = (this.data.currentPage - 1) * this.data.listCount;
    let endNum = Math.min(this.data.totalCount, startNum + this.data.listCount)
    let gridData = [];
    console.log(`startNum= ${startNum}, endNum= ${endNum}`)
    for (let i = startNum; i < endNum; i++) {
      radomNum = Math.ceil(Math.random() * 5);
      //console.log(`i, radomNum = ${i} , ${radomNum}`);
      gridData.push({
        name: onamebook.onameindex[i],
        bgcolor: 'bg-color' + radomNum
      })
    }
    this.setData({ grids: gridData });
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

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    let name = e.detail.value;
    console.log('搜索输入', name);

    if (onamebook.onameindex.indexOf(name) == -1) {
      this.setData({
        searchResult: [],
        inputVal: e.detail.value
      });
    } else {
      console.log('name', name);
      this.setData({
        searchResult: [name, '赵', '钱', '孙', '李', '王'],
        inputVal: e.detail.value
      })
    }

  },
//////////////////////////////////////////////////////////////////////////////////
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