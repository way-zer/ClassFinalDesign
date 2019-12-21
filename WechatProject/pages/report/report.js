const app = getApp();
Page({
  data: {
    modal: false,
    unfinished: true,
    info: {},
  },
  onLoad: function() {
    this.updateInfo()
  },
  updateInfo() {
    app.service.getInfoOrLogin().then(value => {
      this.setData({
        info: value,
        unfinished: false
      })
    })
  },
  updateUserInfo(event) {
    console.log(event)
    app.service.encryptedData = event.detail.encryptedData
    this.setData({
      unlogin: false
    })
  },
  cancelReport() {
    app.service.cancelOrRequestCard().then(() => {
      this.updateInfo()
      wx.showModal({
        title: '提示',
        content: '取消成功',
        showCancel: false
      })
    })
  },
  takeCard() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '请确认您已经到达机器旁',
      success(res) {
        if (res.confirm) {
          app.service.cancelOrRequestCard().then(() => {
            that.updateInfo()
            wx.showModal({
              title: '提示',
              content: '正在出卡中，请耐心等待',
              showCancel: false
            })
          })
        }
      },
    })
  },
  ensure() {
    app.service.reportLoss().then(() => {
      this.updateInfo()
      wx.showModal({
        title: '提示',
        content: '挂失成功',
        showCancel: false
      })
    })
  },

  openModal: function() {

    this.setData({
      modal: true
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#adadad'
    })
  },
  finishForm: function(event) {
    console.log(event)
    const {
      name,
      cardId
    } = event.detail.value
    app.service.completeInfo(name, cardId).then(() => {
      app.service.getInfoOrLogin().then(value => {
        this.setData({
          info: value,
          unfinished: false
        })
      })
      this.cancelModal()
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