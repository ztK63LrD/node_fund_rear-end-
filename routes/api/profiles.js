// 用户登录 / 注册相关的内容
const express = require('express')
const router = express.Router()
const passport = require("passport")

// 引入具体的数据类型
const Profile = require('../../models/Profile')

/**
 * 创建信息接口
 * POST api/profiles/add
 */
router.post("/add", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    // 判断错误情况
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const profileFields = {};
    if (req.body.type) profileFields.type = req.body.type;
    if (req.body.describe) profileFields.describe = req.body.describe;
    if (req.body.income) profileFields.income = req.body.income;
    if (req.body.expend) profileFields.expend = req.body.expend;
    if (req.body.cash) profileFields.cash = req.body.cash;
    if (req.body.remark) profileFields.remark = req.body.remark;
    new Profile(profileFields).save().then((profile) => {
        res.json(profile);
      }).catch(err => {
        res.status(500).json(err);
      })
  })(req, res, next);
})

/**
 * 获取所有信息
 * POST api/profiles
 */
router.get( '/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.find().then((profiles) => {
      if (!profiles || profiles.length === 0) return res.status(404).json({ error: '数据为空！' })
      const profileData = { profiles: profiles }
      res.json(profileData)
    }).catch((err) => res.status(404).json(err));
  }
);

/**
 * 获取单个信息
 * POST api/profiles/:id
 */
router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ _id: req.params.id }).then((profile) => {
    if (!profile) return res.status(404).json({ error: '数据为空！' });
    res.json(profile);
  }).catch((err) => res.status(404).json(err));
});

/**
 * 编辑信息接口
 * POST api/profiles/edit
 */
router.post(
  "/edit/:id", 
  passport.authenticate("jwt", { session: false }), 
  (req, res) => {
    const profileFields = {};
    if (req.body.type) profileFields.type = req.body.type;
    if (req.body.describe) profileFields.describe = req.body.describe;
    if (req.body.income) profileFields.income = req.body.income;
    if (req.body.expend) profileFields.expend = req.body.expend;
    if (req.body.cash) profileFields.cash = req.body.cash;
    if (req.body.remark) profileFields.remark = req.body.remark;
    Profile.findOneAndUpdate(
      { _id: req.params.id },
      { $set: profileFields },
      { new: true }
    ).then(profile => res.json(profile))
  }
)

/**
 * 删除信息
 * POST api/profiles/:id
 */
router.delete(
  '/delete/:id', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    Profile.findOneAndDelete({ _id: req.params.id }).then(profile => {
      res.json(profile);
    }).catch(err => res.status(404).json('删除失败'));    
});

module.exports = router