const app = getApp();
Page({
  data: {
    modal: false,
  },
  onLoad: function (options) {
    app.service.infosHook = value=>{
      this.setData({
        informations: value
      })
    }
    app.service.loadInfos()
  },
  onUnload(){
    app.service.infosHook = null;
  },
  toReport: function () {
    console.log("a")
    wx.navigateTo({
      url: '/pages/report/report'
    })
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
    app.service.reportFound().then(value => {
      
      })
    wx.showModal({
      title: '提示',
      content: '输入相关信息后请将校园卡放入箱子中',
      showCancel: false
    })
  },
  cancelModal() {
    this.setData({
      modal: false
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#F6F6F6'
    })
  }
})