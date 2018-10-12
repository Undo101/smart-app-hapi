// 是 Node.js 生态里用于签发与校验 JWT 的流行插件，我们借助该插件来完成 JWT 字符串的生成签发。
const Joi = require('joi');
const JWT = require('jsonwebtoken');
const config = require('../config');
const axios = require('axios');
const models = require('../models');
const GROUP_NAME = 'users';
const decryptData = require('../utils/decrypted-data');

module.exports = [
    {
        method: 'POST',
        path: `/${GROUP_NAME}/createJWT`,
        handler: async (request, reply) => {
            const generateJWT = (jwtInfo) => {
                const payload = {
                    userId: jwtInfo.userId,
                    exp: Math.floor(new Date().getTime() / 1000) +  7 * 24 * 60 * 60,
                };
                return JWT.sign(payload, config.jwtSecret);
            };
            reply(generateJWT({
                userId: 1,
            }));
        },
        config: {
            tags: ['api', GROUP_NAME],
            description: '用于测试用户的JWT签发',
            auth: false, // 约定此接口不参与JWT的用户签证，会结合下面的hapi-auth-jwt来使用。
        }
    },
    {
        method: 'POST',
        path: `/${GROUP_NAME}/wxLogin`,
        handler: async (req, reply) => {
            const appid = config.wxAppid;
            const secret = config.wxSecret;
            const { code, encryptedData, iv } = req.payload;

            const response = await axios({
                url: 'https://api.weixin.qq.com/sns/jscode2session',
                method: 'GET',
                params: {
                    appid,
                    secret,
                    js_code: code,
                    grant_type: 'authorization_code',
                }
            });
            const { openid, session_key: sessionKey } = response.data;

            // 基于 openid查找或创建一个用户
            const user = await models.users.findOrCreate({
                where: { open_id: openid },
            })

            // decrypt 解码用户信息
            const userInfo = decryptData(encryptedData, iv, sessionKey, appid);
            await models.users.update({
                nick_name: userInfo.nickName,
                gender: userInfo.gender,
                avatar_url: userInfo.avatarUrl,
                open_id: openid,
                session_key: sessionKey,
            }, {
                where: { open_id: openid}
            });

            // 签发 JWT
            const generateJWT = (jwtInfo) => {
                const payload = {
                    userId: jwtInfo.userId,
                    exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60,
                };
                return JWT.sign(payload, config.jwtSecret);
            };
            reply(generateJWT({
                userId: user[0].id,
            }));
        },
        config: {
            auth: false,
            tags: ['api', GROUP_NAME],
            validate: {
                payload: {
                    code: Joi.string().required().description('微信用户登录的临时code'),
                    encryptedData: Joi.string().required().description('微信用户信息encryotedData'),
                    iv: Joi.string().required().description('微信用户信息iv')
                },
            },
        },
    },
]
