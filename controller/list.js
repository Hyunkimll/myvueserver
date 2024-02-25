//引入sql方法
const {
    exec, getOne
} = require('../config/mysql');
const dayjs = require("dayjs");
const md5 = require("md5");
const { getClientIp } = require("../utils");
const { sign } = require("../sign");
const { emailSendCode } = require("../email");


const cacheOptions = {};

const getCacheKey = (key, active) => {
    return `vue-server_${key}_${active}`;
}

const generateCode = () => {
    const nums = [1,2,3,4,5,6,7,8,9,0];
    let str = "";
    for(let i = 0; i < 6; i++) {
        const index = Math.floor(Math.random() * nums.length);
        str += nums[index].toString();
    }
    return str;
}

// 校验验证码
const verifyCode = (code, key) => {
    const codeOptions = cacheOptions[key];
    const time = dayjs().unix();
    if(!codeOptions || codeOptions.code !== code) throw new Error("无效的验证码，请重新获取");
    if(codeOptions.loseEfficacyTime < time) throw new Error("验证码失效，请重新获取");
    return true;
}

const clearCode = (key) => {
    cacheOptions[key] = null;
}

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
        const sql = `select * from user where login_name = ? or phone = ? or email = ?`;
        const time = dayjs().unix(), ip = getClientIp(req);
        const params = [username, username, username];
        if(!username) throw new Error("缺少参数username");
        if(!pwd) throw new Error("缺少参数pwd");

        const user = await getOne(sql, params);
        console.log(user,md5(md5(pwd)),options)
        if(!user) throw new Error("该用户不存在");
        if(md5(md5(pwd)) !== user.password) throw new Error("密码错误，请检查");

        // 登录成功
        const updateSql = `update user set login_ip = ?, login_time = ? where id = ?`;
        await exec(updateSql, [ip, time, user.id]); // 修改登陆地，登录时间

        return {
            user: user.login_name,
            token: sign({username: user.login_name, id: user.id})
        };
    } catch(e) {
        console.log("login failed: ", e.message);
        return {code: 500, reason: e.message};
    }
}

// 邮箱发送验证码
const sendCode = async (email) => {
    try {
        const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
        email = email && email.trim();
        if(!email) throw new Error("缺少参数email");
        if(!reg.test(email)) throw new Error("邮箱格式不正确");

        const sql = `select * from user where email = ?`;
        const user = await getOne(sql, [email]);
        if(user) throw new Error("该邮箱已被使用，请更换");

        const key = getCacheKey(`email_${email}`, "register_code");
        const codeOptions = cacheOptions[key];
        const code = generateCode();
        const time = dayjs().unix();
        if(codeOptions && codeOptions.expire > time) throw new Error("一分钟之内不能重复获取验证码"); // 已经存在验证码并且已经过期
        
        // 发送邮件
        const result = await emailSendCode({
            to: email,
            subject: "注册用户",
            content: code
        });

        cacheOptions[key] = { code: code, expire: time + 60, loseEfficacyTime: time + 60 * 5 };
        return true;
    } catch(e) {
        console.log("send code failed: ", e.message);
        return {code: 500, reason: e.message};
    }
}

const registration = async (options, req) => {
    try {
        const username = options.username && options.username.trim();
        const pwd = options.pwd && options.pwd.trim();
        const code = options.code && options.code.trim();
        const email = options.email && options.email.trim();
        if(!username) throw new Error("缺少参数username");
        if(!pwd) throw new Error("缺少参数pwd");
        if(!code) throw new Error("缺少参数code");
        if(!email) throw new Error("缺少参数email");

        const time = dayjs().unix();
        const ip = getClientIp(req);
        const key = getCacheKey(`email_${email}`, "register_code");
        verifyCode(code, key);

        // 检查是否存在该用户
        const selectUserSql = `select * from user where login_name = ? or email = ?`;
        const user = await getOne(selectUserSql, [username, email]);
        if(user && user.login_name === username) throw new Error("已存在该用户名");
        if(user && user.email === email) throw new Error("该邮箱已使用");

        const sql = `insert into user (login_name, register_time, login_ip, password, email) values (?, ?, ?, ?, ?)`;
        await exec(sql, [username, time, ip, md5(md5(pwd)), email]); // 执行添加语句;

        clearCode(key);
        return true;
    } catch(e) {
        console.log("user registration failed: ", e.message);
        return {code: 500, reason: e.message}; 
    }
}


//暴露
module.exports = {
    List,check,Page, testTergister, loginByUsername, sendCode, registration
}
