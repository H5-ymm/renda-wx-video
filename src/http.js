import {
	wxToast
} from '@/util.js'
const baseUrl = 'http://www.ttxsg.com.cn:39009/';
// const baseUrl = 'https://d.rsd123.com/'
const apiUrl = baseUrl + 'wx.php';
const rendaUid = wx.getStorageSync('rendaUid');
let header = {
	'Content-Type': 'application/x-www-form-urlencoded'
}
console.log(rendaUid)
if (rendaUid) {
	header = JSON.parse(JSON.stringify(Object.assign(header, {'http-uid': rendaUid})))
} else {
	header = header
}
const http = (url, params, method) => {
	console.log(header)
	console.log(url)
	return new Promise((resolve, reject) => {
		wx.request({
			url: `${apiUrl}${url}`, // 服务器url+参数中携带的接口具体地址
			data: params, // 请求参数
			header: header,
			method: method || 'POST',
			success: function (res) {
				// 接口访问正常返回数据
				if (res.statusCode === 200) {
					// 操作成功返回数据,原则上只针对服务器端返回成功的状态（如本例中为000000）
					if (res.data.status.code === 200) {
							resolve(res.data);
					} else if (res.data.status.code === 4000 || res.data.status.code === 6100 ||  res.data.status.code === 888) {
							wxToast(res.data.status.remind)
							setTimeout(() => {
									wx.redirectTo({
										url: '/pages/login/welcome' // 页面 A
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
			url: `${apiUrl}/Constant/moreupload`,
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
const uploadFileVideo = (tempFilePaths) => {
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
}

module.exports = {
	$http: http,
	uploadFile: uploadFile,
	uploadFileVideo: uploadFileVideo
}