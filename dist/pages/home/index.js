"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var a=0;a<t.length;a++){var i=t[a];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,a,i){return a&&e(t.prototype,a),i&&e(t,i),t}}(),_wepy=require("./../../npm/wepy/lib/wepy.js"),_wepy2=_interopRequireDefault(_wepy),_http=require("./../../http.js"),_moment=require("./../../npm/moment/moment.js"),_moment2=_interopRequireDefault(_moment),_util=require("./../../util.js"),_search=require("./../../components/search.js"),_search2=_interopRequireDefault(_search),_banner=require("./../../components/banner.js"),_banner2=_interopRequireDefault(_banner),_actionSheet=require("./../../components/actionSheet.js"),_actionSheet2=_interopRequireDefault(_actionSheet),_jobFairList=require("./../../components/jobFairList.js"),_jobFairList2=_interopRequireDefault(_jobFairList),_wepyRedux=require("./../../npm/wepy-redux/lib/index.js"),_user=require("./../../store/actions/user.js"),_contant=require("./../../store/actions/contant.js"),_user2=require("./../../store/types/user.js"),_timWx=require("./../../lib/tim-wx.js"),_timWx2=_interopRequireDefault(_timWx),IM_CONV_C2C=_timWx2.default.TYPES.CONV_C2C,store=(0,_wepyRedux.getStore)(),teamView=function(e){function t(){var e,a,i,n;_classCallCheck(this,t);for(var o=arguments.length,r=Array(o),s=0;s<o;s++)r[s]=arguments[s];return a=i=_possibleConstructorReturn(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(r))),i.$repeat={},i.$props={search:{bindsearchValue:"searchValue"},jobFairList:{"xmlns:v-bind":"","v-bind:list.sync":"list","v-bind:usertype.sync":"usertype",bindrouterHall:"routerHall",bindbooking:"booking"},actionSheet:{"v-bind:isScaleModal.sync":"isScaleModal",text:"企业信息正在审核中，请联系 客服021-8943895",bindhandleClose:"handleClose"}},i.$events={},i.components={search:_search2.default,banner:_banner2.default,jobFairList:_jobFairList2.default,actionSheet:_actionSheet2.default},i.data={rendaUserTeamType:0,params:{uid:"",page:1,limit:10,status:""},list:[],isScaleModal:!0,count:0,activeIndex:0,statusList:["全部","进行中","待举办"],openid:"",uid:"",usertype:0,tim:{}},i.config={navigationBarTitleText:"首页",enablePullDownRefresh:!0},i.events={searchValue:function(e){i.params=Object.assign(i.params,{keywords:e}),i.getJobfairList()},handleClose:function(){wx.showTabBar(),i.$apply()},booking:function(e){e.applyinfo||1==e.is_finish||i.addjobfair(e.id),e.applyinfo&&!applyinfo.status&&(i.isScaleModal=!i.isScaleModal,i.$apply())},routerHall:function(e){i.usertype?(i.addjfUser(e.id),wx.setStorageSync("rendaJHID",e.id),(0,_util.wxNavigateTo)("/pages/home/hall?query="+e.id+"&title="+e.title)):(wx.hideTabBar(),i.isScaleModal=!i.isScaleModal,i.$apply())}},i.methods={viewInfo:function(e){wx.navigateTo({url:e.url})},viewDetail:function(e){(0,_util.wxNavigateTo)("/pages/companyView/viewJob?query="+e.id+"&apply=1")},searchScrollLower:function(){this.count>this.list.length&&this.count>this.params.limit&&(this.params.limit=this.params.limit+10,this.getJobfairList())},showModal:function(e){this.activeIndex=e,this.params.status=0==e?"":1==e?e:0,this.getJobfairList()}},n=a,_possibleConstructorReturn(i,n)}return _inherits(t,e),_createClass(t,[{key:"onPullDownRefresh",value:function(){this.openid=this.$parent.getOpenId()}},{key:"addjobfair",value:function(e){var t=this,a={uid:this.params.uid,jf_id:e};(0,_http.$http)("/Jobfair/addjobfair",a).then(function(e){e.data?(t.getJobfairList(),(0,_util.wxToast)("申请订展成功")):(0,_util.wxToast)("申请订展失败")})}},{key:"addjfUser",value:function(e){var t={uid:this.params.uid,jf_id:e};(0,_http.$http)("/Jobfair/addjf_user",t).then(function(e){console.log(e)})}},{key:"checkUserLogin",value:function(e){var t=this;store.dispatch((0,_user.getAllUser)({openid:e})).then(function(e){t.params.uid=e.payload.id,t.usertype=e.payload.usertype,t.$apply(),e.payload.usertype?(t.getJobfairList(),t.$parent.globalData.rendaUserType=e.payload.usertype):((0,_util.wxToast)("请授权登录"),(0,_util.wxNavigateTo)("/pages/login/welcome"))}).catch(function(e){e&&e.code})}},{key:"getJobfairList",value:function(){var e=this;(0,_http.$http)("/Jobfair/getJobfairList",this.params).then(function(t){var a=[];a=t.data.data?t.data.data:[],a.forEach(function(e){e.endtime=_moment2.default.unix(e.endtime).format("YYYY-MM-DD HH:ss"),e.starttime=_moment2.default.unix(e.starttime).format("YYYY-MM-DD HH:ss")}),e.list=a,e.count=t.data.count,e.$apply()})}},{key:"getUserSig",value:function(){var e=this;(0,_http.$http)("/autograph/getAutograph",{uid:this.openid}).then(function(t){console.log(t.data);var a={SDKAppID:1400335565};e.tim=_timWx2.default.create(a),e.tim.login({userID:e.openid,userSig:t.data}).then(function(e){console.log(e.data),console.log("登录成功"),!0===e.data.repeatLogin&&console.log(e.data.errorInfo)}).catch(function(e){console.warn("login error:",e)}),e.tim.getConversationList().then(function(e){e.data.conversationList}).catch(function(e){console.warn("getConversationList error:",e)})})}},{key:"sendC2CTextMessage",value:function(){var e=this.tim.createTextMessage({to:"dddddd",conversationType:IM_CONV_C2C,payload:{text:"hi"}}),t=this.tim.sendMessage(e);return t.then(function(e){console.log("发送成功"),console.log(TAG_NAME,"sendC2CTextMessage success",e)}).catch(function(e){console.warn(TAG_NAME,"sendC2CTextMessage error:",e)}),t}},{key:"onShow",value:function(){wx.getStorageSync("rendaOpenId")?this.openid=wx.getStorageSync("rendaOpenId"):this.openid=this.$parent.getOpenId(),this.checkUserLogin(this.openid),store.dispatch((0,_contant.getAllContant)())}}]),t}(_wepy2.default.page);Page(require("./../../npm/wepy/lib/wepy.js").default.$createPage(teamView,"pages/home/index"));