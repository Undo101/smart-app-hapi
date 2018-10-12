const config = require('../config');

const validate = (decoded, request, callback) => {
    let error;
    /*
    接口 POST /users/createJWT 中的 jwt 签发规则

    const payload = {
      userId: jwtInfo.userId,
      exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60,
    };
    return JWT.sign(payload, process.env.JWT_SECRET);
  */

    // decoded 为JWT payload被解码后的数据
    const { userId } = decoded;

    if (!userId) {
        return callback(error, false, userId);
    }

    const credentials = {
        userId,
    };

    // 在路由接口的handler通过 request.auth.credentials 获取jwt decoded 的值
    return callback(error, true, credentials);
}

module.exports = (server) => {
    server.auth.strategy('jwt', 'jwt', {
        // 需要自行在config/index.js 中添加jwtSecret 的配置
        key: config.jwtSecret,
        validateFunc: validate,
    });
    server.auth.default('jwt');
}