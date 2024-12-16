const db = require('../lib/db')
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const config = require('../config')

router.post('/login', (req, res) => {
  const { username, password } = req.body
  const sql = `SELECT * FROM movie_users WHERE username = '${username}' AND password = '${password}'`
  db.query(sql, (err, results) => {
    if (err) throw err
    if (results.length > 0) {
      const user = results[0]
      const token = jwt.sign({ id: user.id }, config.jwtSecretKey, { expiresIn: '1h' })
      res.json({ token })
    } else {
      res.status(401).json({ message: 'Invalid username or password' })
    }
  })
})

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  // 检查用户名和密码是否为空
  if (!username || !password) {
    return res.status(400).json({ message: '用户名或密码不能为空' });
  }

  const findSql = `SELECT * FROM movie_users WHERE username = ?`;
  db.query(findSql, [username], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      return res.status(400).json({ message: '用户名已存在' });
    }
  });

  // 插入新用户
  const insertSql = `INSERT INTO movie_users (username, password) VALUES (?, ?)`;
  db.query(insertSql, [username, password], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 1) {
      const token = jwt.sign({ id: result.insertId }, config.jwtSecretKey, { expiresIn: '1h' });
      res.json({ message: 'User registered successfully', token });
    }
  });

});




module.exports = router;

