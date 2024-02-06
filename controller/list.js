//引入sql方法
const {
    exec
} = require('../config/mysql')
//查询所有用户的sql
const List = (params,area_id) => {
    console.log(params,'11',area_id)
    var sql = '';
    if(area_id.length){
     sql = `SELECT a.ctitle,a.cparagraph,a.date,a.uid,a.img,a.lat,a.lng,b.adress,b.area_id,b.area_name FROM list as a LEFT JOIN area as b ON a.lng = b.lng AND a.lat = b.lat WHERE (a.uid=? OR ?="") and b.area_id IN (?) ORDER BY a.date DESC limit ?,?;`
    }else{
     sql = `SELECT a.ctitle,a.cparagraph,a.date,a.uid,a.img,a.lat,a.lng,b.adress,b.area_id,b.area_name FROM list as a LEFT JOIN area as b ON a.lng = b.lng AND a.lat = b.lat WHERE (a.uid=? OR ?="") ORDER BY a.date DESC limit ?,?;`
    }
    return exec(sql,params).then(rows => {
        return rows || {}
    });
    
}
const check = (params) => {
    const sql = `SELECT distinct b.area_id,b.area_name FROM list as a LEFT JOIN area as b ON a.lng = b.lng AND a.lat = b.lat WHERE (a.uid=? OR ?="");`
    return exec(sql,params).then(rows => {
        return rows || {}
    })
}
const Page = (params,area_id) => {
    var sql = '';
    if(area_id.length){
    sql = `SELECT count(*) as total FROM list as a LEFT JOIN area as b ON a.lng = b.lng AND a.lat = b.lat WHERE (a.uid=? OR ?="") and b.area_id IN (?) `
    }else{
    sql = `SELECT count(*) as total FROM list as a LEFT JOIN area as b ON a.lng = b.lng AND a.lat = b.lat WHERE (a.uid=? OR ?="") `
    }
    return exec(sql,params).then(rows => {
        console.log(rows[0].total)
        return rows[0].total || {}
    })
}
//暴露
module.exports = {
    List,check,Page
}
