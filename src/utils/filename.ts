module.exports = {
  getTrueName: (str) => {
    return str.split('/').slice(-1)[0].split('.').slice(1).join('.')
  }
}