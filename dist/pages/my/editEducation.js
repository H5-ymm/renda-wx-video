"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var a=0;a<t.length;a++){var i=t[a];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,a,i){return a&&e(t.prototype,a),i&&e(t,i),t}}(),_wepy=require("./../../npm/wepy/lib/wepy.js"),_wepy2=_interopRequireDefault(_wepy),_dataPicker=require("./../../components/dataPicker.js"),_dataPicker2=_interopRequireDefault(_dataPicker),_http=require("./../../http.js"),_moment=require("./../../npm/moment/moment.js"),_moment2=_interopRequireDefault(_moment),_util=require("./../../util.js"),editEducation=function(e){function t(){var e,a,i,n;_classCallCheck(this,t);for(var r=arguments.length,o=Array(r),u=0;u<r;u++)o[u]=arguments[u];return a=i=_possibleConstructorReturn(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(o))),i.$repeat={},i.$props={dataPicker:{"xmlns:v-bind":"","v-bind:range.sync":"eduList","v-bind:value.sync":"eduIndex","xmlns:v-on":""}},i.$events={dataPicker:{"v-on:bindPickerChange":"bindEduChange"}},i.components={dataPicker:_dataPicker2.default},i.data={form:{faculty:"",speciality:"",graduation_date:"",school:"",edu:"",uid:""},eduList:["高中以下","高中","专科","本科","硕士"],eduIndex:-1,disabled:!1,isPicker:!0,graduation_date:"",id:""},i.methods={changeInput:function(e){var t=e.currentTarget.dataset.name;this.form[t]=e.detail.value},bindEduChange:function(e){this.form.edu=e},bindDateChange:function(e){var t=e.currentTarget.dataset.name;this.graduation_date=e.detail.value;var a=(0,_moment2.default)(e.detail.value).valueOf()+"";this.form[t]=a.substring(0,10),this.$apply()},deleteInfo:function(){var e=this;this.form.id||(0,_util.wxNavigateTo)("/pages/my/resume"),(0,_util.wxShowModal)("","确定删除你的教育背景","确定").then(function(t){e.delUseredu()}).catch(function(){console.log("取消")})},submit:function(){""!=this.form.edu?(0,_util.wxToast)("请选择学历"):this.form.graduation_date?this.form.school?this.form.faculty?this.form.speciality?this.saveUserEdu():(0,_util.wxToast)("请输入专业"):(0,_util.wxToast)("请输入院系"):(0,_util.wxToast)("请输入学校名称"):(0,_util.wxToast)("请选择毕业时间")}},n=a,_possibleConstructorReturn(i,n)}return _inherits(t,e),_createClass(t,[{key:"onLoad",value:function(e){this.form.uid=wx.getStorageSync("rendaUid")||this.$parent.globalData.uid,e.query&&(this.id=e.query,this.getEduDetail(e.query))}},{key:"delUseredu",value:function(){var e={id:this.id,uid:this.form.uid};(0,_http.$http)("/Personal/del_useredu",e).then(function(e){e.data?((0,_util.wxToast)("删除成功"),(0,_util.wxNavigateTo)("/pages/my/resume")):(0,_util.wxToast)("删除失败")})}},{key:"getEduDetail",value:function(e){var t=this,a={eid:e,uid:this.form.uid};(0,_http.$http)("/personal/eduDetail",a).then(function(e){t.form=e.data,t.eduIndex=t.form.edu,t.graduation_date=_moment2.default.unix(t.form.graduation_date).format("YYYY-MM-DD"),t.$apply()})}},{key:"saveUserEdu",value:function(){(0,_http.$http)("/Personal/save_useredu",this.form).then(function(e){e.data?((0,_util.wxToast)("保存成功"),(0,_util.wxNavigateTo)("/pages/my/resume")):(0,_util.wxToast)("保存失败")})}}]),t}(_wepy2.default.page);Page(require("./../../npm/wepy/lib/wepy.js").default.$createPage(editEducation,"pages/my/editEducation"));