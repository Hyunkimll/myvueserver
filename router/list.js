//引入express模块
const express = require('express')
// 创建 user路由
const user = express.Router()
//从../controller/user 引入sql方法
const {
    List,Page,check
} = require('../controller/list')
//引入成功失败 返回方法
const {
    success,
    fail
} = require('../config/resModel')
//写接口   /user/userList
user.get('/list', async (req, res) => {
    const pagenum = parseInt(req.query.page_num)  //当前的num
    const pageSizes = parseInt(req.query.page_size)  //当前页的数量
    const uid = req.query.uid || ''  //当前登录者id
    let params = []
    let params1 = [];
    const area_id = req.query.areaId || []
    //sql返回值
    if(area_id.length  &&  req.query.startTime && req.query.endTime){
        params = [uid,uid,area_id,req.query.startTime,req.query.endTime, (pagenum - 1) * pageSizes,pageSizes]
        params1 = [uid,uid,area_id,req.query.startTime,req.query.endTime]
    }else if(area_id.length){
        params = [uid,uid,area_id, (pagenum - 1) * pageSizes,pageSizes]
        params1 = [uid,uid,area_id]
    }else if(req.query.startTime && req.query.endTime){
        params = [uid,uid,req.query.startTime,req.query.endTime, (pagenum - 1) * pageSizes,pageSizes]
        params1 = [uid,uid,req.query.startTime,req.query.endTime]
    }else{
        params = [uid,uid, (pagenum - 1) * pageSizes,pageSizes]
        params1 = [uid,uid]
    }
    const result = await List(params,area_id,req.query.startTime)
    const total = await Page(params1,area_id,req.query.startTime)
    console.log(req.query)
    console.log(result)
    //返回给前端
    res.send(success('返回的数据', result,{
        total,pagenum,pageSizes
    }))
})

user.get('/check', async (req, res) => {
    const uid = req.query.uid || ''  //当前登录者id
    //sql返回值
    const params = [uid,uid]
    const result = await check(params)
    console.log(req.query)
    console.log(result)
    //返回给前端
    res.send(success('返回的数据', result))
})
// 暴露
module.exports = user