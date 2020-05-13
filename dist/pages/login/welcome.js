"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),_wepy=require("./../../npm/wepy/lib/wepy.js"),_wepy2=_interopRequireDefault(_wepy),_actionSheet=require("./../../components/actionSheet.js"),_actionSheet2=_interopRequireDefault(_actionSheet),_http=require("./../../http.js"),_util=require("./../../util.js"),_wepyRedux=require("./../../npm/wepy-redux/lib/index.js"),_contant=require("./../../store/actions/contant.js"),_user=require("./../../store/types/user.js"),store=(0,_wepyRedux.getStore)(),Welcome=function(e){function t(){var e,n,i,o;_classCallCheck(this,t);for(var s=arguments.length,r=Array(s),a=0;a<s;a++)r[a]=arguments[a];return n=i=_possibleConstructorReturn(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(r))),i.$repeat={},i.$props={actionLoginSheet:{"xmlns:v-bind":"","v-bind:isScaleModal.sync":"isLoginModal",text:"明确身份后提供更准确的服务","v-bind:title.sync":"title",okText:"完善信息",bindselectUser:"selectUser",bindhandleClose:"handleClose"}},i.$events={},i.components={actionLoginSheet:_actionSheet2.default},i.data={userInfo:null,modalHeight:640,checked:!1,authorize:!1,isRead:!1,isLoginModal:!0,openid:"",uid:"",isLoginOut:!1,isHandleBtn:!1,title:"",text:"明确身份后提供更准确的服务",usertype:0,phoneNumber:""},i.events={handleClose:function(){i.isLoginModal=!i.isLoginModal,i.$apply(),console.log(""==i.title),""==i.title?(console.log("取消"),(0,_util.wxReLaunch)("/pages/home/index?is_perfect=0")):(0,_util.wxToast)("请选择身份")},selectUser:function(e){i.usertype=e,i.title="",i.$apply(),i.saveUserType()},handleOk:function(e){1==i.usertype?(0,_util.wxRedirectTo)("/pages/my/companyForm"):(0,_util.wxRedirectTo)("/pages/my/resume")}},i.methods={checkedRule:function(e){this.checked=!this.checked,this.checked?(0,_util.wxReLaunch)("/pages/login/rule"):this.isRead=!1,this.$apply()},getUserInfo:function(e){var t=this;if(this.isRead)if(this.userInfo=e.detail.userInfo,this.userInfo){var n={avatarUrl:this.userInfo.avatarUrl,nickName:this.userInfo.nickName};this.$parent.globalData.wxInfo=n,wx.setStorageSync("wxInfo",JSON.stringify(n)),this.authorize=!0,this.$apply(),2==e.target.dataset.id&&(0,_util.wxReLaunch)("/pages/login/login")}else wx.showModal({title:"警告",content:"您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!",showCancel:!1,confirmText:"返回授权",confirmColor:"#1890FF",success:function(e){e.confirm&&(t.authorize=!1,t.$apply())}})},bindgetphonenumber:function(e){if(e.detail.encryptedData){var t={encryptedData:e.detail.encryptedData,iv:e.detail.iv,sessionKey:wx.getStorageSync("session_key")};this.getWxPhone(t)}else wx.showModal({title:"警告",content:"您拒绝授权获取微信号，将无法进入小程序，请授权之后再进入!!!",showCancel:!1,confirmColor:"#1890FF",confirmText:"返回授权",success:function(e){e.confirm}})}},o=n,_possibleConstructorReturn(i,o)}return _inherits(t,e),_createClass(t,[{key:"onLoad",value:function(e){var t=this;e&&e.query?(this.checked=e.query,this.isRead=!0):(this.isRead=!1,this.isLoginOut=!1),this.$apply(),wx.getSetting({success:function(e){e.authSetting["scope.userInfo"]?(t.authorize=!0,t.userInfo=wx.getStorageSync("wxInfo")?JSON.parse(wx.getStorageSync("wxInfo")):{}):t.authorize=!1,t.$apply()}})}},{key:"onShow",value:function(){wx.getStorageSync("rendaOpenId")?this.openid=wx.getStorageSync("rendaOpenId"):this.openid=this.$parent.getOpenId(),console.log(this.openid),this.isRead||(this.checked=!1),this.$apply()}},{key:"saveUserType",value:function(){var e=this,t={uid:this.uid,type:this.usertype,img:this.userInfo.avatarUrl,nickname:this.userInfo.nickName,tel:this.phoneNumber};(0,_http.$http)("/login/saveusertype",t).then(function(n){n.data&&(t.head_img=e.userInfo.avatarUrl,wx.setStorageSync("userInfo",JSON.stringify(t)),e.title="",1==e.usertype?e.text="企业信息不完整，请前往完善":e.text="个人简历不完整，请前往完善",e.$apply(),wx.setStorageSync("rendaUserType",e.usertype))})}},{key:"checkRouterView",value:function(e){e&&e.id&&(this.$parent.globalData.uid=e.id,this.uid=e.id,wx.setStorageSync("rendaUid",e.id),this.viewRouter(e),store.dispatch((0,_contant.getAllContant)()))}},{key:"viewRouter",value:function(e){console.log(e.usertype),e.usertype?(wx.setStorageSync("rendaUserType",e.usertype),1==e.is_perfect?(0,_util.wxReLaunch)("/pages/home/index"):(this.title="",this.isLoginModal=!this.isLoginModal)):(this.title="选择身份",this.isLoginModal=!this.isLoginModal),this.$apply()}},{key:"getWxPhone",value:function(e){var t=this;(0,_http.$http)("/Login/decryptData",e).then(function(e){e&&e.data&&(t.phoneNumber=e.data.phoneNumber,wx.setStorageSync("wxphoneNumber",e.data.phoneNumber),t.getWxPhoneLogin(e.data.phoneNumber))})}},{key:"getWxPhoneLogin",value:function(e){var t=this,n={tel:e,openid:this.openid||wx.getStorageSync("rendaOpenId")};(0,_http.$http)("/Login/is_resgister_auto",n).then(function(e){t.checkRouterView(e.data),store.dispatch({type:_user.GETALLUSER,payload:e.data})}).catch(function(e){console.log(e)})}}]),t}(_wepy2.default.page);Page(require("./../../npm/wepy/lib/wepy.js").default.$createPage(Welcome,"pages/login/welcome"));