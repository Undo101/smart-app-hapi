// plugins/hapi-swagger.js 基础插件配置
// 接口契约与入参校验 —— 使用 Swagger & Joi
// Swagger 是一种与语言无关的接口描述，目标是为 REST APIs 定义一个标准的，
// 帮助我们在看不到具体源码的情况下能发现和理解各种服务的功能。
// Joi 是一种验证模块
const inert = require('inert');
const vision = require('vision');
const package = require('package');
const hapiSwagger = require('hapi-swagger');

module.exports = [
    inert,
    vision,
    {
        register: hapiSwagger,
        options: {
            info: {
                title: '文档接口',
                version: package.version,
            },
            grouping: 'tags',
            tags: [
                { name: 'tests', description: '测试相关'},
            ]
        }
    }
]
