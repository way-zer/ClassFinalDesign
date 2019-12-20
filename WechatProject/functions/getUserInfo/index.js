// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-g3p2o'
})


const db = cloud.database()
const coll = db.collection("users")

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return coll.where({"openId":wxContext.OPENID}).get().then(res=>{
    const value = res.data
    if(value&&value.length){
      const {name,cardId,status} = value[0]
      return {ok:true,data:{ name, cardId, status }}
    }
    return {ok:false,data:"NOTFOUND"}
  })
}