//引入sql方法
const {
    exec, getOne
} = require('../config/mysql');
const dayjs = require("dayjs");
const md5 = require("md5");
const { getClientIp } = require("../utils");
const { sign } = require("../sign");

//查询所有用户的sql
const List = (params,area_id,startTime) => {
    console.log(params,'11',area_id,startTime)
    var sql = '';
    if(area_id.length &&  startTime){
     sql = `SELECT a.id,a.ctitle,a.cparagraph,a.date,a.uid,a.img,a.lat,a.lng,b.adress,b.area_id,b.area_name FROM list as a LEFT JOIN area as b ON a.lng = b.lng AND a.lat = b.lat WHERE (a.uid=? OR ?="") and b.area_id IN (?) and a.date BETWEEN ? and ? ORDER BY a.date DESC limit ?,?;`
    }else if(area_id.length){
     sql = `SELECT a.id,a.ctitle,a.cparagraph,a.date,a.uid,a.img,a.lat,a.lng,b.adress,b.area_id,b.area_name FROM list as a LEFT JOIN area as b ON a.lng = b.lng AND a.lat = b.lat WHERE (a.uid=? OR ?="") and b.area_id IN (?) ORDER BY a.date DESC limit ?,?;`
    }else if(startTime){
     sql = `SELECT a.id,a.ctitle,a.cparagraph,a.date,a.uid,a.img,a.lat,a.lng,b.adress,b.area_id,b.area_name FROM list as a LEFT JOIN area as b ON a.lng = b.lng AND a.lat = b.lat WHERE (a.uid=? OR ?="") and a.date BETWEEN ? and ? ORDER BY a.date DESC limit ?,?;`
    }else{
     sql = `SELECT a.id,a.ctitle,a.cparagraph,a.date,a.uid,a.img,a.lat,a.lng,b.adress,b.area_id,b.area_name FROM list as a LEFT JOIN area as b ON a.lng = b.lng AND a.lat = b.lat WHERE (a.uid=? OR ?="") ORDER BY a.date DESC limit ?,?;`
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
const Page = (params,area_id,startTime) => {
    var sql = '';
    if(area_id.length &&  startTime){
    sql = `SELECT count(*) as total FROM list as a LEFT JOIN area as b ON a.lng = b.lng AND a.lat = b.lat WHERE (a.uid=? OR ?="") and b.area_id IN (?) and a.date BETWEEN ? and ? `
    }else if(area_id.length){
    sql = `SELECT count(*) as total FROM list as a LEFT JOIN area as b ON a.lng = b.lng AND a.lat = b.lat WHERE (a.uid=? OR ?="") and b.area_id IN (?)`
    }else if(startTime){
    sql = `SELECT count(*) as total FROM list as a LEFT JOIN area as b ON a.lng = b.lng AND a.lat = b.lat WHERE (a.uid=? OR ?="")  and a.date BETWEEN ? and ? `
    }else{
    sql = `SELECT count(*) as total FROM list as a LEFT JOIN area as b ON a.lng = b.lng AND a.lat = b.lat WHERE (a.uid=? OR ?="") `
    }
    return exec(sql,params).then(rows => {
        console.log(rows[0].total)
        return rows[0].total || {}
    })
}

const testTergister = async (req) => {
    try {
        const users = ["test1", "test2", "test3"];
        const sql = `select count(*) as count from user where login_name in (${users.map(user => '"' + user + '"').join(",")})`;
        const testUser = await exec(sql);
        if(testUser[0].count) return "已存在测试用户，无须插入";

        const pwd = md5(md5("mnbvcxz@123"));
        const ip = getClientIp(req);
        const time = dayjs().unix();
        for(let user of users) {
            const sql = `insert into user (login_name, register_time, login_ip, password) values ("${user}", ${time}, "${ip}", "${pwd}");`;
            await exec(sql);
        }
        return true;
    } catch(e) {
        console.log("insert user failed: ", e.message);
        return {code: 500, reason: e.message};
    }
}

const loginByUsername = async (req, options) => {
    try {
        const username = options.username && options.username.trim();
        const pwd = options.pwd && options.pwd.trim();
        const sql = `select * from user where login_name = ? or phone = ?`;
        const time = dayjs().unix(), ip = getClientIp(req);
        const params = [username, username];
        if(!username) throw new Error("缺少参数username");
        if(!pwd) throw new Error("缺少参数pwd");

        const user = await getOne(sql, params);
        if(!user) throw new Error("该用户不存在");
        if(md5(md5(pwd)) !== user.password) throw new Error("密码错误，请检查");

        // 登录成功
        const updateSql = `update user set login_ip = ?, login_time = ? where id = ?`;
        await exec(updateSql, [ip, time, user.id]); // 修改登陆地，登录时间

        return {
            user: user.login_name,
            tokens: sign({username: user.login_name})
        };
    } catch(e) {
        console.log("login failed: ", e.message);
        return {code: 500, reason: e.message};
    }
}

//暴露
module.exports = {
    List,check,Page, testTergister, loginByUsername
}
