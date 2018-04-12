const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getAges = birthday =>{
  const bDate = new Date(birthday);
  const nowDate = new Date();
  let difDay = (nowDate - bDate)/86400000;
  // 86400000=24*3600*1000
  return Math.floor(difDay/365);
}

const taskSequence = ()=>{
  return new Promise((resolve, reject) => resolve())
}

function wxPromisify(fn){
  return function(obj={}){
    return new Promise((resolve, reject)=>{
      obj.success = function(res){ resolve(res) };
      obj.fail = function(res){ reject(res) };
      fn(obj);
    })
  }
}

module.exports = {
  wxPromisify: wxPromisify,
  taskSequence: taskSequence,
  formatTime: formatTime,
  getAges: getAges
}
