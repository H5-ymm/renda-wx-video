import devConf from './dev';
import prodConf from './prod';
import {
    merge
} from 'lodash';

let config = {}; // 配置文件对象，它将会被devConf或prodConf替换

let env = __NODE_ENV__; // 当前的项目环境
console.log(__NODE_ENV__)
if (env === 'dev') {
    merge(config, devConf);
} else if (env === 'production') {
    merge(config, prodConf);
}

export default config;
