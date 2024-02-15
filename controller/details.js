//引入sql方法
const {
    exec
} = require('../config/mysql')
//查询所有唯一id的详情的sql
const Basic = (params) => {
    const sql = `SELECT a.id,a.ctitle,a.cparagraph,a.date,a.uid,a.img,a.lat,a.lng,b.adress,b.area_id,b.area_name FROM list as a LEFT JOIN area as b ON a.lng = b.lng AND a.lat = b.lat WHERE (uid=? OR ?="") and a.id = ?;`
    return exec(sql,params).then(rows => {
        return rows || {}
    })
}
const Diary = (params) => {
    const sql = `SELECT * FROM diary WHERE (uid=? OR ?="") and ownerId = ? ORDER BY data DESC;`
    return exec(sql,params).then(rows => {
        return rows || {}
    })
}
const Photograph = (params) => {
    const sql = `SELECT * FROM photograph WHERE (uid=? OR ?="") and ownerId = ?;`
    return exec(sql,params).then(rows => {
        return rows || {}
    })
}
const Photoalbum = (params) => {
    const sql = `SELECT * FROM photoalbum WHERE (uid=? OR ?="") and ownerId = ?;`
    return exec(sql,params).then(rows => {
        return rows || {}
    })
}
const Comment = (params) => {
    const sql = `SELECT * FROM comment WHERE (uid=? OR ?="") and ownerId = ? ORDER BY date DESC;`
    return exec(sql,params).then(rows => {
        return rows || {}
    })
}
const Reply = (params) => {
    const sql = `SELECT * FROM reply WHERE (uid=? OR ?="") and commentId = ? ORDER BY date DESC;`
    return exec(sql,params).then(rows => {
        return rows || {}
    })
}
const Likenum = (params) => {
    const sql = `UPDATE comment SET likeNum = likeNum+1 WHERE (uid=? OR ?="") and ownerId = ? and fromId = ?;`
    return exec(sql,params).then(rows => {
        return rows || {}
    })
}
const Notlikenum = (params) => {
    const sql = `UPDATE comment SET likeNum = likeNum-1 WHERE (uid=? OR ?="") and ownerId = ? and fromId = ?;`
    return exec(sql,params).then(rows => {
        return rows || {}
    })
}
const Content = (params) => {
    const sql = `INSERT INTO comment(date,fromName,fromAvatar,likeNum,content,uid,fromId,ownerId) VALUES (?,?,?,?,?,?,?,?);`
    return exec(sql,params).then(rows => {
        return rows || {}
    })
}

const ReplyContent = (params) => {
    const sql = `INSERT INTO reply(date,fromName,fromAvatar,likeNum,content,uid,fromId,toId,commentId,toName,buid) VALUES (?,?,?,?,?,?,?,?,?,?,?);`
    return exec(sql,params).then(rows => {
        return rows || {}
    })
}
//暴露
module.exports = {
    Basic,Diary,Photograph,Photoalbum,Comment,Reply,Likenum,Notlikenum,Content,ReplyContent
}
