var mqtt = require('mqtt')

/**
 * 操控舵机到1-8号卡槽点
 */
module.exports = function(pos,resolve,reject){
  var ok = -5
  const client = mqtt.connect('mqtt://183.230.40.39', { clientId: '577842626', username: '302971', port: 6002, password: 'WXSERVER0WAYZER'})
  client.on('message',(topic,msg)=>{
    if(msg[0]='1'){//Pong
      ok=99;
      client.end()
      return resolve()
    }
  })
  client.on('connect',()=>{
    console.log("[MQTT]Connected")
    client.subscribe('info',(err)=>{
      if(err){
        client.end()
        console.error(err)
        return reject(err)
      }
      const handler = ()=>{
        if((ok++)>=0){
          if(ok==100)return//即成功处理
          if (ok - 1 == 0)
            setTimeout(handler, 1000)//最后等待1秒
          else{
            client.end()
            return reject("TIMEOUT")
          }
        }
        var data = "a{POS}".replace("{POS}",pos)
        client.publish('cmd',data)
        setTimeout(handler,1000)
      }
      handler()
    })
  })
}