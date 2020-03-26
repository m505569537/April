const fs = require('fs')
const path = require('path')
const router = require('koa-router')()
const multer = require('koa-multer')
const { UserModel, SeedInfoModel } = require('../db/models')

const filter = { pwd: 0, __v:0 }

// 策略1: 上传图片
let img_url = ''
let imgStorage = multer.diskStorage({
  // 文件保存路径
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../public/images'))
  },
  // 修改文件名称
  filename: function (req, file, cb) {
    // let fileFormat = (file.originalname).split('.')
    // const finalName = Date.now() + '.' + fileFormat[fileFormat.length - 1]
    const finalName = Date.now() + '.' + file.originalname
    img_url = 'http://localhost:4000/images/' + finalName
    cb(null, finalName)
  }
})
let uploadImg = multer({ storage: imgStorage })

// 在选择好图片之后就直接上传图片
// upload img
router.post('/uploadImg', uploadImg.single('img'), async (ctx, next) => {
  ctx.body = img_url ? { errcode: 0, img_url } : { errcode: 1, message: '图片上传出错，请重试' }
})

// 策略2: 上传视频
let vde_url = ''
let vdeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../public/videos'))
  },
  filename: function (req, file, cb) {
    // let fileFormat = file.originalname.split('.')
    const finalName = Date.now() + '.' + file.originalname
    vde_url = 'http://localhost:4000/videos/' + finalName
    cb(null, finalName)
  }
})
let uploadVde = multer({ storage: vdeStorage })

// upload video
router.post('/uploadVde', uploadVde.single('vde'), async (ctx, next) => {
  ctx.body = vde_url ? { errcode: 0, vde_url } : { errcode: 1, message: '视频上传失败，请重试' }
})


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
router.post('/register', async (ctx, next) => {
  const { username, pwd, email, avatar } = ctx.request.body
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
    const newUser = new UserModel({ userid: id, username, pwd, avatar, email })
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
router.post('/addSeed', async (ctx, next) => {
  const { token, title, content, imgs, vdes } = ctx.request.body
  console.log(token)
  let errcode = 1, message = '添加失败'
  const now = (new Date().toLocaleDateString()).replace(/\//g, '-') + ' ' + new Date().toString().substring(16,24)
  const seed = new SeedInfoModel({ token, title, content, imgs, vdes, publish_date: now })
  if (seed) {
    try {
      await seed.save()
      errcode = 0
      message = '添加成功'
    } catch (err) {
      console.log(err)
    }
  }
  ctx.body = { errcode, message }
})

// 删除seeds
router.post('/deleteSeed', async (ctx, next) => {
  const { detail } = ctx.request.body
  let errcode, message
  const err = await SeedInfoModel.deleteOne({ _id: detail._id })
  if (err.ok == 0) {
    errcode = 1
    message = '删除失败'
  } else {
    if (detail.imgs.length > 0) {
      detail.imgs.forEach(img => {
        const tmpPath = img.replace('http://localhost:4000/','../public/')
        if (fs.existsSync(path.resolve(__dirname, tmpPath))) {
          fs.unlinkSync(path.resolve(__dirname, tmpPath))
        }
      })
    }
    if (detail.vdes.length > 0) {
      detail.vdes.forEach(vde => {
        const tmpPath = vde.replace('http://localhost:4000/','../public/')
        if (fs.existsSync(path.resolve(__dirname, tmpPath))) {
          fs.unlinkSync(path.resolve(__dirname, tmpPath))
        }
      })
    }
    errcode = 0
    message = '删除成功'
  }

  ctx.body = { errcode, message }
})

// 获取seeds列表
router.get('/getSeeds', async (ctx, next) => {
  const { token } = ctx.request.query
  let errcode, message, data
  const seeds = await SeedInfoModel.find({ token }, filter)
  if (seeds) {
    errcode = 0
    data = seeds.reverse()
  } else {
    errcode = 1
    message = '请添加你的seed吧'
  }
  ctx.body = errcode === 0 ? { errcode, data } : { errcode, message }
})

module.exports = router