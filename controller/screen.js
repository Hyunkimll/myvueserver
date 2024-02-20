//引入sql方法
const {
    exec
} = require('../config/mysql')
//查询所有唯一id的详情的sql
const AdressCount = (params) => {
    const sql = `SELECT b.adress,COUNT(*) as adress_count FROM list as a LEFT JOIN area as b ON a.lng = b.lng AND a.lat = b.lat GROUP BY b.adress ORDER BY adress_count Desc`
    return exec(sql,params).then(rows => {
        return rows || {}
    })
}
const AdressTime = (params) => {
    const sql = `SELECT b.adress,DATE_FORMAT(a.date,'%m') as monthA,COUNT(*) as adress_count FROM list as a LEFT JOIN area as b ON a.lng = b.lng AND a.lat = b.lat WHERE a.date BETWEEN ? and ?  GROUP BY b.adress,DATE_FORMAT(a.date,'%m') ORDER BY adress_count Asc`
    return exec(sql,params).then(rows => {
        return rows || {}
    })
}
//暴露
module.exports = {
    AdressCount,AdressTime
}
