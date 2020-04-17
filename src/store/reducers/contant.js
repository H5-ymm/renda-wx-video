// 这里把types里的函数名引入 注意相对路径
import {
    handleActions
} from 'redux-actions';
import {
    GETALLCONTANT
} from '../types/contant';
// 通过handleActions函数导出
// 这里函数接收2个函数 第一个函数为触发方法修改状态,第二个函数为状态里的默认值
const initialState = {
    list: {}
};
export default handleActions({
    [GETALLCONTANT](state, action) {
        return {
            ...state,
            list: action.payload
        };
    }
}, initialState.list);
