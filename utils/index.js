const ipv6Tov4 = (ip) => {
    if(ip.split(",").length > 0) ip = ip.split(",")[0];

    ip = ip.substr(ip.lastIndexOf(":") + 1, ip.length);
    return ip;
}

const getClientIp = (req) => {
    const ip = req.headers["x-forwarded-for"] || req.ip || req.socket.remoteAddress || "";
    return ipv6Tov4(ip);
}

module.exports = {
    getClientIp
}