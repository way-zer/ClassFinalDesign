import {service} from './service.js'
//app.js
App({
  onLaunch: function () {
    this.service = service
    wx.cloud.init()
  },
  globalData: {
  }
})