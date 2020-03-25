const mongoose = require('mongoose')

// 用户信息
const userSchema = mongoose.Schema({
  userid: { type: Number, required: true },
  username: { type: String, required: true },
  pwd: { type: String, required: true },
  avatar: { type: String, required: true },
  email: { type: String, required: true }
})

const UserModel = new mongoose.model('users', userSchema)

exports.UserModel = UserModel

// seed页
const seedInfoSchema = mongoose.Schema({
  token: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  imgs: { type: Array },
  vdes: { type: Array },
  publish_date: { type: String, required: true }
})

const SeedInfoModel = new mongoose.model('seeds', seedInfoSchema)

exports.SeedInfoModel = SeedInfoModel