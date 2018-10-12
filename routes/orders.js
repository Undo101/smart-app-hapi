const { jwtHeaderDefine } = require('../utils/router-helper');
const GROUP_NAME = 'orders';

module.exports = [
    {
        method: 'POST',
        path: `/${GROUP_NAME}`,
        handler: async (request, reply) => {
            // transaction是由Sequelize提供来实现事务相关功能
            // 而事务是指数据库中单个逻辑所包含的一系列数据操作，要么全部执行，要么全部不执行，
            // 以免在创建订单之后中途出现商品记录插入失败，该订单记录的创建不完整行为，而orders表不完整数据的存在。
            await models.sequelize.transaction((t) => {
                const result = models.orders.create(
                    { user_id: request.auth.credentials.userId },
                    { transaction: t },
                ).then((order) => {
                    const goodsList = [];
                    request.payload.goodsList.forEach((item) => {
                        goodsList.push(models.order_goods.create({
                            order_id: order.dataValues.id,
                            goods_id: item.goods_id,
                            single_price: item.single_price,
                            count: item.count
                        }))
                    })
                    return Promise.all(goodsList);
                })
                return result;
            }).then(() => {
                // 事务被提交
            })
            reply();
        },
        config: {
            tags: ['api', GROUP_NAME],
            description: '创建订单',
            validate: {
                payload: {
                    goodsList: Joi.array().items(
                        Joi.object().keys({
                            goods_id: Joi.number().integer(),
                            count: Joi.number().integer(),
                        }),
                    ),
                },
                ...jwtHeaderDefine,
            },
        },
    },
    {
        method: 'POST',
        path: `/${GROUP_NAME}/orderId/pay`,
        handler: async (request, reply) =>{
            reply();
        },
        config: {
            tags: ['api', GROUP_NAME],
            description: '支付某条订单',
        }
    }
]