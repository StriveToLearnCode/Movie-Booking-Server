const db = require('../lib/db');
const express = require('express');
const router = express.Router();

router.post('/addToOrder', (req, res) => {
  const { newOrderItem } = req.body;

  // 从验证后的 Token 中获取 userId
  const userId = req.auth.id;

  // 检查传入的参数
  if (!userId || newOrderItem === undefined) {
    return res.status(400).json({ message: '缺少必要参数' });
  }

  // 获取当前用户的 order_list 字段
  const sql = `SELECT \`order_list\` FROM movie_users WHERE id = ?`;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: '数据库查询失败', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }

    let orderArray;

    try {
      // 解析现有的 order_list 字段，如果为空，则初始化为空数组
      orderArray = results[0].order_list ? JSON.parse(results[0].order_list) : [];
    } catch (parseError) {
      return res.status(500).json({ message: '解析 order_list 数据失败', error: parseError });
    }

    // 确保 newOrderItem 是一个有效的对象，避免添加不合法数据
    if (typeof newOrderItem !== 'object' || Array.isArray(newOrderItem) || !newOrderItem) {
      return res.status(400).json({ message: '无效的订单项格式' });
    }

    // 将新元素添加到数组
    orderArray.push(newOrderItem);

    // 更新数据库中的 order_list 字段
    const updateSql = `UPDATE movie_users SET \`order_list\` = ? WHERE id = ?`;
    db.query(updateSql, [JSON.stringify(orderArray), userId], (updateErr) => {
      if (updateErr) {
        return res.status(500).json({ message: '更新失败', error: updateErr });
      }

      // 返回成功的响应
      res.status(200).json({
        message: '订单更新成功',
        newOrder: orderArray
      });
    });
  });
});

module.exports = router;
