//引入sql方法
const {
    exec
} = require('../config/mysql')
//查询所有用户的sql
const List = () => {
    const sql = `SELECT a.ctitle,a.cparagraph,a.date,a.uid,a.img,a.lat,a.lng,b.adress,b.area_id,b.area_name FROM list as a LEFT JOIN area as b ON a.lng = b.lng AND a.lat = b.lat ORDER BY a.date DESC;`
    return exec(sql).then(rows => {
        return rows || {}
    })
}
//暴露
module.exports = {
    List
}
