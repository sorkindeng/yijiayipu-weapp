    const query = new AV.Query(Follower).equalTo('uid', AV.Object.createWithoutData('User', this.data.user.id))
    query.find().then((fls)=>{
      if(fls.length >0 ){
        console.log('fls.length', fls.length);        

      }else{
        console.log('老用户，加载数据。')

      }

    }).catch(error => consolo.error(error.message));

/*
e.detail.userInfo
{type: "getuserinfo", timeStamp: 2677, target: {…}, currentTarget: {…}, detail: {…}}
currentTarget:{id: "", offsetLeft: 92, offsetTop: 139, dataset: {…}}
detail:{
  encryptedData: "b+nVy.."
  errMsg:"getUserInfo:ok"
  iv:"q+TQB1UMMFQ/Ql0ybmhPbA=="
  rawData:"{"nickName":"＊松","gender":1,"language":"zh_CN","city":"Haidian","province":"Beijing","country":"China","avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLyEWO2T2BrgibmRMicZRXUvORYKjcfLRHibQq8k21AqiaWNSgPLSWaPd1MF9qxjJqibLvTZxokRMG9rHQ/0"}"
  signature:"9682733f2b945effde50b3c67852b151347cd0dc"
  userInfo:{
    avatarUrl:"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLyEWO2T2BrgibmRMicZRXUvORYKjcfLRHibQq8k21AqiaWNSgPLSWaPd1MF9qxjJqibLvTZxokRMG9rHQ/0"
    city:"Haidian"
    country:"China"
    gender:1
    language:"zh_CN"
    nickName:"＊松"
    province:"Beijing"
  }
  ...
}
...
timeStamp:2677
type:"getuserinfo"
...
}



            <picker mode="region" bindchange="" value="" >
              <view> {{region[0]}}，{{region[1]}}，{{region[2]}} </view>
            </picker>




var todo = AV.Object.createWithoutData('Todo', '5735aae7c4c9710060fbe8b0');
todo.fetch({
  include:['todoFolder']
  }).then(todoObj =>{
    let todoFolder = todoObj.get('todoFolder');
    console.log(todoFolder.get('name'));
});



*/

// wx 原始 API
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
      },
      fail: function () {
        console.error("get location failed")
      }
    })

    // 使用 promise 封装
    //之后，我们将原来回调方式的API变成Promise的方式：
    var util = require('../utils/util')

    var getLocationPromisified = util.wxPromisify(wx.getLocation)

    getLocationPromisified({
      type: 'wgs84'
    }).then(function (res) {
      var latitude = res.latitude
      var longitude = res.longitude
      var speed = res.speed
      var accuracy = res.accuracy
    }).catch(function () {
      console.error("get location failed")
    })


 