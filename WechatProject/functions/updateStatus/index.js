// 云函数入口文件
/**
 * 当前所有状态
 * PostInfo状态: 丢失->已找到->已结束  发现->已结束
 * UserInfo状态: 正常->已挂失->已找到->(恢复正常)     若他人捡到直接跳到 已找到
 */
const cloud = require('wx-server-sdk')
function sendMsg(pos) {
  return new Promise((resolve, reject) => {
    require("./sendMsg")(pos, resolve, reject)
  })
}

cloud.init()
const db = cloud.database()

async function putCard(cardId) {
  const box = (await db.collection("boxs").where({ "name": "develop" }).get()).data[0]
  if (box.empty.length == 0)
    throw new Error("FULL")
  const pos = box.empty.pop()
  box.cards[pos - 1] = cardId
  await sendMsg(pos)
  await db.collection("boxs").update(box)
}

async function findAndGetCard(cardId){
  const box = (await db.collection("boxs").where({ "name": "develop" }).get()).data[0]
  box.cards.forEach((v,index) => {
    if(v==cardId){
      delete box.cards[index]
      const pos = index+1;
      await sendMsg(pos)
      box.empty.push(pos)
      await db.collection("boxs").update(box)
      return 
    }
  });
  throw new Error("NOT FOUND")
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { type } = event //FOUND LOSS CANCEL
  switch (type) {
    case "FOUND":
      //硬件端：放入卡
      //检查持卡人是否注册信息
      //  T: 修改状态为已找到，可以时给持卡人找到信息
      //    检查持卡人是否发布
      //    T: 修改Post为 已找到
      //    F: 设置lastPost为新建Post
      //新建Post,状态为发现，适当打码
      const { name, cardId } = event
      //CHECK name and cardId
      await putCard(+cardId)
      const res = await db.collection("users").where({ cardId: +cardId }).get()
      var user = null
      if (res.data && res.data.length) {
        user = res.data[0]
        user.status = "已找到"
        //TODO 服务通知
        if (user.lastPost) {
          const post = (await db.collection("posts").where({ _id: user.lastPost }).get())[0]
          post.status = "已找到"
          await db.collection("posts").update(post);
          await db.collection("users").update(user)
          return { ok: true }
        }
      }
      var title = cardId
      for (var i = 4; i < 7; i++)title[i] = '*'
      title = "校园卡: " + title
      var userName = user ? user.name : name
      userName[1] = '*'
      const post = await db.collection("posts").add({
        status: "发现", title, userName, date: Date.now(), rawData: { cardId: +cardId, userId: user && user._id }
      })
      if (user) {
        user.lastPost = post._id
        await db.collection("users").update(user)
      }
      return { ok: true }
    case "LOSS":
      //CHECK 状态为正常 
      //发送服务通知
      //检查是否有人发现过
      //  T: 记录lastPost,修改状态为 已找到 并发送找到通知
      //  F: 发布新Post,记录lastPost,状态为 已挂失 并发送挂失通知 
      const res = (await db.collection("users").where({ openId: wxContext.OPENID }).get())
      if (res.data && res.data.length) {
        const user = res.data[0]
        //TODO 服务通知
        const res = (await db.collection("posts").where({ rawData: { cardId: user.cardId } }).get())
        const post = res.data && res.data.find(v => (v.status == "发现"))
        if (post) {
          user.lastPost = post._id
          user.status = "已找到"
          //TODO 找到通知
        }else{
          var title = user.cardId
          for (var i = 4; i < 7; i++)title[i] = '*'
          title = "校园卡: " + title
          var userName = user.name
          userName[1] = '*'
          const post = await db.collection("posts").add({
            status: "丢失", title, userName, date: Date.now(), rawData: { cardId: user.cardId, userId: user._id }
          })
          user.lastPost = post._id
          user.status = "已挂失"
          //TODO 挂失通知
        }
        await db.collection("users").update(user)
        return {ok:true}
      } else return { ok: false, data: "NOT FOUND" }
    case "CANCEL":
    //检查当前状态
    //  已挂失: 取消挂失，
    //  已找到: 硬件端取卡， 
    //  ELSE: BAD REQUEST
    // 修改Post状态为已结束，解除lastPost
      const res = (await db.collection("users").where({ openId: wxContext.OPENID }).get())
      if (res.data && res.data.length) {
        const user = res.data[0]
        if(user.status=="已挂失"){
          user.status="正常"
        }else if(user.status=="已找到"){
          await findAndGetCard(user.cardId)
        }else return {ok:false,data:"BAD REQUEST"}
        const post = (await db.collection("posts").where({ _id: user.lastPost }).get())[0]
        post.status = "已结束"
        user.lastPost=null
        await db.collection("posts").update(post);
        await db.collection("users").update(user)
        return {ok:true}
      } else return { ok: false, data: "NOT FOUND" }
    default:
      return { ok: false, data: "BAD REQUEST" }
  }
}