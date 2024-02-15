//引入express模块
const express = require('express')
// 创建 details路由
const details = express.Router()
//从../controller/details 引入sql方法
const {
    Basic,Diary,Photograph,Photoalbum,Comment,Reply,Likenum,Notlikenum,Content,ReplyContent
} = require('../controller/details')
//写接口   /data/details
details.get('/details', async (req, res) => {
    //sql返回值
    const uid = req.query.uid || ''  //当前登录者uid
    const id = req.query.id || ''  //当前文章id
    console.log(uid,id)
    const basic = await Basic([uid,uid,id]);
    const diary = await Diary([uid,uid,id]);
    const photograph = await Photograph([uid,uid,id]);
    const photoalbum = await Photoalbum([uid,uid,id]);
    //返回给前端
    res.send({
        code: 200,
        msg:"详情的数据",
        basic:basic[0],diary,photograph,photoalbum
    })
})
details.get('/comment', async (req, res) => {
    //sql返回值
    const uid = req.query.uid || ''  //当前登录者uid
    const id = req.query.id || ''  //当前文章id
    console.log(uid,id)
    const comment = await Comment([uid,uid,id]);
    const reply = await Reply([uid,uid,id]);
    comment.forEach(item=>{
        item.children = []
        reply.forEach(item1=>{
            if(item.fromId === item1.toId){
                item.children.push(item1)
            }
        })
    })
    //返回给前端
    res.send({
        code: 200,
        msg:"详情的数据",
        comment
    })
})

details.post('/like', async (req, res) => {
    //sql返回值
    const uid = req.body.uid || ''  //当前登录者uid
    const ownerId = req.body.ownerId || ''  //当前文章id
    const fromId = req.body.fromId || ''  //当前文章id
    console.log(req.body)
    const likenum = await Likenum([uid,uid,ownerId,fromId]);
    // 返回给前端
    res.send({
        code: 200,
        msg:likenum
    })
})

details.post('/notlike', async (req, res) => {
    //sql返回值
    const uid = req.body.uid || ''  //当前登录者uid
    const ownerId = req.body.ownerId || ''  //当前文章id
    const fromId = req.body.fromId || ''  //当前文章id
    console.log(req.body)
    const notlike = await Notlikenum([uid,uid,ownerId,fromId]);
    // 返回给前端
    res.send({
        code: 200,
        msg:notlike
    })
})

details.post('/content', async (req, res) => {
    //sql返回值
    console.log(res.body)
    const uid = parseInt(req.body.uid) || ''  //当前登录者uid
    const ownerId = parseInt(req.body.ownerId) || ''  //当前文章id
    const date = req.body.date || ''  //当前文章id
    const fromName = req.body.fromName || ''  //当前文章id
    const fromAvatar = req.body.fromAvatar || ''  //当前文章id
    const likeNum = 0  //当前文章id
    const content = req.body.content || ''  //当前文章id
    const fromId = req.body.fromId || ''  //当前文章id
    console.log(req.body)
    const notlike = await Content([date,fromName,fromAvatar,likeNum,content,uid,fromId,ownerId]);
    // 返回给前端
    res.send({
        code: 200,
        msg:notlike
    })
})

details.post('/replycontent', async (req, res) => {
    //sql返回值
    console.log(res.body)
    const uid = parseInt(req.body.uid) || ''  //当前登录者uid
    const toId = req.body.toId || ''  //当前文章id
    const date = req.body.date || ''  //当前文章id
    const fromName = req.body.fromName || ''  //当前文章id
    const fromAvatar = req.body.fromAvatar || ''  //当前文章id
    const likeNum = 0  //当前文章id
    const content = req.body.content || ''  //当前文章id
    const fromId = req.body.fromId || ''  //当前文章id
    const commentId = parseInt(req.body.commentId) || ''  //当前文章id
    const toName = req.body.toName || ''  //当前文章id
    const buid = req.body.buid || ''  //当前文章id

    console.log(req.body)
    const notlike = await ReplyContent([date,fromName,fromAvatar,likeNum,content,uid,fromId,toId,commentId,toName,buid]);
    // 返回给前端
    res.send({
        code: 200,
        msg:notlike
    })
})

// 暴露
module.exports = details
