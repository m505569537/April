import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:4000'

axios.interceptors.request.use(config => {
  config.withCredentials = true
  return config
}, err => {
  return Promise.reject(err)
})

axios.interceptors.response.use(response => {
  return response.data
})

// 用户
// 登录
export const userLogin = (params: object) => axios.post('/login', params)
// 注册
export const userRegister = (params: object) => axios.post('/register', params)
// token自动登录
export const autoLogin = (params: object) => axios.get('/getUser', { params })

// Seed
export const addSeed = (params: any) => axios.post('/addSeed', params)