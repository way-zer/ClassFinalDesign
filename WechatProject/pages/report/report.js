const app = getApp();
Page({
  data: {
    modal: false,
    unfinished: true,
  },
  onLoad: function () {
  },
  report(){
    
  },
  openModal: function () {
    this.setData({
      modal: true
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#adadad'
    })
  },
  finishForm: function () {
    this.cancelModal()
    this.setData({
      unfinished: false,
    })
  },
  cancelModal() {
    this.setData({
      modal: false
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#f6f6f6'
    })
  },
})