"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var o=0;o<t.length;o++){var a=t[o];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,o,a){return o&&e(t.prototype,o),a&&e(t,a),t}}(),_wepy=require("./npm/wepy/lib/wepy.js"),_wepy2=_interopRequireDefault(_wepy),_moment=require("./npm/moment/moment.js"),_moment2=_interopRequireDefault(_moment);require("./utils.js"),require("./npm/lodash/lodash.js"),require("./npm/wepy-async-function/index.js");var _wepyRedux=require("./npm/wepy-redux/lib/index.js"),_store=require("./store/index.js"),_store2=_interopRequireDefault(_store),_http=require("./http.js");_moment2.default.locale("zh-cn");var store=(0,_store2.default)();(0,_wepyRedux.setStore)(store);var _default=function(e){function t(){_classCallCheck(this,t);var e=_possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return e.config={pages:["pages/home/index","pages/message/index","pages/my/index","pages/home/hall","pages/my/resume","pages/my/deliveryRecord","pages/my/resumeList","pages/my/editJob","pages/my/jobForm","pages/my/jobManage","pages/home/collect","pages/my/companyForm","pages/message/dialogBox","pages/message/personalDialogBox","pages/my/editWorkExperience","pages/my/editEducation","pages/my/editResume","pages/home/jobDetail","pages/home/companyDetail","pages/home/jobView","pages/login/welcome","pages/login/login"],window:{navigationBarTextStyle:"white",navigationBarTitleText:"人事达",navigationBarBackgroundColor:"#1890FF",backgroundColor:"#1890FF"},tabBar:{color:"#919398",selectedColor:"#1890FF",list:[{pagePath:"pages/home/index",text:"首页",iconPath:"/images/nav/home.png",selectedIconPath:"/images/nav/home-active.png"},{pagePath:"pages/message/index",text:"消息",iconPath:"/images/nav/message.png",selectedIconPath:"/images/nav/message-active.png"},{pagePath:"pages/my/index",text:"我的",iconPath:"/images/nav/my.png",selectedIconPath:"/images/nav/my-active.png"}]},networkTimeout:{request:1e4,connectSocket:1e4,uploadFile:1e4,downloadFile:1e4}},e.globalData={headerHeight:0,statusBarHeight:0,userInfo:null,uid:"",openId:"",wxInfo:"",sessionKey:"",rendaUserType:"",list:[{pagePath:"/pages/home/index",text:"简历列表",selected:!0,iconPath:"../images/list.png",selectedIconPath:"../images/list-active.png"},{pagePath:"/pages/my/index",text:"我的",selected:!1,iconPath:"../images/my.png",selectedIconPath:"../images/my-active.png"}],tabBar:{color:"#999999",selectedColor:"#1890FF",borderStyle:"white",list:[]}},e.use("promisify"),e.use("requestfix"),wx.getStorageSync("wxInfo")||wx.getUserInfo({success:function(t){var o={avatarUrl:t.userInfo.avatarUrl,nickName:t.userInfo.nickName};e.globalData.wxInfo=o,wx.setStorageSync("wxInfo",JSON.stringify(o))}}),e}return _inherits(t,e),_createClass(t,[{key:"onLaunch",value:function(e){this.removeData(),this.autoUpdate(),this.isCheckSession(),wx.loadFontFace({family:"PingFangSC-Medium",source:'url("https://www.your-server.com/PingFangSC-Medium.ttf")',success:function(){console.log("load font success")}})}},{key:"removeData",value:function(){wx.removeStorageSync("preForm"),wx.removeStorageSync("resumeType"),wx.removeStorageSync("sendAuthCode")}},{key:"onShow",value:function(e){}},{key:"autoUpdate",value:function(){var e=this;if(wx.canIUse("getUpdateManager")){var t=wx.getUpdateManager();t.onCheckForUpdate(function(o){o.hasUpdate&&wx.showModal({title:"更新提示",content:"检测到新版本，是否下载新版本并重启小程序？",success:function(o){o.confirm?e.downLoadAndUpdate(t):o.cancel&&wx.showModal({title:"温馨提示~",content:"本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~",showCancel:!1,confirmText:"确定更新",success:function(o){o.confirm&&e.downLoadAndUpdate(t)}})}})})}else wx.showModal({title:"提示",content:"当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"})}},{key:"downLoadAndUpdate",value:function(e){wx.showLoading(),e.onUpdateReady(function(){wx.hideLoading(),e.applyUpdate()}),e.onUpdateFailed(function(){wx.showModal({title:"已经有新版本了哟~",content:"新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"})})}}]),_createClass(t,[{key:"tabBarClickHandle",value:function(e,t){var o=this.globalData.tabBar.list;return o.forEach(function(t,a){e===a?o[e].selected=!0:o[a].selected=!1}),t.$apply(),this.globalData.tabBar}},{key:"isCheckSession",value:function(){var e=this;wx.checkSession({success:function(){console.log("没有过期")},fail:function(){e.getOpenId()}})}},{key:"getOpenId",value:function(){var e=this;return wx.login({success:function(t){t.code?(0,_http.$http)("/Login/getopenid",{code:t.code}).then(function(t){var o=JSON.parse(t.data);e.globalData.openid=o.openid,e.globalData.sessionKey=o.session_key,wx.setStorageSync("session_key",o.session_key),wx.setStorageSync("rendaOpenId",o.openid)}).catch(function(e){console.log(e)}):(console.log(1),console.log("获取失败！"+t.errMsg))}}),e.globalData.openid}}]),t}(_wepy2.default.app);App(require("./npm/wepy/lib/wepy.js").default.$createApp(_default,{baseUrl:"https://a.rsd123.com/",noPromiseAPI:["createSelectorQuery"]}));