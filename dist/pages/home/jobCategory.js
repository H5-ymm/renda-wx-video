"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function t(t,e){for(var o=0;o<e.length;o++){var n=e[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,o,n){return o&&t(e.prototype,o),n&&t(e,n),e}}(),_wepy=require("./../../npm/wepy/lib/wepy.js"),_wepy2=_interopRequireDefault(_wepy),_http=require("./../../http.js"),_util=require("./../../util.js"),_jobList=require("./../../components/jobList.js"),_jobList2=_interopRequireDefault(_jobList),jobCategory=function(t){function e(){var t,o,n,i;_classCallCheck(this,e);for(var r=arguments.length,s=Array(r),a=0;a<r;a++)s[a]=arguments[a];return o=n=_possibleConstructorReturn(this,(t=e.__proto__||Object.getPrototypeOf(e)).call.apply(t,[this].concat(s))),n.components={jobList:_jobList2.default},n.data={params:{uid:"",com_id:""},list:[],if_show:!1,show_centent:!1,multiArray:[],multiIndex:[0,0],type:0},n.config={navigationBarTitleText:"职位列表"},n.methods={showSecondData:function(t,e,o){console.log(t,e,o),this.type=t,1==t?(this.multiIndex[0]=o,this.$apply(),this.getJobList(e.id)):(this.multiIndex[1]=o,wx.setStorageSync("jobCategory",JSON.stringify(e)),wx.navigateBack({delta:1}))},showMoreContent:function(t){var e=this;this.getJobList(t.id),this.show_centent?(this.show_centent=!1,setTimeout(function(){e.if_show=!1},1e3)):(this.if_show=!0,this.show_centent=!0),this.$apply()},switchShow:function(){this.show_centent=!1,this.if_show=!1,this.multiIndex=[0,0],this.$apply()}},i=o,_possibleConstructorReturn(n,i)}return _inherits(e,t),_createClass(e,[{key:"getJobList",value:function(t){var e=this;(0,_http.$http)("/Constant/getJobType",{parentId:t}).then(function(o){t?(o.data&&0==e.type&&(e.multiArray[0]=o.data,e.type=1,e.getJobList(o.data[0].id)),o.data&&1==e.type&&(e.multiArray[1]=o.data)):e.list=o.data,e.$apply()}).catch(function(t){})}},{key:"onLoad",value:function(){this.getJobList("")}}]),e}(_wepy2.default.page);Page(require("./../../npm/wepy/lib/wepy.js").default.$createPage(jobCategory,"pages/home/jobCategory"));