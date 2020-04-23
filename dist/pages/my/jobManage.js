"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var i=0;i<t.length;i++){var a=t[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,i,a){return i&&e(t.prototype,i),a&&e(t,a),t}}(),_wepy=require("./../../npm/wepy/lib/wepy.js"),_wepy2=_interopRequireDefault(_wepy),_http=require("./../../http.js"),_moment=require("./../../npm/moment/moment.js"),_moment2=_interopRequireDefault(_moment),_util=require("./../../util.js"),_jobManageList=require("./../../components/jobManageList.js"),_jobManageList2=_interopRequireDefault(_jobManageList),jobManage=function(e){function t(){var e,i,a,n;_classCallCheck(this,t);for(var o=arguments.length,r=Array(o),s=0;s<o;s++)r[s]=arguments[s];return i=a=_possibleConstructorReturn(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(r))),a.$repeat={},a.$props={jobManageList:{"xmlns:v-bind":"","v-bind:list.sync":"list",class:"scroll-view page"}},a.$events={},a.components={jobManageList:_jobManageList2.default},a.data={params:{uid:"",page:1,limit:10},list:[],count:0,activeIndex:0},a.config={navigationBarTitleText:"职位管理"},a.methods={viewDetail:function(e){(0,_util.wxNavigateTo)("/pages/companyView/viewJob?query="+e.id+"&apply=1")},releaseJob:function(){(0,_util.wxNavigateTo)("/pages/my/jobForm")},searchScrollLower:function(){this.count>this.list.length&&this.count>this.params.limit&&(this.params.limit=this.params.limit+10,this.getReceiptList())},showModal:function(e){this.activeIndex=e,this.$apply()},applyRecepit:function(e){var t={job_id:e.id,uid:this.params.uid};this.setReceipt(t)}},n=i,_possibleConstructorReturn(a,n)}return _inherits(t,e),_createClass(t,[{key:"getjobList",value:function(){var e=this;(0,_http.$http)("/Companyjob/getjobList",this.params).then(function(t){e.list=t.data.data?t.data.data:[],e.count=t.data.count,e.$apply()})}},{key:"onLoad",value:function(e){this.params.com_id=e.query,this.params.uid=wx.getStorageSync("rendaUid")||this.$parent.globalData.uid,this.$apply()}},{key:"onShow",value:function(){this.getjobList()}}]),t}(_wepy2.default.page);Page(require("./../../npm/wepy/lib/wepy.js").default.$createPage(jobManage,"pages/my/jobManage"));