"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var a=0;a<t.length;a++){var i=t[a];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,a,i){return a&&e(t.prototype,a),i&&e(t,i),t}}(),_wepy=require("./../../npm/wepy/lib/wepy.js"),_wepy2=_interopRequireDefault(_wepy),_http=require("./../../http.js"),_moment=require("./../../npm/moment/moment.js"),_moment2=_interopRequireDefault(_moment),_util=require("./../../util.js"),_actionSheet=require("./../../components/actionSheet.js"),_actionSheet2=_interopRequireDefault(_actionSheet),_jobFairList=require("./../../components/jobFairList.js"),_jobFairList2=_interopRequireDefault(_jobFairList),lecture=function(e){function t(){var e,a,i,r;_classCallCheck(this,t);for(var n=arguments.length,o=Array(n),l=0;l<n;l++)o[l]=arguments[l];return a=i=_possibleConstructorReturn(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(o))),i.$repeat={},i.$props={actionSheet:{"xmlns:v-bind":"","v-bind:isScaleModal.sync":"isScaleModal",text:"企业信息不完整，请前往完善",okText:"完善信息",bindhandleClose:"handleClose",bindhandleOk:"handleOk"}},i.$events={},i.components={jobFairList:_jobFairList2.default,actionSheet:_actionSheet2.default},i.data={params:{page:1,limit:10},list:[],isScaleModal:!0,count:0,uid:"",usertype:0,text:"",okText:"",showLoading:!1,current:0,total:0,banner:[],list1:[],list2:[],rendaUserType:0,TIM:null,controls:!1},i.config={navigationBarTitleText:"空中宣讲会",enablePullDownRefresh:!0},i.events={handleClose:function(){i.isScaleModal=!i.isScaleModal,i.$apply()},handleOk:function(){wx.getStorageSync("rendaPerfect")||(0,_util.wxNavigateTo)("/pages/my/companyForm"),i.isScaleModal=!i.isScaleModal,i.$apply()}},i.methods={applyLecture:function(){wx.getStorageSync("rendaPerfect")?(0,_util.wxNavigateTo)("/pages/lecture/lectureForm"):(this.isScaleModal=!this.isScaleModal,this.$apply())},viewLecture:function(e){if(wx.setStorageSync("lectureId",e.id),1==this.rendaUserType)e.room_num?(0,_util.wxNavigateTo)("/pages/lecture/detail?query="+e.id+"&userName="+e.com_name+"&roomName="+e.title+"&roomID="+e.room_num):(0,_util.wxNavigateTo)("/pages/lecture/detail?query="+e.id+"&type=create&userName="+e.com_name+"&roomName="+e.title+"&roomID="+e.room_num);else{var t="/pages/lecture/detail?query="+e.id+"&roomID="+e.room_num+"&roomName="+e.com_name+"&userName="+e.title;(0,_util.wxNavigateTo)(t)}},searchScrollLower:function(){this.count>this.list.length&&this.count>this.params.limit&&(this.params.limit=this.params.limit+10,this.endAlectureList())}},r=a,_possibleConstructorReturn(i,r)}return _inherits(t,e),_createClass(t,[{key:"onLoad",value:function(){this.TIM=this.$parent.globalData.TIM,this.rendaUserType=wx.getStorageSync("rendaUserType")}},{key:"onShow",value:function(){this.getALLlist()}},{key:"getALLlist",value:function(){this.startAlectureList(),this.getsetAlectureList(),this.endAlectureList()}},{key:"startAlectureList",value:function(){var e=this;(0,_http.$http)("/homepresentation/startAlectureList",{}).then(function(t){var a=t.data;a.forEach(function(e){e.addtime=(0,_util.handleTime)(e.addtime)}),e.banner=a,e.$apply()})}},{key:"getsetAlectureList",value:function(){var e=this;(0,_http.$http)("/homepresentation/getsetAlectureList",{}).then(function(t){var a=t.data;a.forEach(function(e){e.starttime=(0,_util.handleTime)(e.starttime)}),e.list1=a,e.$apply()})}},{key:"endAlectureList",value:function(){var e=this;(0,_http.$http)("/homepresentation/endAlectureList",this.params).then(function(t){var a=t.data.data;a.forEach(function(e){e.addtime=(0,_util.handleTime)(e.addtime)}),e.total=t.data.countNum,e.list2=a,e.$apply()})}},{key:"_onIMError",value:function(e){console.log(e),console.log("错误事件"),e.data.message&&e.data.code&&2800!==e.data.code&&2999!==e.data.code&&(0,_util.wxToast)(e.data.message)}},{key:"bindrefresherrefresh",value:function(){this.getALLlist()}}]),t}(_wepy2.default.page);Page(require("./../../npm/wepy/lib/wepy.js").default.$createPage(lecture,"pages/lecture/list"));