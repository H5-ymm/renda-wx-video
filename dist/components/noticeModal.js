"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _wepy=require("./../npm/wepy/lib/wepy.js"),_wepy2=_interopRequireDefault(_wepy),_datePicker=require("./datePicker.js"),_datePicker2=_interopRequireDefault(_datePicker),_districtSelet=require("./districtSelet.js"),_districtSelet2=_interopRequireDefault(_districtSelet),_moment=require("./../npm/moment/moment.js"),_moment2=_interopRequireDefault(_moment),noticeModal=function(t){function e(){var t,i,s,o;_classCallCheck(this,e);for(var r=arguments.length,n=Array(r),a=0;a<r;a++)n[a]=arguments[a];return i=s=_possibleConstructorReturn(this,(t=e.__proto__||Object.getPrototypeOf(e)).call.apply(t,[this].concat(n))),s.props={isScaleModal:Boolean,height:Number,title:String,type:String,timeInfo:Object},s.$repeat={},s.$props={datePicker:{bindsetDate:"setDate","xmlns:v-bind":"","v-bind:date.sync":"time"},districtSelet:{bindselectCityText:"selectCityText",bindselectCity:"selectCity","v-bind:address.sync":"addressList","v-bind:disabled.sync":"disabled",class:"modal-col"}},s.$events={},s.components={datePicker:_datePicker2.default,districtSelet:_districtSelet2.default},s.data={isShow:!1,form:{content:"",address:"",time:""},address:"",disabled:!0,addressList:[],time:"",statusObj:{}},s.events={setDate:function(t){s.form.time=t},selectCityText:function(t){s.address=t},selectCity:function(t){s.addressList=t}},s.methods={changeInput:function(t){var e=t.currentTarget.dataset.name;this.form[e]=t.detail.value},handleClose:function(){this.isShow=!1,this.$apply(),this.$emit("handleClose")},handleOk:function(){this.isShow=!1,this.$apply();var t={};if(console.log(this.type),console.log(this.form.time),1==this.type){var e="";-1==this.form.time.toString().indexOf("-")?e=this.form.time:(e=(0,_moment2.default)(this.form.time).valueOf()+"",e=e.substr(0,10)),t={time:e,content:this.address+"/"+this.form.address+"&"+this.form.content,provindeid:this.addressList[0],cityid:this.addressList[1],threecity:this.addressList[2]}}else console.log(this.form.time),t={view_time:this.form.time,content:this.form.content,room_num:this.form.time,room_name:wx.getStorageSync("phone"),type:1};this.$emit("setAllTime",t)}},s.watch={timeInfo:function(t){if(t&&t.content){-1==t.time.toString().indexOf("-")?this.form.time=_moment2.default.unix(t.time).format("YYYY-MM-DD HH:mm"):this.form.time=t.time,t.provinceid&&(this.addressList=[t.provinceid,t.cityid,t.three_cityid]),this.time=this.form.time;var e=t.content.split("&");this.form.content=e[1];var i=e[0].split("/");this.address=i[0]+"/"+i[1]+"/"+i[2],this.form.detailAddress=i[3],this.$apply()}},isScaleModal:function(t){this.isShow=!t,this.$apply()}},o=i,_possibleConstructorReturn(s,o)}return _inherits(e,t),e}(_wepy2.default.component);exports.default=noticeModal;