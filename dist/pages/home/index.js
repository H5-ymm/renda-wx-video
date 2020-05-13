"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),_wepy=require("./../../npm/wepy/lib/wepy.js"),_wepy2=_interopRequireDefault(_wepy),_http=require("./../../http.js"),_moment=require("./../../npm/moment/moment.js"),_moment2=_interopRequireDefault(_moment),_util=require("./../../util.js"),_banner=require("./../../components/banner.js"),_banner2=_interopRequireDefault(_banner),_actionSheet=require("./../../components/actionSheet.js"),_actionSheet2=_interopRequireDefault(_actionSheet),_jobFairList=require("./../../components/jobFairList.js"),_jobFairList2=_interopRequireDefault(_jobFairList),_wepyRedux=require("./../../npm/wepy-redux/lib/index.js"),_user=require("./../../store/actions/user.js"),_contant=require("./../../store/actions/contant.js"),_user2=require("./../../store/types/user.js"),store=(0,_wepyRedux.getStore)(),teamView=function(e){function t(){var e,a,o,n;_classCallCheck(this,t);for(var i=arguments.length,r=Array(i),s=0;s<i;s++)r[s]=arguments[s];return a=o=_possibleConstructorReturn(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(r))),o.$repeat={},o.$props={jobFairList:{"xmlns:v-bind":"","v-bind:list.sync":"list","v-bind:usertype.sync":"usertype",bindrouterHall:"routerHall",bindbooking:"booking"},actionSheet:{"v-bind:isScaleModal.sync":"isScaleModal","v-bind:text.sync":"text","v-bind:okText.sync":"okText",bindhandleClose:"handleClose",bindhandleOk:"handleOk"}},o.$events={},o.components={banner:_banner2.default,jobFairList:_jobFairList2.default,actionSheet:_actionSheet2.default},o.data={rendaUserTeamType:0,params:{uid:"",page:1,limit:10,status:""},list:[],isScaleModal:!0,count:0,activeIndex:0,statusList:["全部","进行中","待举办"],openid:"",uid:"",usertype:0,TIM:null,text:"",okText:""},o.config={navigationBarTitleText:"首页",enablePullDownRefresh:!0},o.events={searchValue:function(e){o.params=Object.assign(o.params,{keywords:e}),o.getJobfairList()},handleClose:function(){wx.showTabBar(),o.isScaleModal=!o.isScaleModal,o.$apply()},handleOk:function(){wx.getStorageSync("rendaPerfect")?(0,_util.contactPhone)():(0,_util.wxNavigateTo)("/pages/my/companyForm"),wx.showTabBar(),o.isScaleModal=!o.isScaleModal,o.$apply()},booking:function(e){if(!wx.getStorageSync("rendaPerfect"))return wx.hideTabBar(),o.okText="完善信息",o.text="企业信息不完整，请前往完善",o.isScaleModal=!o.isScaleModal,void o.$apply();e.applyinfo||1==e.is_finish||o.addjobfair(e),wx.setStorageSync("addjobfair",JSON.stringify(e.applyinfo))},routerHall:function(e){o.usertype?1==e.is_audit&&e.applyinfo&&!e.applyinfo.status?(wx.hideTabBar(),o.text="企业订展正在审核中，请联系客服021-51991869",o.isScaleModal=!o.isScaleModal,o.okText="联系客服",o.$apply()):(o.addjfUser(e.id),wx.setStorageSync("rendaJHID",e.id),wx.setStorageSync("addjobfair",JSON.stringify(e.applyinfo)),(0,_util.wxNavigateTo)("/pages/home/hall?query="+e.id+"&title="+e.title)):(wx.hideTabBar(),o.isScaleModal=!o.isScaleModal,o.$apply())}},o.methods={viewInfo:function(e){wx.navigateTo({url:e.url})},viewDetail:function(e){(0,_util.wxNavigateTo)("/pages/companyView/viewJob?query="+e.id+"&apply=1")},searchScrollLower:function(){console.log(0),this.count>this.list.length&&this.count>this.params.limit&&(this.params.limit=this.params.limit+10,this.getJobfairList())},showModal:function(e){this.activeIndex=e,this.params.status=0==e?"":1==e?e:0,this.getJobfairList()}},n=a,_possibleConstructorReturn(o,n)}return _inherits(t,e),_createClass(t,[{key:"bindrefresherrefresh",value:function(){console.log("bindrefresherrefresh"),this.onShow()}},{key:"addjobfair",value:function(e){var t=this,a={uid:this.params.uid,jf_id:e.id};(0,_http.$http)("/Jobfair/addjobfair",a).then(function(a){a.data?(t.getJobfairList(),1==e.is_audit?(t.text="企业订展正在审核中，请联系客服021-51991869",t.isScaleModal=!t.isScaleModal,t.okText="联系客服",t.$apply()):(0,_util.wxToast)("申请订展成功")):(0,_util.wxToast)("申请订展失败")})}},{key:"addjfUser",value:function(e){var t={uid:this.params.uid,jf_id:e};(0,_http.$http)("/Jobfair/addjf_user",t).then(function(e){console.log(e)})}},{key:"checkUserLogin",value:function(e){var t=this;store.dispatch((0,_user.getAllUser)({openid:e})).then(function(e){t.params.uid=e.payload.id,t.usertype=e.payload.usertype,t.$apply(),e.payload.usertype?(t.getJobfairList(),t.getUserSig(),t.$parent.globalData.rendaUserType=e.payload.usertype):(wx.clearStorageSync(),(0,_util.wxToast)("请授权登录"),(0,_util.wxNavigateTo)("/pages/login/welcome"))}).catch(function(e){e&&e.code})}},{key:"getJobfairList",value:function(){var e=this;(0,_http.$http)("/Jobfair/getJobfairList",this.params).then(function(t){var a=[];a=t.data.data?t.data.data:[],a.forEach(function(e){e.endtime=_moment2.default.unix(e.endtime).format("YYYY-MM-DD HH:ss"),e.starttime=_moment2.default.unix(e.starttime).format("YYYY-MM-DD HH:ss")}),e.list=a,e.count=t.data.count,e.$apply()})}},{key:"_initIM",value:function(){wx.$app.off(this.TIM.EVENT.SDK_READY,this._onIMReady),wx.$app.off(this.TIM.EVENT.ERROR,this._onIMError),wx.$app.on(this.TIM.EVENT.SDK_READY,this._onIMReady,this),wx.$app.on(this.TIM.EVENT.ERROR,this._onIMError,this)}},{key:"_onIMError",value:function(e){e.data.message&&e.data.code&&2800!==e.data.code&&2999!==e.data.code&&(0,_util.wxToast)(e.data.message)}},{key:"getUserSig",value:function(){var e=this;(0,_http.$http)("/autograph/getAutograph",{uid:this.params.uid+""}).then(function(t){wx.$app.login({userID:e.params.uid+"",userSig:t.data}).then(function(t){console.log("登录成功"),e._initIM(),!0===t.data.repeatLogin&&console.log(t.data.errorInfo)}).catch(function(e){console.warn("login error:",e)})})}},{key:"_onIMReady",value:function(){var e=wx.getStorageSync("userInfo")?JSON.parse(wx.getStorageSync("userInfo")):null,t={};e?t=2==wx.getStorageSync("rendaUserType")?{nick:e.nickname,avatar:e.head_img}:{nick:e.com_name,avatar:e.logo_url}:(e=JSON.parse(wx.getStorageSync("wxInfo")),t={nick:e.nickName,avatar:e.avatarUrl}),wx.$app.updateMyProfile(t).then(function(e){console.log(e.data)}).catch(function(e){console.warn("updateMyProfile error:",e)})}},{key:"getOpenId",value:function(){var e=this;wx.login({success:function(t){t.code?(0,_http.$http)("/Login/getopenid",{code:t.code}).then(function(t){var a=JSON.parse(t.data);e.openid=a.openid||"",e.openid?(e.$parent.globalData.openId=a.openid,e.$parent.globalData.sessionKey=a.session_key,wx.setStorageSync("session_key",a.session_key),wx.setStorageSync("rendaOpenId",a.openid),e.checkUserLogin(e.openid)):(wx.clearStorageSync(),(0,_util.wxToast)("请授权登录"),wx.redirectTo({url:"/pages/login/welcome"}))}).catch(function(e){console.log(e)}):console.log("获取失败！"+t.errMsg)}})}},{key:"onShow",value:function(){wx.showTabBar(),this.TIM=this.$parent.globalData.TIM,wx.getStorageSync("rendaOpenId")&&wx.getStorageSync("session_key")?(this.openid=wx.getStorageSync("rendaOpenId"),this.checkUserLogin(this.openid)):this.getOpenId(),store.dispatch((0,_contant.getAllContant)())}}]),t}(_wepy2.default.page);Page(require("./../../npm/wepy/lib/wepy.js").default.$createPage(teamView,"pages/home/index"));