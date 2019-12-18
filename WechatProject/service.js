/**
 * 全局服务对象
 * 已绑定到App.service
 */
export const service ={
  /**
   * 获取首页挂失信息
   * 返回数据数组
   */
  getInfos(page){

  },
  /**
   * 获取用户当前信息
   * 返回挂失页面所需数据，false如果不存在
   */
  getInfoOrLogin(){

  },
  /**
   * 完善用户信息
   * 参数为 微信用户信息对象 名字 卡号
   * 返回Promise
   */
  completeInfo(user,name,id){

  },
  /**
   * 报告捡到卡
   * 硬件端将有所动作
   * 返回Promise
   */
  reportFound(name, id) {

  },
  /**
   * 挂失
   * 挂失前必须完善信息，并给予用户具体说明
   * 该函数将请求服务通知
   * 返回Promise
   */
  reportLoss(){

  },
  /** 
   * 请求取卡
   * 要求当前卡状态为找到
   * 硬件端将配合
   * 返回Promise
  */
  requestCard(){

  },
}