import $moment from 'moment';
const manglingFormatCardNumber = (cardNumber) => {
    if (cardNumber && cardNumber.length > 8) {
        return `${cardNumber.substring(0, 4)} ${'*'
            .repeat(cardNumber.length - 8)
            .replace(/(.{4})/g, `
        $1 `)}${
            cardNumber.length % 4 ? ' ' : ''
            }${cardNumber.slice(-4)}`;
    }
    // eslint-disable-next-line semi
    return cardNumber
};
const validateIdCard = idCard => {
    var idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
    var flag = false;
    // 如果通过该验证，说明身份证格式正确，但准确性还需计算
    if (idcardReg.test(idCard)) {
        flag = true;
    } else {
        flag = false;
    }
    return flag;
};

const checkMobile = mobile => {
    let reg = /^1[3456789]\d{9}$/;
    let flag = false;
    if (!reg.test(mobile)) {
        flag = false;
    } else {
        flag = true;
    }
    return flag;
};
const getErrorTip = code => {
    let text = '联系客服人员：021-51991869，\n 微信：18621532378 QQ：529350865';
    let obj = {
        title: '',
        subTitle: ''
    }
    switch (code) {
        case 6001:
            obj.title = '您还没有注册哦';
            obj.subTitle = '亲！您还不是团队成员或企业，请前往 www.rsd123.com 进行注册申请，\n或' + text;
            break;
        case 6002:
            obj.title = '仅允许团队成员查看';
            obj.subTitle = text;
            break;
        case 6006:
            obj.title = '账号审核中需要1-2工作日';
            obj.subTitle = text;
            break;
        case 6010:
            obj.title = '账号审核中需要1-2工作日';
            obj.subTitle = text;
            break;
        case 6007:
            obj.title = '您的团队审核未通过哦';
            obj.subTitle = text;
            break;
        case 6008:
            obj.title = '团队信息未完善';
            obj.subTitle = '亲！您的团队信息未完善，请前往 www.rsd123.com 进行完善，\n或' + text;
            break;
        case 1009:
            obj.title = '您的团队账号被锁定';
            obj.subTitle = text;
            break;
        default:
            obj = {
                title: '',
                subTitle: ''
            };
    }
    return obj;
};
const getImgUrl = imgUrl => {
    // const baseUrl = 'https://a.rsd123.com/'
    const baseUrl = 'http://www.ttxsg.com.cn:39009/'
    return baseUrl + imgUrl;
};
const compressImg = (photoSrc, ratio = 2) => {
    let obj = {
        url: '',
        cWidth: 0,
        cHeight: ''
    }
    return new Promise((resolve, reject) => {
        wx.getImageInfo({
            src: photoSrc,
            success (res) {
                let canvasWidth = res.width // 图片原始长宽
                let canvasHeight = res.height
                canvasWidth = 300
                canvasHeight = 200
                obj.cWidth = canvasWidth + 100
                obj.cHeight = canvasHeight + 100
                // ----------绘制图形并取出图片路径--------------
                var ctx = wx.createCanvasContext('canvas')
                ctx.drawImage(res.path, 0, 0, canvasWidth, canvasHeight)
                ctx.draw(
                    false,
                    setTimeout(() => {
                        wx.canvasToTempFilePath({
                            canvasId: 'canvas',
                            destWidth: canvasWidth,
                            destHeight: canvasHeight,
                            success: function (res) {
                                console.log(res.tempFilePath)
                                obj.url = res.tempFilePath
                                resolve(obj)
                            },
                            fail: function (res) {
                                console.log(res.errMsg)
                            }
                        },
                            this
                        )
                    }, 100)
                )
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })
    })
}
const wxToast = title => {
    return wx.showToast({
        title: title,
        icon: 'none',
        duration: 2000
    })
}
const wxNavigateTo = url => {
    setTimeout(() => {
        wx.navigateTo({
            url: url // 页面 A
        })
    }, 300)
}
const wxRedirectTo = url => {
    setTimeout(() => {
        wx.redirectTo({
            url: url // 页面 A
        })
    }, 300)
}
const wxReLaunch = url => {
    setTimeout(() => {
        wx.reLaunch({
            url: url // 页面 A
        })
    }, 300)
}
const getArray = obj => {
    let arr = []
    for (let key in obj) {
        arr.push(obj[key])
    }
    return arr
}
const getKeyValue = obj => {
    for (let key in obj) {
        if (key === 'job_array') {
            obj[key] = getArray(obj[key])
        }
    }
    return obj
}
const weekList = () => {
    let arr = []
    for (let i = 1; i < 8; i++) {
        arr.push(replaceWeek(i))
    }
    return arr
}
const replaceWeek = (number) => {
    let text = ''
    switch (number) {
        case 1:
            text = '周一'
            break;
        case 2:
            text = '周二'
            break;
        case 3:
            text = '周三'
            break;
        case 4:
            text = '周四'
            break;
        case 5:
            text = '周五'
            break;
        case 6:
            text = '周六'
            break;
        case 7:
            text = '周日'
            break;
        default:
            text = ''
    }
    return text
}
const ageList = () => {
    let arr = []
    for (let i = 16; i < 66; i++) {
        arr.push(i)
    }
    return arr
}
const rewardTypeText = () => {
    let text = ''
    switch (number) {
        case 1:
            text = '时'
            break;
        case 2:
            text = '日'
            break;
        case 3:
            text = '月'
            break;
        default:
            text = ''
    }
    return '元/人/' + text
}
const wxShowModal = (title, content, confirmText) => {
    return new Promise((resove, rejcet) => {
        wx.showModal({
            title: title || '操作提示',
            content: content,
            confirmText: confirmText || '确定',
            cancelColor: '#666666',
            confirmColor: '#1890FF',
            success (res) {
                if (res.confirm) {
                    resove()
                } else if (res.cancel) {
                    rejcet()
                }
            }
        })
    })
}
const getList = (list, key, formatType) => {
    let type = formatType || 'YYYY-MM-DD'
    return list.map(item => {
        let flag
        let reg = /^[0-9]+.?[0-9]*$/
        if (item[key] && reg.test(item[key])) {
            flag = true
        }
        item[key] = flag ? $moment.unix(item[key]).format(type) : $moment(item[key]).format(type)
        return item
    })
}
module.exports = {
    manglingFormatCardNumber: manglingFormatCardNumber,
    validateIdCard: validateIdCard,
    checkMobile: checkMobile,
    getErrorTip: getErrorTip,
    getImgUrl: getImgUrl,
    wxToast: wxToast,
    compressImg: compressImg,
    wxNavigateTo: wxNavigateTo,
    wxRedirectTo: wxRedirectTo,
    wxReLaunch: wxReLaunch,
    getArray: getArray,
    getKeyValue: getKeyValue,
    weekList: weekList,
    ageList: ageList,
    rewardTypeText: rewardTypeText,
    wxShowModal: wxShowModal,
    getList: getList
};
