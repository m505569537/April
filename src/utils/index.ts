import Cookies from './cookies'
import Filename from './filename'

export const getCookies = async (key) => {
  let obj:any = {}
  const cookies = await Cookies.getAll()
  obj = Cookies.parseObj(cookies)
  return obj[key]
}

export const deleteCookie = (name) => Cookies.deleteCookie(name)

export const getTrueName = (name) => Filename.getTrueName(name)