"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function t(t,e){for(var i=0;i<e.length;i++){var o=e[i];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,i,o){return i&&t(e.prototype,i),o&&t(e,o),e}}(),_wepy=require("./../../npm/wepy/lib/wepy.js"),_wepy2=_interopRequireDefault(_wepy),_http=require("./../../http.js"),_moment=require("./../../npm/moment/moment.js"),_moment2=_interopRequireDefault(_moment),_util=require("./../../util.js"),_jobList=require("./../../components/jobList.js"),_jobList2=_interopRequireDefault(_jobList),jobView=function(t){function e(){var t,i,o,n;_classCallCheck(this,e);for(var r=arguments.length,a=Array(r),s=0;s<r;s++)a[s]=arguments[s];return i=o=_possibleConstructorReturn(this,(t=e.__proto__||Object.getPrototypeOf(e)).call.apply(t,[this].concat(a))),o.$repeat={},o.$props={jobList:{"xmlns:v-bind":"","v-bind:list.sync":"list",class:"scroll-view"}},o.$events={},o.components={jobList:_jobList2.default},o.data={params:{uid:"",page:1,limit:10},list:[],count:0},o.config={navigationBarTitleText:"职位列表"},o.methods={viewInfo:function(t){wx.navigateTo({url:t.url})},viewDetail:function(t){(0,_util.wxNavigateTo)("/pages/companyView/viewJob?query="+t.id+"&apply=1")},searchScrollLower:function(){this.count>this.list.length&&this.count>this.params.limit&&(this.params.limit=this.params.limit+10,this.getjobList())},showModal:function(t){this.activeIndex=t,this.$apply()}},n=i,_possibleConstructorReturn(o,n)}return _inherits(e,t),_createClass(e,[{key:"getjobList",value:function(t){var e=this;(0,_http.$http)("/Companyjob/getjobList",this.params).then(function(t){e.list=t.data.data,e.count=t.data.count,e.$apply()})}},{key:"onLoad",value:function(t){this.params.uid=wx.getStorageSync("rendaUid")||this.$parent.globalData.uid,this.params.com_id=t.id,this.getjobList()}}]),e}(_wepy2.default.page);Page(require("./../../npm/wepy/lib/wepy.js").default.$createPage(jobView,"pages/home/jobView"));