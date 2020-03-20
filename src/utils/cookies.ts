module.exports = {
  'getAll': () => {
    const win = nw.Window.get()
    return new Promise(resolve => {
      win.cookies.getAll({}, (cookies) => {
        resolve(cookies)
      })
    })
  },
  'parseObj': (arr) => {
    let obj:any = {}
    arr.map(item => {
      obj[item.name] = item.value
    })
    return obj
  }
}

// const cookies = await Cookies.parseObj(Cookies.getAll)
// 可以获得cookies对象