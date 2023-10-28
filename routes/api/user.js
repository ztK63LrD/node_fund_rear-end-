// 用户登录 / 注册相关的内容
const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt")
const multer = require('multer');
const jwt = require("jsonwebtoken")
const passport = require("passport")

// 引入具体的数据类型
const User = require('../../models/User')

// 配置 multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images') // 设置图片保存的路径
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]) // 设置图片的文件名
  }
})
const upload = multer({ storage: storage })

/**
 * 注册接口
 * POST api/users/register 
 */
router.post('/register', upload.single('avatar'), (req,res) => {
  // 查询数据库中是否拥有邮箱
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json('邮箱已被注册')
    } else {
      if (req.file && req.file.filename) {
        // 获取当前的图片路径
        var avatarUrl = req.protocol + '://' + req.get('host') + '/images/' + req.file.filename;
      } else {
        var avatarUrl = req.protocol + '://' + req.get('host') + '/images/' + 'default.jpg'
      }
      // 注册新邮箱
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar: avatarUrl,
        identity: req.body.identity
      })
      // 进行密码加密
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          newUser.password = hash
          newUser.save().then(user => res.json(user)).catch(err => console.log(err))
        })
      })
    }
  })
})
/**
 * 登录接口
 * POST api/users/login
 */
router.post('/login', (req,res) => {
  const email = req.body.email
  const password = req.body.password
  // 查询数据库
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json('用户不存在!')
    }
    // 密码匹配
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // jwt.sign("规则","加密名字","过期时间","箭头函数")
        const rule = {
          id: user.id, 
          name: user.name,
          identity: user.identity
        }
        jwt.sign(rule, "secret", { expiresIn: 3600 }, (err,token) => {
          if (err) throw err
          res.json({
            success: true,
            token: "Bearer " + token
          })
        })
      } else {
        return res.status(400).json('密码错误！')
      }
    })
  })
})
/**
 * 获取登录信息
 * get api/users/current
 */
router.get('/current', passport.authenticate("jwt", { session: false }), (req,res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar,
    identity: req.user.identity
  })
})

module.exports = router