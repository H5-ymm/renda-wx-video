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
        $http('/Login/is_autologin', data).then(res => {
            wx.setStorageSync('rendaUserType', res.data.usertype)
            wx.setStorageSync('rendaUid', res.data.id)
            resolve(res.data);
        }).catch(error => {
            reject(error.status)
        })
    })
})
