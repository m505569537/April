const fs = require('fs')
const path = require('path')
const router = require('koa-router')()
const multer = require('koa-multer')
const { UserModel, SeedInfoModel, PlatformModel } = require('../db/models')

const filter = { pwd: 0, __v:0 }

const baseUrl = 'http://149.129.92.92:4000/'

const deleteFile = (url) => {
  const tmpPath = url.replace(baseUrl,'../public/')
  if (fs.existsSync(path.resolve(__dirname, tmpPath))) {
    fs.unlinkSync(path.resolve(__dirname, tmpPath))
  }
}

const clearBlankFields = (str) => {
  return str.replace(/\s*/g,"")
}

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
    const finalName = clearBlankFields(Date.now() + '.' + file.originalname)
    img_url = baseUrl + 'images/' + finalName
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
    const finalName = clearBlankFields(Date.now() + '.' + file.originalname)
    vde_url = baseUrl + 'videos/' + finalName
    cb(null, finalName)
  }
})
let uploadVde = multer({ storage: vdeStorage })

// upload video
router.post('/uploadVde', uploadVde.single('vde'), async (ctx, next) => {
  ctx.body = vde_url ? { errcode: 0, vde_url } : { errcode: 1, message: '视频上传失败，请重试' }
})

// 策略3: 不分类
const imgSuffix = /(jpg|png|jpeg|gif)/
const vdeSuffix = /(avi|rmvb|flv|mp4|wmv|mkv)/
let tmp_url = []
let fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileFormat = file.originalname.split('.')
    if (imgSuffix.test(fileFormat[fileFormat.length - 1])) {
      cb(null, path.resolve(__dirname, '../public/platform/images'))
    } else if (vdeSuffix.test(fileFormat[fileFormat.length - 1])) {
      cb(null, path.resolve(__dirname, '../public/platform/videos'))
    } else {
      cb(null, path.resolve(__dirname, '../public/platform/files'))
    }
  },
  filename: (req, file, cb) => {
    const finalName = clearBlankFields(Date.now() + '.' + file.originalname)
    const fileFormat = file.originalname.split('.')
    if (imgSuffix.test(fileFormat[fileFormat.length - 1])) {
      tmp_url.push(baseUrl + 'platform/images/' + finalName)
    } else if (vdeSuffix.test(fileFormat[fileFormat.length - 1])) {
      tmp_url.push(baseUrl + 'platform/videos/' + finalName)
    } else {
      tmp_url.push(baseUrl + 'platform/files/' + finalName)
    }
    cb(null, finalName)
  }
})
let uploadFile = multer({ storage: fileStorage })

router.post('/uploadFiles', uploadFile.array('files'), async (ctx, next) => {
  // console.log('url', tmp_url)
  const { type } = ctx.req.body
  const token = ctx.cookies.get('token')
  let errcode, message
  let tmp_obj = []
  if (tmp_url.length > 0) {
    tmp_url.forEach(item => {
      tmp_obj.push({
        url: item,
        type
      })
    })
    tmp_url = []
    const platform = await PlatformModel.findOne({ token })
    if (platform) {
      try {
        await PlatformModel.updateOne({ token }, { files: platform.files.concat(tmp_obj) })
        errcode = 0
        message = '上传成功' + tmp_obj.length + '项'
      } catch (error) {
        errcode = 1
        message = '上传失败'
      }
    } else {
      const newPlatform = new PlatformModel({ token, files: tmp_obj })
      try {
        await newPlatform.save()
        errcode = 0
        message = '上传成功' + tmp_obj.length + '项'
      } catch (error) {
        errcode = 1
        message = '上传失败'
      }
    }
  } else {
    errcode = 1
    message = '上传失败'
  }
  ctx.body = { errcode, message }
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
  const token = ctx.cookies.get('token')
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
  const { title, content, imgs, vdes } = ctx.request.body
  const token = ctx.cookies.get('token')
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
      detail.imgs.forEach(img => deleteFile(img))
    }
    if (detail.vdes.length > 0) {
      detail.vdes.forEach(vde => deleteFile(vde))
    }
    errcode = 0
    message = '删除成功'
  }

  ctx.body = { errcode, message }
})

// 获取seeds列表
router.get('/getSeeds', async (ctx, next) => {
  const token = ctx.cookies.get('token')
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

// 获取图床数据
router.get('/getPlatform', async (ctx, next) => {
  const { type } = ctx.request.query
  const token = ctx.cookies.get('token')
  let errcode = 1, message, data
  const platform = await PlatformModel.findOne({ token }, filter)
  if (platform) {
    errcode = 0
    if (type == 'all') {
      data = platform.files.reverse()
    } else {
      data = platform.files.filter(item => item.type == type).reverse()
    }
  } else {
    errcode = 1
    message = '暂无数据'
  }
  ctx.body = errcode === 0 ? { errcode, data } : { errcode, message }
})

// 删除图床中的文件
router.post('/deleteFile', async (ctx, next) => {
  const { url } = ctx.request.body
  const token = ctx.cookies.get('token')
  let errcode = 1, message
  const platform = await PlatformModel.findOne({ token })
  if (platform) {
    let files = platform.files.filter(item => item.url != url)
    deleteFile(url)
    await PlatformModel.updateOne({ token }, { files })
    errcode = 0
    message = '删除成功'
  } else {
    message = '删除失败'
  }
  ctx.body = { errcode, message }
})

module.exports = router