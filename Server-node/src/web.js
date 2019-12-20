const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const Data = require("./data")

function Error(status,message){
    return {status,message}
}

app.use(async (ctx, next) => {
    ctx.type = "application/json"
    try {
        await next();
        ctx.body = {
            ok:true,
            data: ctx.body
        }
    } catch (err) {
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = {
            ok:false,
            data: err.message
        };
    }
})
app.use(bodyParser())

app.use(router().routes())

app.listen({port:8088});
console.log("Koa listen on 8088")


function router() {
    const router = new Router();
    router.get("/ping",ctx =>{
        ctx.body = ["Pong!"]
    })
    router.post("/posts",async ctx=>{
        const {page} = ctx.request.body
        const posts = await Data.getPosts(page||1)
        ctx.body = posts.map(value=>value.toJsonObj())
    })
    router.post("/getInfo",async ctx=>{
        const {openId} = ctx.request.body
        if(!openId)
            throw Error(403,"NO OPENID")
        const user = await Data.getUserByOpenId(openId)
        if(!user)
            throw Error(403,"NO FOUND")
        ctx.body = user.toJsonObj()
    })
    router.post("/register",async ctx=>{
        const {openId,name,cardId} = ctx.request.body
        if(!openId||!name||!cardId)
            throw Error(403,"BAD REQUEST")
        let user = new Data.User()
        user.openId = openId
        user.name = name
        user.cardId = +cardId
        user = await Data.createUser(user)
        ctx.body=user.toJsonObj()
    })
    router.post("/report")
    return router
}
