"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),_dec,_class,_wepy=require("./../../npm/wepy/lib/wepy.js"),_wepy2=_interopRequireDefault(_wepy),_http=require("./../../http.js"),_util=require("./../../util.js"),_modal=require("./../../components/modal.js"),_modal2=_interopRequireDefault(_modal),_wepyRedux=require("./../../npm/wepy-redux/lib/index.js"),_user=require("./../../store/actions/user.js"),_types=require("./../../store/types/index.js"),_contant=require("./../../store/actions/contant.js"),store=(0,_wepyRedux.getStore)(),my=(_dec=(0,_wepyRedux.connect)({loginUser:function(e){return e.user.loginUser}}))(_class=function(e){function t(){var e,n,o,i;_classCallCheck(this,t);for(var r=arguments.length,a=Array(r),s=0;s<r;s++)a[s]=arguments[s];return n=o=_possibleConstructorReturn(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(a))),o.$repeat={},o.$props={modal:{"xmlns:v-bind":"","v-bind:isScaleModal.sync":"isModal","v-bind:height.sync":"modalHeight","v-bind:modalObj.sync":"modalObj",bindhandleClose:"handleClose",bindhandleOk:"handleOk"}},o.$events={},o.components={modal:_modal2.default},o.data={userInfo:{},head_img:"",isModal:!0,modalHeight:640,modalObj:{title:"意见反馈",subTitle:"请输入您对本公司的宝贵意见，"},usertype:0,uid:"",wxInfo:"",com_id:""},o.events={handleOk:function(e){console.log(e),o.isModal=!o.isModal,o.$apply()},handleClose:function(){o.isModal=!o.isModal,o.$apply()}},o.config={navigationBarTitleText:"我的"},o.computed={userName:function(){var e=wx.getStorageSync("wxInfo")?JSON.parse(wx.getStorageSync("wxInfo")).user_name:"";return this.userInfo.user_name?this.userInfo.user_name:e},menusList:function(){return 1==this.usertype?[{title:"企业信息",url:"/pages/my/companyForm"},{title:"职位管理",url:"/pages/my/jobManage?query="+this.com_id},{title:"应聘简历",url:"/pages/my/resumeList"},{title:"意见反馈"}]:[{title:"我的简历",url:"/pages/my/resume"},{title:"投递记录",url:"/pages/my/deliveryRecord"},{title:"我的收藏",url:"/pages/home/collect"},{title:"意见反馈"}]}},o.methods={viewInfo:function(e){"意见反馈"==e.title?(this.isModal=!1,this.$apply()):wx.navigateTo({url:e.url})},outLogin:function(){var e=this;(0,_util.wxShowModal)("退出登录","确定退出登录吗?","确定").then(function(t){e.loginOut()}).catch(function(){console.log("取消")})}},i=n,_possibleConstructorReturn(o,i)}return _inherits(t,e),_createClass(t,[{key:"onLoad",value:function(){this.uid=wx.getStorageSync("rendaUid")||this.$parent.globalData.uid,this.wxInfo=wx.getStorageSync("wxInfo"),this.usertype=wx.getStorageSync("rendaUserType"),this.getDetail(this.usertype),this.$apply()}},{key:"getUser",value:function(){var e=this;(0,_http.$http)("/Userinfo/getUserInfo",{uid:this.uid}).then(function(t){e.userInfo=t.data||{},t.data.mobile&&wx.setStorageSync("userInfo",JSON.stringify(e.userInfo)),t.data.head_img?t.data.head_img.indexOf("http")>-1?e.head_img=t.data.head_img:e.head_img=(0,_util.getImgUrl)(t.data.head_img):e.head_img=e.wxInfo?JSON.parse(e.wxInfo).head_img:"",e.$apply()})}},{key:"getCompanyInfo",value:function(){var e=this;(0,_http.$http)("/Company/getcompanyinfobyuid",{uid:this.uid}).then(function(t){var n=t.data||{};e.userInfo.user_name=n.com_name,e.userInfo.link_tel=n.link_tel,e.com_id=n.id,n.logo_url&&(n.logo_url.indexOf("http")>-1?e.head_img=n.logo_url:e.head_img=(0,_util.getImgUrl)(n.logo_url)),e.$apply(),wx.setStorageSync("userInfo",JSON.stringify(n))})}},{key:"getDetail",value:function(e){2==e?this.getUser():this.getCompanyInfo()}},{key:"loginOut",value:function(){(0,_http.$http)("/login/UntyingOpenid",{uid:this.uid}).then(function(e){wx.clearStorageSync(),(0,_util.wxToast)("退出登录成功"),(0,_util.wxRedirectTo)("/pages/login/welcome?query=loginout"),store.dispatch({type:_types.GETALLUSER,payload:{}})}).catch(function(e){console.log(e)})}}]),t}(_wepy2.default.page))||_class;Page(require("./../../npm/wepy/lib/wepy.js").default.$createPage(my,"pages/my/index"));