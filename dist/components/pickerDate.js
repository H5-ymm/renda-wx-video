"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),_wepy=require("./../npm/wepy/lib/wepy.js"),_wepy2=_interopRequireDefault(_wepy),_http=require("./../http.js"),pickerModal=function(e){function t(){var e,n,r,o;_classCallCheck(this,t);for(var i=arguments.length,s=Array(i),a=0;a<i;a++)s[a]=arguments[a];return n=r=_possibleConstructorReturn(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(s))),r.props={isScaleModal:Boolean,height:{type:Number,default:520},list:Array},r.data={isShow:!1,activeIndex:[],rendaUserType:0,years:[],year:"",months:[],month:2,days:[],day:2,value:[9999,1,1]},r.methods={bindChange:function(e){var t=e.detail.value;console.log(t)},handleClose:function(){this.isShow=!1,this.$apply(),this.$emit("handleClose")},selectType:function(e){this.activeIndex=e,this.$apply()},handleOk:function(){this.isShow=!1,this.$apply(),this.$emit("selectOk",this.activeIndex)}},r.watch={rendaUserType:function(e){e&&("切换团队"==this.menus[0].title?this.activeIndex=2===e?1:0:this.activeIndex=0,this.$apply())},isScaleModal:function(e){e?(this.activeIndex=0,this.isShow=!1):this.isShow=!0,this.$apply()}},o=n,_possibleConstructorReturn(r,o)}return _inherits(t,e),_createClass(t,[{key:"onLoad",value:function(){for(var e=new Date,t=1990;t<=e.getFullYear();t++)this.years.push(t);for(var n=1;n<=12;n++)this.months.push(n);for(var r=1;r<=31;r++)this.days.push(r)}}]),t}(_wepy2.default.component);exports.default=pickerModal;