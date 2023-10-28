const mongoose = require('mongoose')

// 定义模式,用于指定数据的结构和字段。
const Schema = mongoose.Schema
// 使用Schema变量来定义具体的数据模型
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
  },
  identity: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
})
/** 
 * 创建了一个名为users的MongoDB集合，并使用userSchema指定了集合中文档的结构
 * 将前一步创建的模型赋值给一个变量User，使其成为我们操作users集合的接口。
 */
module.exports = User = mongoose.model('users', userSchema)
