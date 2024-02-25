
const nodemailer = require("nodemailer");

const html = (code) => `<h1>您正在注册用户，你的验证码是： ${code}</h1>`;

const getConfig = () => {
  return {
    "host": 'smtp.qq.com',
    "secureConnection": true, // use SSL
    "port": 587,
    "service": "qq",
    "secure": true,
    "auth": {
      "user": "2497999352@qq.com",
      "pass": "svgovtkawejeecig"
    }
  }
}

const emailServer = nodemailer.createTransport(getConfig());

const emailSendCode = async (options) => {
  return new Promise((resolve, reject) => {
    const config = getConfig();
    console.log(config.auth.user)
    emailServer.sendMail({
      from: `"晴天" ${config.auth.user}`,
      to: options.to,
      subject: options.subject,
      text: "",
      html: html(options.content)
    }, (err, info) => {
      if(err) return reject(err);
      resolve(info);
    });
  });
}

module.exports = { emailSendCode };