var mqtt = require('mqtt')
/**
 * 操控舵机到1-8号卡槽点
 */
module.exports = function(pos,resolve,reject){
  var ok = -3
  const client = mqtt.connect('mqtt://183.230.40.39:6002')
  client.on('message',(topic,msg)=>{
    if(msg[0]=0x31){//Pong
      ok=0;
      client.end()
      resolve()
    }
  })
  client.on('connect',()=>{
    client.subscribe('info',(err)=>{
      if(err){
        client.end()
        console.error(err)
        return reject(err)
      }
      const handler = ()=>{
        if(ok++==0){
          client.end()
          return reject("TIMEOUT")
        }
        client.publish('cmd',[0x02,pos])
        setTimeout(handler,300)
      }
      handler()
    })
  })
}