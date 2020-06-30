"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),_wepy=require("./../../npm/wepy/lib/wepy.js"),_wepy2=_interopRequireDefault(_wepy),_http=require("./../../http.js"),_util=require("./../../util.js"),_base=require("./../../base/base.js"),selectView=function(e){function t(){var e,r,n,i;_classCallCheck(this,t);for(var o=arguments.length,s=Array(o),u=0;u<o;u++)s[u]=arguments[u];return r=n=_possibleConstructorReturn(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(s))),n.data={eduList:_base.eduList,workTypeList:_base.workTypeList,moneyList:_base.moneyList,query:{edu:"",nature:"",money:""},num:0},n.config={navigationBarTitleText:"筛选"},n.methods={selectTap:function(e,t){this.query[t]=e.value},save:function(){for(var e in this.query)this.query[e]||(this.num=0),this.query[e]&&(this.num=3);this.query.num=this.num,wx.setStorageSync("queryObj",JSON.stringify(this.query)),this.backView()},close:function(){wx.removeStorageSync("queryObj"),this.backView()}},i=r,_possibleConstructorReturn(n,i)}return _inherits(t,e),_createClass(t,[{key:"backView",value:function(){wx.navigateBack({delta:1})}}]),t}(_wepy2.default.page);Page(require("./../../npm/wepy/lib/wepy.js").default.$createPage(selectView,"pages/home/selectView"));