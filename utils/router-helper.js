// 一个公共的分页入参校验配置：
const Joi = require('joi');
const paginationDefine = {
    limit: Joi.number().integer().min(1).default(10).description('每页条数'),
    page: Joi.number().integer().min(1).default(1).description('页码数'),
    pagination: Joi.boolean().default(true).description('是否开启分页， 默认为true')
}

const jwtHeaderDefine = {
    headers: Joi.object({
        authorization: Joi.string().required(),
    }).unknown(),
}

module.exports = { paginationDefine, jwtHeaderDefine }