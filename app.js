const Hapi = require('hapi');
require('env2')('./.env')
const config = require('./config');
const hapiAuthJWT2 = require('hapi-auth-jwt2');
const routesHelloHapi = require('./routes/hello-hapi');
const shopsHapi = require('./routes/shops');
const ordersHapi = require('./routes/orders');
const usersHapi = require('./routes/users.js')

// 引入自定义的hapi-swagger 插件配置
const pluginHapiSwragger = require('./plugins/hapi-swagger');

const pluginHapiPagination = require('./plugins/hapi-pagination');

const pluginHapiAuthJWT2 = require('./plugins/hapi-auth-jwt2');

const server = new Hapi.Server();

//配置服务器启动 host 与端口
server.connection({
    port: config.port,
    host: config.host,
});
const init = async () => {
    await server.register([
        // 为系统使用hapi-swagger
        ...pluginHapiSwragger,
        pluginHapiPagination,
        hapiAuthJWT2,
    ])
    pluginHapiAuthJWT2(server);
    server.route([
        // 创建一个简单的hello hapi 接口
        ...routesHelloHapi,
        ...shopsHapi,
        ...ordersHapi,
        ...usersHapi,
    ]);
    // 启动服务
    await server.start();
    console.log(`Server running at: ${server.info.uri}`)
}

init();
