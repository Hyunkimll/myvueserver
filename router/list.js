//引入express模块
const express = require('express')
// 创建 user路由
const user = express.Router()
//从../controller/user 引入sql方法
const {
    List
} = require('../controller/list')
//引入成功失败 返回方法
const {
    success,
    fail
} = require('../config/resModel')
//写接口   /user/userList
user.get('/list', async (req, res) => {
    //sql返回值
    const result = await List()
    console.log(result)
    //返回给前端
    res.send(success('返回的数据', result))
})
// 暴露
module.exports = user