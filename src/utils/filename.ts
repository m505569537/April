module.exports = {
  getTrueName: (str) => {
    return str.split('/').slice(-1)[0].split(1).join('.')
  }
}