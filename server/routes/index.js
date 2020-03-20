const path = require('path')
const router = require('koa-router')()
const multer = require('koa-multer')
const { UserModel, SeedInfoModel } = require('../db/models')

const filter = { pwd: 0, __v:0 }

// 策略1: 上传图片
let img_url = []
let imgStorage = multer.diskStorage({
  // 文件保存路径
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../public/images'))
  },
  // 修改文件名称
  filename: function (req, file, cb) {
    let fileFormat = (file.originalname).split('.')
    const finalName = Date.now() + '.' + fileFormat[fileFormat.length - 1]
    img_url.push('http://localhost:4000/images/' + finalName)
    cb(null, finalName)
  }
})
let uploadImg = multer({ storage: imgStorage })

// 策略2: 上传视频
let vde_url
let vdeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../public/videos'))
  },
  filename: function (req, file, cb) {
    let fileFormat = file.originalname.split('.')
    vde_url = 'http://localhost:4000/videos/' + Date.now() + '.' + fileFormat[fileFormat.length - 1]
    cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1])
  }
})
let uploadVde = multer({ storage: vdeStorage })


// 用户信息接口
// 登录
router.post('/login', async (ctx, next) => {
  const { id, pwd } = ctx.request.body
  let errcode = 1, message, data
  const user = await UserModel.findOne({ $or: [{ username: id }, { email: id }] })
  if(user) {
    if(user.pwd !== pwd) {
      message = '用户名或密码错误'
    } else {
      errcode = 0
      delete user.pwd
      data = user
      ctx.cookies.set('token', user._id, {
        maxAge: 1000*60*60*24*7,
        httpOnly: false
      })
    }
  } else {
    errcode = 1
    message = '用户不存在'
  }
  ctx.body = errcode === 0 ? { errcode, data } : { errcode, message }
})

// 注册
router.post('/register', uploadImg.single('avatar'),async (ctx, next) => {
  const { username, pwd, email } = ctx.req.body
  let errcode = 1, message, data
  const user = await UserModel.findOne({ $or: [{ username }, { email }] })
  if(user){
    message = '用户已存在'
  } else {
    const users = await UserModel.find({})
    let id
    if(users.length > 0) {
      id = users.length + 1
    } else {
      id = 1
    }
    const newUser = new UserModel({ userid: id, username, pwd, avatar: img_url[0], email })
    try {
      await newUser.save()
      errcode = 0
      delete newUser.pwd
      data = newUser
      ctx.cookies.set('token', newUser._id, {
        maxAge: 1000*60*60*24*7,
        httpOnly: false
      })
    }catch(err){
      message = '注册失败'
    }
  }
  ctx.body = errcode === 0 ? { errcode, data } : { errcode, message }
})

// 通过token自动登录获取用户信息
router.get('/getUser', async (ctx, next) => {
  const { token } = ctx.request.query
  let errcode = 1, data, message
  const user = await UserModel.findOne({ _id: token }, filter)
  if (user) {
    errcode = 0
    data = user
  } else {
    message = '身份令牌已失效，请重新登录'
  }
  ctx.body = errcode == 0 ? { errcode, data } : { errcode, message }
})

// 添加seeds
// router.post('/addSeed', async (ctx, next) => {
//   const { userid, title, content, imgs } = ctx.request.body
// })

module.exports = router