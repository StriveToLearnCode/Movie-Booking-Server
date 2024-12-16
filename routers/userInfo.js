const { expressjwt } = require('express-jwt');
const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const config = require('../config');
router.get('/userInfo', expressjwt({ secret: config.jwtSecretKey, algorithms: ['HS256'] }), (req, res) => {
  const sql = `select id, username, order_list,is_admin from movie_users where id=?`

  db.query(sql, req.auth.id, (err, results) => {
    if (err) {
      return res.send(err)
    }
    if (results.length !== 1) {
      return res.send('获取用户信息失败')
    }
    res.send({
      status: 0,
      message: '获取用户信息成功',
      data: results[0]
    })
  })
})

router.get("/userlist", (req, res) => {
  const sql = `select * from movie_users`
  db.query(sql, (err, results) => {

  })
})
module.exports = router;
