const koa = require("koa")
const bodyParser = require("koa-bodyparser")
const cors = require("koa2-cors")
const router = require("./routes")

require("./db")

const app = new koa()

app.use(
  cors({
    origin: ctx => {
      const whiteList = [""]
      if (whiteList.indexOf(ctx.request.header.origin) !== -1) {
        return ctx.request.header.origin
      }
      return "*"
    },
    maxAge: 5,
    credentials: true,
    allowMethods: ["GET", "POST"],
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
    exposeHeaders: ["www-Authenticate", "Server-Authorization"]
  })
)

app.use(bodyParser())
app.use(router.routes())

app.listen(4000, () => {
  console.log("服务器已连接")
})
