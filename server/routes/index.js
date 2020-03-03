const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  ctx.body = 0
})

module.exports = router