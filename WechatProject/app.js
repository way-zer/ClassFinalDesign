import {service} from './service.js'
//app.js
App({
  onLaunch: function () {
    this.service = service
    wx.cloud.init({
      env: 'test-g3p2o'
    })
    wx.cloud.callFunction({
      name: "getUserInfo"
    }).then(value=>{
      console.log(value)
    }).catch(value=>{
      console.warn(value)
    })
  },
  globalData: {
  }
})