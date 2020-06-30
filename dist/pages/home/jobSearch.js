"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,a,r){return a&&e(t.prototype,a),r&&e(t,r),t}}(),_wepy=require("./../../npm/wepy/lib/wepy.js"),_wepy2=_interopRequireDefault(_wepy),_http=require("./../../http.js"),_util=require("./../../util.js"),_jobLSearchList=require("./../../components/jobLSearchList.js"),_jobLSearchList2=_interopRequireDefault(_jobLSearchList),_search=require("./../../components/search.js"),_search2=_interopRequireDefault(_search),jobSearch=function(e){function t(){var e,a,r,o;_classCallCheck(this,t);for(var i=arguments.length,s=Array(i),n=0;n<i;n++)s[n]=arguments[n];return a=r=_possibleConstructorReturn(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(s))),r.$repeat={},r.$props={jobLSearchList:{"xmlns:v-bind":"","v-bind:list.sync":"list",binddeliverResume:"deliverResume",class:"scroll-view"},searchJob:{placeholder:"搜索词",bindsearchValue:"searchValue"}},r.$events={},r.components={jobLSearchList:_jobLSearchList2.default,searchJob:_search2.default},r.data={params:{jf_if:"",limit:10,page:1,area:"",jf_id:"",uid:""},list:[],count:0,address:"工作地点",jobName:"岗位类别",total:0,keyWords:""},r.config={navigationBarTitleText:"职位列表"},r.events={searchValue:function(e){r.keyWords=e,r.$apply()},deliverResume:function(e){var t={uid:r.params.uid,job_id:e.id,jf_id:wx.getStorageSync("rendaJHID")};r.applyJob(t)}},r.methods={searchQuery:function(e){(0,_util.wxNavigateTo)("/pages/home/"+e)},searchName:function(){this.params.name=this.keyWords,this.getjobList()},clearQuery:function(){this.params={jf_id:wx.getStorageSync("rendaJHID"),limit:10,page:1,name:"",uid:wx.getStorageSync("rendaUid")},this.total=0,this.address="工作地点",this.jobName="岗位类别",this.$apply(),this.clearData(),this.getjobList()},searchScrollLower:function(){this.count>this.list.length&&this.count>this.params.limit&&(this.params.limit=this.params.limit+10,this.getjobList())}},o=a,_possibleConstructorReturn(r,o)}return _inherits(t,e),_createClass(t,[{key:"getjobList",value:function(){var e=this;(0,_http.$http)("/jobfair/getjobList",this.params).then(function(t){e.list=t.data.data||[],e.count=t.data.count||0,e.$apply()})}},{key:"applyJob",value:function(e){var t=this;(0,_http.$http)("/personaljob/addapplyJob",e).then(function(e){e.data?((0,_util.wxToast)("投递成功耐心等待企业回复吧"),t.getjobList()):(0,_util.wxToast)("投递失败")})}},{key:"onLoad",value:function(){this.clearData()}},{key:"onShow",value:function(){wx.getStorageSync("codeObj")&&(this.params.area=JSON.parse(wx.getStorageSync("codeObj")).code,this.address=JSON.parse(wx.getStorageSync("codeObj")).name),wx.getStorageSync("jobCategory")&&(this.params.job_type=JSON.parse(wx.getStorageSync("jobCategory")).id,this.jobName=JSON.parse(wx.getStorageSync("jobCategory")).type_name),wx.getStorageSync("queryObj")&&(this.params.edu=JSON.parse(wx.getStorageSync("queryObj")).edu,this.params.nature=JSON.parse(wx.getStorageSync("queryObj")).nature,this.params.money=JSON.parse(wx.getStorageSync("queryObj")).money,this.total=JSON.parse(wx.getStorageSync("queryObj")).num),this.params.jf_id=wx.getStorageSync("rendaJHID"),this.params.uid=wx.getStorageSync("rendaUid"),this.getjobList()}},{key:"clearData",value:function(){wx.removeStorageSync("codeObj"),wx.removeStorageSync("jobCategory"),wx.removeStorageSync("queryObj")}}]),t}(_wepy2.default.page);Page(require("./../../npm/wepy/lib/wepy.js").default.$createPage(jobSearch,"pages/home/jobSearch"));