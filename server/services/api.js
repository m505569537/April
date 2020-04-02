const axios = require('axios')

axios.defaults.baseURL = 'https://api.weixin.qq.com'

axios.interceptors.request.use(config => {
  config.withCredentials = true
  return config
}, err => {
  return Promise.reject(err)
})

axios.interceptors.response.use(response => {
  return response.data
})

const getOpenid = (params) => axios.get('/sns/jscode2session', { params })

module.exports = {
  getOpenid
}