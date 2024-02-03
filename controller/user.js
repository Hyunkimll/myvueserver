//引入sql方法
const {
    exec
} = require('../config/mysql')
//查询所有用户的sql
const userList = () => {
    const sql = `select * from people`
    return exec(sql).then(rows => {
        return rows || {}
    })
}
//暴露
module.exports = {
    userList
}
