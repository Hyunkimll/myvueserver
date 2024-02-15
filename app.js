//引入处理post请求参数的组件
// const bodyParser = require('body-parser');
//引入接口为/user的路由
const user = require('./router/list')
const details = require('./router/details')
const express = require('express')

//引入服务js
const app = require('./bin/www')
//防止跨域
app.all('*', function (req, res, next) {
    console.log('有请求')
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    if (req.method.toLowerCase() == 'options')
        res.send(200); //让options尝试请求快速结束
    else {
        next();
    }
});
//使用bodyParser对post请求参数进行处理
// app.use(bodyParser.urlencoded({
//     extended: false
// }))
// app.use(bodyParser.json())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//使用user路由
app.use('/data', user)
app.use('/detail', details)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
