const express  = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const passport = require("passport")
const app = express()

// 引入user.js
const users = require('./routes/api/user')
// 引入profile.js
const profiles = require('./routes/api/profiles')


// 连接数据库的 URL
const MongoUrl = 'mongodb://localhost:27017/node_fund'
// 使用 body-parser 中间件
app.use(bodyParser.urlencoded({ extended: false })) // 解析表单数据
app.use(bodyParser.json()) // 解析 JSON 格式的请求体
app.use(express.static('public'));

// 连接数据库
mongoose.connect(MongoUrl).then(() => {
  console.log('连接成功')
}).catch((err) => {
  console.log('连接失败', err)
})

// passport初始化
app.use(passport.initialize())
// 引入passport逻辑功能代码
require("./config/passport")(passport)

// 使用routes
app.use('/api/users', users)
app.use('/api/profiles', profiles)

app.get('/',(req,res)=>{
  res.json({ msg: 'hello world' })
})

// 设置端口号
const post = process.env.PORT || 8080
app.listen(post, () => {
  console.log(`Server is running on port ${post},url: http://127.0.0.1:${post}`)
})