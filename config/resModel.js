//返回成功信息
function success(msg, data) {
    if (!data) {
        data = ''
    }
    if (!msg) {
        msg = ''
    }
    let value = {
        code: 200,
        data,
        msg
    }
    return value
}
//返回失败信息
function fail(msg, data) {
    if (!data) {
        data = ''
    }
    if (!msg) {
        msg = ''
    }
    let value = {
        code: 100,
        data,
        msg
    }
    return value
}
//暴露
module.exports = {
    success,
    fail
}