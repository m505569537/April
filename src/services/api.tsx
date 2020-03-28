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

// utils
// upload img
export const uploadImg = (params: object) => axios.post('/uploadImg', params)
// upload video
export const uploadVde = (params: object) => axios.post('/uploadVde', params)
// upload files
export const uploadFiles = (params: object) => axios.post('/uploadFiles', params)

// Seed
export const addSeed = (params: object) => axios.post('/addSeed', params)
export const deleteSeed = (params: object) => axios.post('/deleteSeed', params)
export const getSeeds = () => axios.get('/getSeeds')

// platform
export const getPlatform = (params: object) => axios.get('/getPlatform', { params })
export const deleteFile = (params: object) => axios.post('/deleteFile', params)