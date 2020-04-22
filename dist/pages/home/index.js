"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),_wepy=require("./../../npm/wepy/lib/wepy.js"),_wepy2=_interopRequireDefault(_wepy),_http=require("./../../http.js"),_moment=require("./../../npm/moment/moment.js"),_moment2=_interopRequireDefault(_moment),_util=require("./../../util.js"),_search=require("./../../components/search.js"),_search2=_interopRequireDefault(_search),_banner=require("./../../components/banner.js"),_banner2=_interopRequireDefault(_banner),_actionSheet=require("./../../components/actionSheet.js"),_actionSheet2=_interopRequireDefault(_actionSheet),_jobFairList=require("./../../components/jobFairList.js"),_jobFairList2=_interopRequireDefault(_jobFairList),_wepyRedux=require("./../../npm/wepy-redux/lib/index.js"),_user=require("./../../store/actions/user.js"),_contant=require("./../../store/actions/contant.js"),_user2=require("./../../store/types/user.js"),store=(0,_wepyRedux.getStore)(),teamView=function(e){function t(){var e,a,n,i;_classCallCheck(this,t);for(var r=arguments.length,o=Array(r),s=0;s<r;s++)o[s]=arguments[s];return a=n=_possibleConstructorReturn(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(o))),n.$repeat={},n.$props={search:{bindsearchValue:"searchValue"},jobFairList:{"xmlns:v-bind":"","v-bind:list.sync":"list","v-bind:usertype.sync":"usertype",bindrouterHall:"routerHall"},actionSheet:{"v-bind:isScaleModal.sync":"isScaleModal",text:"企业信息正在审核中，请联系 客服021-8943895 ",bindhandleClose:"handleClose"}},n.$events={},n.components={search:_search2.default,banner:_banner2.default,jobFairList:_jobFairList2.default,actionSheet:_actionSheet2.default},n.data={rendaUserTeamType:0,params:{uid:"",page:1,limit:10},list:[],isScaleModal:!0,count:0,activeIndex:0,statusList:["全部","进行中","待举办"],openid:"",uid:"",usertype:0},n.config={navigationBarTitleText:"首页",enablePullDownRefresh:!0},n.events={handleClose:function(){wx.showTabBar(),n.$apply()},routerHall:function(e){n.usertype?(0,_util.wxNavigateTo)("/pages/home/hall?query="+e.id+"&title="+e.title):(wx.hideTabBar(),n.isScaleModal=!n.isScaleModal,n.$apply())}},n.methods={viewInfo:function(e){wx.navigateTo({url:e.url})},viewDetail:function(e){(0,_util.wxNavigateTo)("/pages/companyView/viewJob?query="+e.id+"&apply=1")},searchScrollLower:function(){this.count>this.list.length&&this.count>this.params.limit&&(this.params.limit=this.params.limit+10,this.getJobfairList())},showModal:function(e){this.activeIndex=e,this.$apply()}},i=a,_possibleConstructorReturn(n,i)}return _inherits(t,e),_createClass(t,[{key:"onPullDownRefresh",value:function(){console.log(1)}},{key:"addjobfair",value:function(e){var t=this,a={uid:this.params.uid,jf_id:e};(0,_http.$http)("/Jobfair/addjobfair",a).then(function(e){console.log(e),t.$apply()})}},{key:"checkUserLogin",value:function(e){var t=this;store.dispatch((0,_user.getAllUser)({openid:e})).then(function(e){t.params.uid=e.payload.id,t.usertype=e.payload.usertype,t.$apply(),e.payload.usertype?(t.getJobfairList(),t.$parent.globalData.rendaUserType=e.payload.usertype):((0,_util.wxToast)("请授权登录"),(0,_util.wxNavigateTo)("/pages/login/welcome"))}).catch(function(e){e&&e.code})}},{key:"getJobfairList",value:function(){var e=this;(0,_http.$http)("/Jobfair/getJobfairList",this.params).then(function(t){var a=[];a=t.data.data?t.data.data:[],a.forEach(function(e){e.endtime=_moment2.default.unix(e.endtime).format("YYYY-MM-DD HH:ss"),e.starttime=_moment2.default.unix(e.starttime).format("YYYY-MM-DD HH:ss")}),e.list=a,console.log(e.list),e.count=t.data.count,e.$apply()})}},{key:"onLoad",value:function(){wx.getStorageSync("rendaOpenId")?this.openid=wx.getStorageSync("rendaOpenId"):this.openid=this.$parent.getOpenId()}},{key:"onShow",value:function(){this.checkUserLogin(this.openid)}}]),t}(_wepy2.default.page);Page(require("./../../npm/wepy/lib/wepy.js").default.$createPage(teamView,"pages/home/index"));