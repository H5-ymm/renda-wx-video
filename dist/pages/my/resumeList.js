"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function t(t,e){for(var i=0;i<e.length;i++){var a=e[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}return function(e,i,a){return i&&t(e.prototype,i),a&&t(e,a),e}}(),_wepy=require("./../../npm/wepy/lib/wepy.js"),_wepy2=_interopRequireDefault(_wepy),_http=require("./../../http.js"),resumeList=function(t){function e(){var t,i,a,n;_classCallCheck(this,e);for(var r=arguments.length,o=Array(r),s=0;s<r;s++)o[s]=arguments[s];return i=a=_possibleConstructorReturn(this,(t=e.__proto__||Object.getPrototypeOf(e)).call.apply(t,[this].concat(o))),a.data={list:[],activeIndex:0,resumeType:"",params:{uid:"",page:1,limit:10},count:0},a.config={navigationBarTitleText:"应聘简历"},a.methods={viewInfo:function(t){wx.navigateTo({url:t.url})},switchView:function(t){this.hallType=t,this.$apply()},viewDetail:function(t){wxNavigateTo("/pages/companyView/viewJob?query="+t.id+"&apply=1")},searchScrollLower:function(){this.count>this.list.length&&this.count>this.params.limit&&(this.params.limit=this.params.limit+10,this.getReceiptList())},showModal:function(t){this.activeIndex=t,this.$apply()},applyRecepit:function(t){var e={job_id:t.id,uid:this.params.uid};this.setReceipt(e)}},n=i,_possibleConstructorReturn(a,n)}return _inherits(e,t),_createClass(e,[{key:"getGeportOrderList",value:function(){var t=this;(0,_http.$http)("/Wxresume/reportOrderList",this.params).then(function(e){t.list=e.data.data||[],t.count=e.data.count,t.$apply()})}},{key:"getInternalInvoiceList",value:function(){var t=this;(0,_http.$http)("/Wxresume/internalInvoiceList",this.params).then(function(e){t.list=e.data.data||[],t.count=e.data.count,t.$apply()})}},{key:"getResumeList",value:function(){var t=this;(0,_http.$http)("/Companyjob/getresume_list",this.params).then(function(e){var i=[];i=e.data.data?e.data.data:[],i.forEach(function(t){t.addtime=$moment.unix(t.addtime).format("MM-DD HH:ss")}),t.list=i,t.count=e.data.count,t.$apply()})}},{key:"onLoad",value:function(t){this.isScaleModal=!1,this.params.uid=wx.getStorageSync("rendaUid")||this.$parent.globalData.uid,this.$apply()}},{key:"onShow",value:function(){this.getResumeList()}}]),e}(_wepy2.default.page);Page(require("./../../npm/wepy/lib/wepy.js").default.$createPage(resumeList,"pages/my/resumeList"));