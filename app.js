const express = require('express');
const app = express();
const cors = require('cors');

// 配置跨域中间件
app.use(cors());

// 单独处理 OPTIONS 请求，返回 204 响应（没有内容）
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Max-Age', '86400');
  res.sendStatus(204); // 无内容响应
});

// 配置解析表单数据的中间件
// 解析 application/x-www-form-urlencoded 格式的数据
app.use(express.urlencoded({ extended: false }));

// 配置解析 JSON 格式数据的中间件
// 解析 application/json 格式的数据
app.use(express.json());  // <-- 这里是重要的

// 配置解析 Token 的中间件
const { expressjwt } = require('express-jwt');
const config = require('./config');
app.use(expressjwt({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({
  path: [
    '/',            // Exclude the homepage route
    '/api/login',   // Exclude login route (if you have one)
    '/api/register',// Exclude register route (if you have one)
    /^\/api\//,     // Exclude all other /api/ routes
    '/detail',      // Only require JWT validation on /detail
    '/my/order',    // Only require JWT validation on /my/order
  ],
}));
// 路由

const userRouter = require('./routers/user');
app.use('/api', userRouter);

const movieListRouter = require('./routers/movie-list');
app.use('/movie', movieListRouter);

const cinemaListRouter = require('./routers/cinema-list');
app.use('/cinema', cinemaListRouter);

const userInfoRouter = require('./routers/userInfo');
app.use('/my', userInfoRouter);

const orderRouter = require('./routers/order');
app.use('/my/order', orderRouter);
// 启动应用
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
