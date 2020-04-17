// 入口文件 把reducers下的所有函数引入 并且通过combineReducers函数导出
import {
    combineReducers
} from '../../lib/redux.js'
import contant from './contant'
import user from './user'
export default combineReducers({
    contant,
    user
})
