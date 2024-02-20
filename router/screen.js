//引入express模块
const express = require('express')
// 创建 details路由
const screen = express.Router()
//从../controller/details 引入sql方法
const {
    AdressCount,AdressTime
} = require('../controller/screen')
screen.get('/', async (req, res) => {
    //sql返回值
    console.log(req.query)
    const adresscount = await AdressCount();
    const adresstime = await AdressTime([req.query.startTime,req.query.endTime]);
    const time = await AdressTime([req.query.beginTime,req.query.overTime]);
    //返回给前端
    res.send({
        code: 200,
        msg:"详情的数据",
        adresscount,adresstime,time
    })
})
// 暴露
module.exports = screen