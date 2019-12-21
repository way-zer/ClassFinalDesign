// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const coll = db.collection("posts")

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const {
    page
  } = event
  return coll.orderBy("date", "desc").skip((page || 1 - 1) * 20).limit(20).get().then(res => {
    const data = res.data || []
    data.forEach(v => {
      v.key = v._id;
      delete v._id;
      delete v.rawData
    })
    return {ok:true,data}
  })
}