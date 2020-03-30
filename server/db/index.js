const mongoose = require('mongoose')

mongoose.connect('mongodb://0.0.0.0:27017/april', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('connected', () => {
  console.log('数据库已连接')
})