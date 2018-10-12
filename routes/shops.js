const Joi = require('joi');
const GROUP_NAME = 'shops';
const { paginationDefine } = require('../utils/router-helper');
const models = require('../models')

module.exports = [
    {
        method: 'GET',
        path: `/${GROUP_NAME}`,
        handler: async (request, reply) => {
            // 通过 await 来异步查取数据 并且给出希望暴露的字段
            const { rows: result, count: totalCount } = await models.shops.findAndCountAll({
                attributes: [
                    'id', 'name'
                ],
                limit: request.query.limit,
                offset: (request.query.page - 1) * request.query.limit,
            })
            reply({ result, totalCount });
        },
        config: {
            tags: ['api', GROUP_NAME],
            auth: false,
            description: '获取店铺列表',
            validate: {
                query: {
                    ...paginationDefine
                }
            },
        },
    },
    {
        method: 'GET',
        path: `/${GROUP_NAME}/{shopId}/goods`,
        handler: async (request, reply) => {
            // 增加带有 where 的查询条件
            const { rows: results, count: totalCount } = await models.goods.findAndCountAll({
                // 基于 shop_id 的条件查询
                where: {
                    shop_id: request.params.shopId
                },
                attributes: [
                    'id',
                    'name',
                ],
                limit: request.query.limit,
                offset: (request.query.page - 1) * request.query.limit,
            })
            reply();
        },
        config: {
            tags: ['api', GROUP_NAME],
            description: '获取店铺的商品列表',
        },
    },
];
