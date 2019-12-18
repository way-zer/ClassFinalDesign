/**
 * 全局服务对象
 * 已绑定到App.service
 * 所有操作都涉及网络,所以都返回Promise处理异步
 */
const MOCK = true
let mockData={}
export const service ={
  /**
   * 获取首页挂失信息
   * 返回Promise<数据数组>
   */
  getInfos(page){
    if(MOCK){
      return Promise.resolve([
        {
          "key": 1,
          "name": "的话更好",
          "card": 2019210104,
          "time": "12-22 12:30",
          "status": "丢失",
        },
        {
          "key": 2,
          "name": "阿斯弗",
          "card": 2019210103,
          "time": "12-22 12:30",
          "status": "已找到",
        },
      ])
    }
  },
  /**
   * 获取用户当前信息
   * 挂失页面所需数据，reject如果不存在
   * 返回Promise
   */
  getInfoOrLogin(){
    if(MOCK){
      if(mockData.info){
        return Promise.resolve(mockData.info)
      }else{
        return Promise.reject("请先完善信息")
      }
    }
  },
  /**
   * 完善用户信息
   * 参数为 微信用户信息对象 名字 卡号
   * 返回Promise
   */
  completeInfo(user,name,id){
    if(MOCK){
      mockData.info ={
        name,
        cardId:id,
        status:"正常"
      }
      return Promise.resolve()
    }
  },
  /**
   * 报告捡到卡
   * 硬件端将有所动作
   * 返回Promise
   */
  reportFound(name, id) {
    if(MOCK){
      console.log("硬件端: 准备放入卡片")
      mockData.info.status="丢失已找到"
      return Promise.resolve()
    }
  },
  /**
   * 挂失
   * 挂失前必须完善信息，并给予用户具体说明
   * 该函数将请求服务通知
   * 返回Promise
   */
  reportLoss(){
    if(MOCK){
      mockData.info.status="丢失未找到"
      return Promise.resolve()
    }
  },
  /** 
   * 请求取卡
   * 要求当前卡状态为找到
   * 硬件端将配合
   * 返回Promise
  */
  requestCard(){
    if(MOCK){
      console.log("硬件端: 准备取出卡片")
      mockData.info.status="正常"
      return Promise.resolve()
    }
  },
}