import axios from 'axios'

// axios.defaults.baseURL = 'http://149.129.92.92:4000'
axios.defaults.baseURL = 'http://localhost:4000'

axios.interceptors.request.use(config => {
  config.withCredentials = true
  return config
}, err => {
  return Promise.reject(err)
})

axios.interceptors.response.use(response => {
  if (response.status === 206) {
    return response
  }
  return response.data
}, err => {
  if (err.response.status == 401) {
    // 因为nwjs中，在这里进行路由跳转会造成应用崩溃，所以就在组件中跳转了
    return
  }
  return Promise.reject(err)
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

// 获取视频数据
export const getFileStream = (config:object) => axios({
  method: 'GET',
  url: '/hhh/1586173410818.a_sky_full_of_stars.mp4',
  baseURL: 'http://localhost:4000',
  ...config
})