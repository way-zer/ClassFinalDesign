// 云函数入口文件
/**
 * 当前所有状态
 * PostInfo状态: 丢失->已找到->已结束  发现->已结束
 * UserInfo状态: 正常->已挂失->已找到->(恢复正常)     若他人捡到直接跳到 已找到
 */
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {type} = event //FOUND LOSS CANCEL
  switch(type){
    case "FOUND":
      const {name,cardId} = event
      //CHECK name and cardId
      //硬件端：放入卡
      //检查持卡人是否注册信息
      //  T: 修改状态为已找到，可以时给持卡人找到信息
      //    检查持卡人是否发布
      //    T: 修改Post为 已找到
      //    F: 设置lastPost为新建Post
      //新建Post,状态为发现，适当打码
    case "LOSS":
      //CHECK 状态为正常 
      //发送服务通知
      //检查是否有人发现过
      //  T: 记录lastPost,修改状态为 已找到 并发送找到通知
      //  F: 发布新Post,记录lastPost,状态为 已挂失 并发送挂失通知 
    case "CANCEL":
      //检查当前状态
      //  已挂失: 取消挂失，
      //  已找到: 硬件端取卡， 
      //  ELSE: BAD REQUEST
      // 修改Post状态为已结束，解除lastPost
    default:
    return {ok:false,data:"BAD REQUEST"}
  }
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}