const path = require('path');
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production'
}
let prod = process.env.NODE_ENV === 'production';
console.log(process.env.NODE_ENV + '当前环境')

function resolve (dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    eslint: true,
    wpyExt: '.wpy',
    build: {
        web: {
            apis: ['showToast', 'showActionSheet', 'showModal'],
            components: ['navigator', 'button', 'icon', 'progress', 'slider', 'radio', 'radio-group', 'checkbox', 'checkbox-group', 'switch'],
            htmlTemplate: path.join('src', 'index.template.html'),
            htmlOutput: path.join('web', 'index.html'),
            jsOutput: path.join('web', 'index.js')
        }
    },
    resolve: {
        alias: {
            '@': resolve('src')
        },
        aliasFields: ['wepy', 'weapp'],
        modules: ['node_modules']
    },
    appConfig: {
        baseUrl: process.env.NODE_ENV === 'production' ? 'https://a.rsd123.com/' : 'http://tiantianxsg.com:39888/',
        noPromiseAPI: ['createSelectorQuery']
    },
    compilers: {
        less: {},
        babel: {
            sourceMap: true,
            presets: [
                'es2015',
                'stage-1',
                'env'
            ],
            plugins: [
                'transform-decorators-legacy',
                'transform-export-extensions',
                'syntax-export-extensions',
                'transform-class-properties',
                'transform-object-rest-spread',
                'transform-node-env-inline',
                ['global-define', {
                    __NODE_ENV__: process.env.NODE_ENV, // 规定全局变量
                    __VERSION__: '1.0.0', // 版本号
                    __TITLE__: 'global-define' // 说明
                }]
            ]
        }
    },
    loaders: [{
        test: /.js$/,
        loader: 'babel-loader'
    }]
};
if (prod) {
    delete module.exports.compilers.babel.sourcesMap;
    // 压缩less
    module.exports.compilers['less'] = {
        compress: true
    }
    // 压缩js
    module.exports.plugins = {
        uglifyjs: {
            filter: /\.js$/,
            config: {}
        },
        imagemin: {
            filter: /\.(jpg|png|jpge)$/,
            config: {
                jpg: {
                    quality: 80
                },
                png: {
                    quality: 80
                }
            }
        }
    }
}
