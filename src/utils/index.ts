import Cookies from './cookies'

export const getCookies = async (key) => {
  let obj:any = {}
  const cookies = await Cookies.getAll()
  obj = Cookies.parseObj(cookies)
  return obj[key]
}

export const deleteCookie = (name) => Cookies.deleteCookie(name)