const mongoose = require('mongoose')

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 定义模式,用于指定数据的结构和字段。
const Schema = mongoose.Schema
// 使用Schema变量来定义具体的数据模型
const ProfileSchema = new Schema({
  type: {
    type: String,
  },
  describe: {
    type: String,
  },
  income: {
    type: String,
    required: true
  },
  expend: {
    type: String,
    required: true
  },
  cash: {
    type: String,
    required: true
  },
  remark: {
    type: String,
  },
  date: {
    type: Date,
    default: formatDate(new Date())
  },
})
/** 
 * 创建了一个名为users的MongoDB集合，并使用userSchema指定了集合中文档的结构
 * 将前一步创建的模型赋值给一个变量User，使其成为我们操作users集合的接口。
 */
module.exports = Profile = mongoose.model('profile', ProfileSchema)
