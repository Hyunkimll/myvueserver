const jwt = require("jsonwebtoken");
const secretKey = "mnbvcxz@zxcvbnm@123456789@987654321";

// 生成token
const sign = (data = {}) => {
    return jwt.sign(data, secretKey, {
        expiresIn: "7d"
    });
}

// 验证 token
const verify = (req, res, next) => {
    const authorization = req.headers.authorization || req.body.token || req.query.token || "";
    let token = authorization;
    if(authorization.indexOf("Bearer") > -1) token = authorization.replace("Bearer ", "");

    jwt.verify(token, secretKey, (error, data) => {
        if(error) return res.status(401).send("Unauthorized");

        req.user = data;
        next();
    });
}

module.exports = {
    sign, verify
}