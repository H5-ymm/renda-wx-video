"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var o=0;o<t.length;o++){var i=t[o];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,o,i){return o&&e(t.prototype,o),i&&e(t,i),t}}(),_wepy=require("./../../npm/wepy/lib/wepy.js"),_wepy2=_interopRequireDefault(_wepy),_http=require("./../../http.js"),_moment=require("./../../npm/moment/moment.js"),_moment2=_interopRequireDefault(_moment),_util=require("./../../util.js"),personalDialogBox=function(e){function t(){var e,o,i,a;_classCallCheck(this,t);for(var r=arguments.length,n=Array(r),s=0;s<r;s++)n[s]=arguments[s];return o=i=_possibleConstructorReturn(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(n))),i.data={rendaUserTeamType:0,params:{uid:"",id:""},list:[],messageDetail:{view_time:"",logo_url:""},count:0,isView:!1,id:""},i.config={navigationBarTitleText:"消息"},i.methods={videoView:function(){var e=this,t={room_name:wx.getStorageSync("phone"),room_num:this.messageDetail.room_num};(0,_util.wxShowModal)("视频面试","请确认已与企业电话沟通时间，未沟通可能造成视频面试失败?").then(function(o){e.getuserSig(t)}).catch(function(){console.log("取消")})},viewResume:function(){(0,_util.wxNavigateTo)("/pages/my/resume?query=1")},recommend:function(){wx.navigateTo({url:"/pages/companyView/viewJob?query="+this.messageDetail.job_id+"&room_num="+this.messageDetail.room_num})},concat:function(){var e=this;wx.showActionSheet({itemList:["拨打企业电话"],success:function(t){wx.makePhoneCall({phoneNumber:e.messageDetail.link_tel})},fail:function(e){console.log(e.errMsg)}})}},a=o,_possibleConstructorReturn(i,a)}return _inherits(t,e),_createClass(t,[{key:"onLoad",value:function(e){wx.setStorageSync("isView",!1),this.params.uid=e.query,this.params.id=e.query}},{key:"onShow",value:function(){wx.getStorageSync("isView")?this.isView=!0:this.isView=!1,this.$apply()}},{key:"getuserSig",value:function(e){var t=this;(0,_http.$http)("/Tencentcloud/createQuanjian",{name:e.room_name}).then(function(o){e.userSig=o.data,wx.setStorageSync("viewList",""),t.routerView(e)})}},{key:"routerView",value:function(e){var t="/pages/room/room?roomID="+e.room_num+"&userSig="+e.userSig+"&template=grid&debugMode=false&cloudenv=PRO&localVideo=true&localAudio=true&enableEarMonitor=false&enableAutoFocus=true&localMirror=auto&enableAgc=true&enableAns=true&encsmall=true&frontCamera=front&videoWidth=360&videoHeight=640&scene=rtc&userID="+e.room_name+"&minBitrate=600&maxBitrate=900";wx.navigateTo({url:t})}},{key:"getMsgDetail",value:function(){var e=this;(0,_http.$http)("/personinfo/getperson_msgdetail",this.params).then(function(t){e.messageDetail=t.data,e.messageDetail&&e.messageDetail.logo_url&&-1==e.messageDetail.logo_url.indexOf("http")&&(e.messageDetail.logo_url=(0,_util.getImgUrl)(e.messageDetail.logo_url)),e.messageDetail.view_time=_moment2.default.unix(e.messageDetail.view_time).format("YYYY/MM/DD HH:mm"),e.messageDetail.addtime=_moment2.default.unix(e.messageDetail.addtime).format("YYYY-MM-DD HH:mm"),e.$apply()})}}]),t}(_wepy2.default.page);Page(require("./../../npm/wepy/lib/wepy.js").default.$createPage(personalDialogBox,"pages/message/personalDialogBox"));