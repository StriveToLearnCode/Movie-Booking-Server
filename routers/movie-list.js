const espress = require('express')
const db = require('../lib/db')
const router = espress.Router()

router.get('/list', (req, res) => {
  const sql = 'SELECT * FROM movie_list'
  db.query(sql, (err, results) => {
    if (err) throw err
    res.json(results)
  })
})

module.exports = router