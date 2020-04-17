import {
    GETALLUSER
} from '../types/user';
import {
    createAction
} from 'redux-actions';
import {
    $http
} from '@/http.js'
export const getAllUser = createAction(GETALLUSER, (data) => {
    return new Promise((resolve, reject) => {
        $http('/login/is_autologin', data).then(res => {
            wx.setStorageSync('phone', res.data.phone)
            resolve(res.data);
        }).catch(error => {
            reject(error.status)
        })
    })
})
