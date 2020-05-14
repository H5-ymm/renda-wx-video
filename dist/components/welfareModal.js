"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _createClass=function(){function e(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}}(),_wepy=require("./../npm/wepy/lib/wepy.js"),_wepy2=_interopRequireDefault(_wepy),_http=require("./../http.js"),welfareModal=function(e){function t(){var e,i,n,s;_classCallCheck(this,t);for(var o=arguments.length,r=Array(o),a=0;a<o;a++)r[a]=arguments[a];return i=n=_possibleConstructorReturn(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(r))),n.props={isScaleModal:Boolean},n.data={isShow:!1,idList:[],benefitsNameList:[],benefitsList:[]},n.events={getBenefitsArr:function(e){n.idList=e,n.$apply()}},n.methods={handleClose:function(){this.isShow=!1,this.$apply(),this.$emit("handleClose")},handleBenefitOk:function(){this.isShow=!1,this.$apply();var e={benefitsNameList:this.benefitsNameList.join(","),idList:this.idList.join(",")};this.$emit("handleBenefitOk",e)},selectBenefit:function(e,t){if(this.benefitsList[t].disabled=!e.disabled,-1===this.idList.indexOf(e.id))this.idList.push(e.id),this.benefitsNameList.push(e.title);else{var i=this.idList.findIndex(function(t){return t===e.id});this.idList.splice(i,1),this.benefitsNameList.splice(i,1)}this.idList=Array.from(new Set(this.idList)),this.$apply()}},n.watch={isScaleModal:function(e){this.isShow=!e,this.$apply()}},s=i,_possibleConstructorReturn(n,s)}return _inherits(t,e),_createClass(t,[{key:"getBenefitsList",value:function(){var e=this;(0,_http.$http)("/Constant/getBenefitsList",{}).then(function(t){var i=t.data;if(e.idList.length){e.idList.forEach(function(t){i.forEach(function(i){Number(t)==i.id&&(i.disabled=!0,e.benefitsNameList.push(i.title),e.$apply())})});var n={benefitsNameList:e.benefitsNameList.join(","),idList:e.idList.join(",")};e.$emit("handleBenefitOk",n)}e.benefitsList=i.map(function(e){return e.disabled=!1,e}),e.$apply()})}},{key:"onLoad",value:function(){this.getBenefitsList()}}]),t}(_wepy2.default.component);exports.default=welfareModal;