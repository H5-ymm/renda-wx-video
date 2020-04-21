"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),_wepy=require("./../../npm/wepy/lib/wepy.js"),_wepy2=_interopRequireDefault(_wepy),_jobItem=require("./../../components/jobItem.js"),_jobItem2=_interopRequireDefault(_jobItem),_http=require("./../../http.js"),_util=require("./../../util.js"),resume=function(e){function t(){var e,n,r,i;_classCallCheck(this,t);for(var o=arguments.length,a=Array(o),u=0;u<o;u++)a[u]=arguments[u];return n=r=_possibleConstructorReturn(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(a))),r.components={jobDetailItem:_jobItem2.default},r.data={item:{},isShowBtn:!1,welfareList:[{icon:"../../images/company/welfare_icon1.png",title:"五险一金"},{icon:"../../images/company/welfare_icon1.png",title:"五险一金"},{icon:"../../images/company/welfare_icon1.png",title:"五险一金"},{icon:"../../images/company/welfare_icon1.png",title:"五险一金"}],resumeId:""},r.config={navigationBarTitleText:"我的简历"},r.methods={routerView:function(e){(0,_util.wxNavigateTo)("/pages/my/"+e)},bindPickerChange:function(e){this.index=e.detail.value,this.form.sex=Number(this.index)+1},eduPickerChange:function(e){this.eduIndex=e.detail.value,this.form.education=this.eduIndex},changeInput:function(e){var t=e.currentTarget.dataset.name;this.form[t]=e.detail.value},save:function(){this.updateResume()}},i=n,_possibleConstructorReturn(r,i)}return _inherits(t,e),_createClass(t,[{key:"onLoad",value:function(e){e.query&&(this.resumeId=e.query,this.$apply())}}]),t}(_wepy2.default.page);Page(require("./../../npm/wepy/lib/wepy.js").default.$createPage(resume,"pages/my/resume"));