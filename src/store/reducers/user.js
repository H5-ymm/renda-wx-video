import {
    handleActions
} from 'redux-actions';
import {
    GETALLUSER
} from '../types/user';
// 通过handleActions函数导出
// 这里函数接收2个函数 第一个函数为触发方法修改状态,第二个函数为状态里的默认值
const loginUser = {}
export default handleActions({
    [GETALLUSER](state, action) {
        return {
            ...state,
            loginUser: action.payload
        };
    }
}, loginUser);
