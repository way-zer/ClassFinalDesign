const app = getApp();
Page({
  data: {
    modal: false,
  },
  onLoad: function (options) {
    var that = this;
    var data = {
      "data1": [{
        "key": 1,
        "name": "的话更好",
        "card": 2019210104,
        "time": "12-22 12:30",
        "status": "不见了",
      },
      {
        "key": 2,
        "name": "阿斯弗",
        "card": 2019210103,
        "time": "2017-12-22",
        "status": "hhh",
      },
      ],
    }
    that.setData({
      informations: data.data1,
    })
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