//返回成功信息
function success(msg, data,page) {
    if (!data) {
        data = ''
    }
    if (!msg) {
        msg = ''
    }
    if (!page) {
        page = null
    }
    let value = {
        code: 200,
        data,
        page,
        msg
    }
    return value
}
//返回失败信息
function fail(msg, data,page) {
    if (!data) {
        data = ''
    }
    if (!msg) {
        msg = ''
    }
    if (!page) {
        page = null
    }
    let value = {
        code: 100,
        data,
        page,
        msg
    }
    return value
}
//暴露
module.exports = {
    success,
    fail
}
