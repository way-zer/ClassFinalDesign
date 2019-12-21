/**
 * 全局服务对象
 * 已绑定到App.service
 * 所有操作都涉及网络,所以都返回Promise处理异步
 * 
 * 当前所有状态
 * PostInfo状态: 丢失->已找到->已结束  发现->已结束
 * UserInfo状态: 正常->已挂失->已找到->(恢复正常)     若他人捡到直接跳到 已找到
 */
const MOCK = true
let mockData={}
let cacheData={}
export const service ={
  infosHook: null,
  /**
   * 获取首页挂失信息
   */
  loadInfos(page){
    if(MOCK){
      if(this.infosHook)
        this.infosHook([
        {
          "key": 1,
          "userName": "的话更好",
          "title": "校园卡: 2019***104",
          "time": "12-22 12:30",
          "status": "丢失",
        },
        {
          "key": 2,
          "userName": "阿斯弗",
          "title": "校园卡: 2019***105",
          "time": "12-22 12:30",
          "status": "已找到",
        },
      ])
    }
    return wx.cloud.callFunction({
      name: "getPosts",
      data: {
        page
      }
    }).then(this._dealResult)
    .then(value=>{//TODO date to time
      if (this.infosHook)
        this.infosHook(value)
    })
  },
  /**
   * 获取用户当前信息
   * 挂失页面所需数据，reject如果不存在
   * 返回Promise
   * {name,cardId,status}
   */
  getInfoOrLogin(){
    if(MOCK){
      if(mockData.info){
        return Promise.resolve(mockData.info)
      }else{
        return Promise.reject("请先完善信息")
      }
    }
    return wx.cloud.callFunction({
      name: "getUserInfo"
    }).then(this._dealResult)
  },
  /**
   * 完善用户信息
   * 参数为 名字 卡号
   * 返回Promise
   */
  completeInfo(name,id){
    if(MOCK){
      mockData.info ={
        name,
        cardId:id,
        status:"正常"
      }
      return Promise.resolve()
    }
    return wx.cloud.callFunction({
      name: "completeInfo",
      data: {
        name,cardId:id
      }
    }).then(this._dealResult)
  },
  /**
   * 报告捡到卡
   * 硬件端将有所动作
   * 返回Promise
   */
  reportFound(name, id) {
    if(MOCK){
      console.log("硬件端: 准备放入卡片")
      mockData.info.status="已找到"
      return Promise.resolve()
    }
    return wx.cloud.callFunction({
      name: "updateStatus",
      data: {
        type: "FOUND",
        name, cardId: id
      }
    }).then(this._dealResult)
  },
  /**
   * 挂失
   * 挂失前必须完善信息，并给予用户具体说明
   * 该函数将请求服务通知
   * 返回Promise
   */
  reportLoss(){
    if(MOCK){
      mockData.info.status="已挂失"
      return Promise.resolve()
    }
    return wx.cloud.callFunction({
      "name": "updateStatus",
      data: {
        type: "LOSS"
      }
    }).then(this._dealResult)
  },
  /** 
   * 请求取卡
   * 要求当前卡状态为找到
   * 硬件端将配合
   * 返回Promise
  */
  cancelOrRequestCard(){
    if(MOCK){
      if(mockData.info.status=="已找到")
        console.log("硬件端: 准备取出卡片")
      mockData.info.status="正常"
      return Promise.resolve()
    }
    return wx.cloud.callFunction({
      "name": "updateStatus",
      data: {
        type: "CANCEL"
      }
    }).then(this._dealResult)
  },
  _dealResult(result){
    const {ok,data}=result
    if(ok)
      return Promise.resolve(data)
    else
      return Promise.reject(data)
  }
}