var express = require('express')
var app = express()

// 支持加载多个db json文件
const _ = require('lodash')
const path = require('path')
const fs = require('fs')
const mockDir = path.join(__dirname, 'data')
const base = {}
const files = fs.readdirSync(mockDir)
files.forEach(function(file) {
  _.extend(base, require(path.resolve(mockDir, file)))
})
console.log('base', base)

// 原路返回路由
var whiteRouter = ['/sys/menus/routers']

// 路由中间件
var outVal = {}
app.use(function(req, res, next) {
  console.log('req.baseUrl', req.originalUrl)
  console.log('req.path', req.path)
  var addr
  if (isContain(req.path)) {
    addr = req.originalUrl
  } else {
    addr = req.path
  }
  outVal = base[addr]
  if (outVal.code !== 200) {
    /*
      可以服务器错误
      {
          code: res.code,
          data: res.data,
          msg: res.msg
      }
    */
    res.status(outVal.code).send({
      code: outVal.code,
      data: outVal.data,
      msg: outVal.msg
    })
  } else {
    /* 正常请求 */
    res.status(200).send(outVal)
  }
  next()
})

app.listen(9090, function() {
  console.log('address:http://localhost:9090')
})

// 是否包含 测试字符串
function isContain(testString) {
  for (var i = 0; i < whiteRouter.length; i++) {
    if (whiteRouter[i] === testString) {
      return true
    }
  }
  return false
}
