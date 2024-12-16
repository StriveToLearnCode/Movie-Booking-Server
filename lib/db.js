const mysql = require('mysql')
// 连接数据库
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'movie_booking_db'
})

module.exports = db