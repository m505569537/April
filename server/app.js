const path = require('path')
const koa = require("koa")
const staticServer = require('koa-static')
const bodyParser = require("koa-bodyparser")
const cors = require("koa2-cors")
const router = require("./routes")

require("./db")

const app = new koa()

app.use(cors({
  origin: function(ctx) {
    const whiteList = ['http://localhost:3000', 'http://localhost:8080']
    if(whiteList.indexOf(ctx.request.header.origin) !== -1){
      return ctx.request.header.origin
    }
    return '*'
  },
  maxAge: 5,
  credentials: true,     //允许服务器发送cookie
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposeHeaders: ['www-Authenticate', 'Server-Authorization']
}))

// 搭建静态资源服务器，使目录中的文件可以被访问
// localhost:4000/images/XXX.jpg
app.use(staticServer(path.join(__dirname, '/public/')))
app.use(bodyParser())
app.use(router.routes())

app.listen(4000, () => {
  console.log("服务器已连接")
})
