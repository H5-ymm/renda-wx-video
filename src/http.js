import {
    wxToast
} from '@/util.js'
const baseUrl = 'https://a.rsd123.com/';
// const baseUrl = 'http://tiantianxsg.com:39888/'
const apiUrl = baseUrl + 'wx.php';
const http = (url, params, method) => {
    console.log(params)
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${apiUrl}${url}`, // 服务器url+参数中携带的接口具体地址
            data: params, // 请求参数
            header: {
                // 设置后端需要的常用的格式就好，特殊情况调用的时候单独设置
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: method || 'POST',
            success: function (res) {
                // 接口访问正常返回数据
                if (res.statusCode === 200) {
                    // 操作成功返回数据,原则上只针对服务器端返回成功的状态（如本例中为000000）
                    if (res.data.status.code === 200) {
                        resolve(res.data);
                    } else if (res.data.status.code === 1009 || res.data.status.code === 6001 ||
                        res.data.status.code === 6002 || res.data.status.code === 6006 ||
                        res.data.status.code === 6007 || res.data.status.code === 6010 ||
                        res.data.status.code === 6100 || res.data.status.code === 3058) {
                        // 需要特殊处理的接口，可以单独列出来返回数据
                        reject(res.data);
                    } else if (url === '/Wxresume/addResume') {
                        reject(res.data);
                    } else if (url === '/Login/is_autologin' && res.data.status.code === 6003) {
                        setTimeout(() => {
                            wx.redirectTo({
                                url: '/pages/login/login' // 页面 A
                            });
                        }, 300)
                    } else {
                        let remind = res.data.status.remind ? res.data.status.remind : '没有信息'
                        wxToast(remind)
                    }
                } else {
                    wxToast('请求失败')
                }
            },
            fail: function (error) {
                wxToast('网络失败')
                reject(error);
            }
        }).onHeadersReceived(function (res) {
        })
    });
};
const uploadFile = (tempFilePaths) => {
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url: `${apiUrl}/uploadimg/moreupload`,
            filePath: tempFilePaths[0],
            name: 'image',
            success: res => {
                if (res.data) {
                    resolve(JSON.parse(res.data));
                }
            },
            fail: error => {
                reject(error);
            }
        });
    });
};
module.exports = {
    $http: http,
    uploadFile: uploadFile
}
