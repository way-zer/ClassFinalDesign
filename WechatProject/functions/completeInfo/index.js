// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()


const db = cloud.database()
const coll = db.collection("users")

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {name,cardId} = event
  //TODO Check name and cardId
  return coll.where({ "openId": wxContext.OPENID }).get().then(res => {
    const value = res.data
    if (value && value.length)
      return {ok:false}
    return coll.add({data:{ name, cardId: +cardId, openId: wxContext.OPENID, status: "正常" }}).then(()=>{
      return {ok:true}
    })
  })
}