//引入express模块
const express = require('express')
// 创建 user路由
const user = express.Router()
//从../controller/user 引入sql方法
const {
    List,Page,check, testTergister, loginByUsername, sendCode, registration
} = require('../controller/list')
//引入成功失败 返回方法
const {
    success,
    fail
} = require('../config/resModel')
const { verify } = require("../sign");

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

// 测试注册
user.get("/test-tergister", async (req, res) => {
    const result = await testTergister(req);
    if(result?.code === 500) {
        return res.send(fail(result.reason));
    } else {
        return res.send(success("请求成功", result));
    }
});


// 登录
user.post("/login-by-username", async (req, res) => {
    const result = await loginByUsername(req, req.body);
    if(result?.code === 500) {
        return res.send(fail(result.reason || ""));
    } else {
        return res.send(success("请求成功", result));
    }
});

// 邮箱发送验证码
user.post("/email-send-code", async (req, res) => {
    const result = await sendCode(req.body.email);
    if(result?.code === 500) {
        return res.send(fail(result.reason || ""));
    } else {
        return res.send(success("请求成功", result));
    }
});

// 注册
user.post("/sign-up", async (req, res) => {
    const result = await registration(req.body, req);
    if(result?.code === 500) {
        return res.send(fail(result.reason || ""));
    } else {
        return res.send(success("请求成功", result));
    }
});




// verify 校验 token;
user.get("/get-peofile", verify, async (req, res) => {
    console.log("username: ", req.user);
    return res.send(success("请求成功", true));
});


// 暴露
module.exports = user