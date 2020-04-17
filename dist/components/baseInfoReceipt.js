"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _createClass=function(){function e(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}}(),_dec,_class,_wepy=require("./../npm/wepy/lib/wepy.js"),_wepy2=_interopRequireDefault(_wepy),_districtSelet=require("./districtSelet.js"),_districtSelet2=_interopRequireDefault(_districtSelet),_http=require("./../http.js"),_util=require("./../util.js"),_base=require("./../base/base.js"),_wepyRedux=require("./../npm/wepy-redux/lib/index.js"),store=(0,_wepyRedux.getStore)(),baseInfoReceipt=(_dec=(0,_wepyRedux.connect)({list:function(e){return e.contant.list}}))(_class=function(e){function t(){var e,i,n,r;_classCallCheck(this,t);for(var o=arguments.length,a=Array(o),s=0;s<o;s++)a[s]=arguments[s];return i=n=_possibleConstructorReturn(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(a))),n.$repeat={},n.$props={districtSelet:{bindselectCity:"selectCity","xmlns:v-bind":"","v-bind:address.sync":"[]","v-bind:disabled.sync":"disabled"}},n.$events={},n.components={districtSelet:_districtSelet2.default},n.data={array:["男","女","男女不限"],ageArray:[],moneyTypeList:_base.moneyTypeList,index:2,eduIndex:0,ageIndex:[0,0],moneyIndex:0,moneyTypeIndex:0,jobIndex:0,form:{name:"",required_number:2,address:"",education:0,sex:3,provinceid:"",cityid:"",three_cityid:"",job_content:"",money_type:"",money:"",min_age:"",max_age:"",job_type:"",uid:wx.getStorageSync("rendaUid")},disabled:!0,modalHeight:560,modalObj:{title:"",subTitle:"",imgBg:"https://a.rsd123.com/image/images/modalIcon.png"},isModal:!0,money_array:[],job_array:[],edu_type:[]},n.config={navigationBarTitleText:"基本信息"},n.props={typeBtn:Number},n.events={selectCity:function(e){n.form.provinceid=e[0]?e[0]:0,n.form.cityid=e[1]?e[1]:0,n.form.three_cityid=e[2]?e[2]:0},handleOk:function(){this.isModal=!0,this.$apply(),(0,_util.wxReLaunch)("/pages/login/welcome")}},n.methods={bindPickerChange:function(e){var t=e.currentTarget.dataset.name,i=e.detail.value;if("money_type"===t)this.moneyTypeIndex=i,this.form[t]=Number(i)+1;else if("sex"===t)this.index=i,this.form[t]=Number(this.index)+1;else if("age"===t)this.ageIndex=i,this.form[t]=this.ageList[this.ageIndex];else if("money_type"===t)this.moneyTypeIndex=i,this.form.money="",this.form[t]=this.moneyTypeList[this.moneyTypeIndex].value;else if("money"===t){if(0===this.form.money_type)return(0,_util.wxToast)("请选择薪资类型");this.moneyIndex=i,this.form[t]=Number(i)+1}else this.eduIndex=i,this.form[t]=i;this.$apply()},bindMultiPickerChange:function(e){this.ageIndex=e.detail.value;var t=this.ageArray[0][this.ageIndex[0]],i=this.ageArray[1][this.ageIndex[1]];if(Number(t)>Number(i))return this.ageIndex=[0,0],(0,_util.wxToast)("最大值不能小于最小值");this.form.min_age=t,this.form.max_age=i,this.$apply()},bindMultiPickerColumnChange:function(e){this.ageIndex[e.detail.column]=e.detail.value,0===e.detail.column?this.ageIndex=[e.detail.value,0,0]:this.ageIndex[1]=e.detail.value,this.$apply()},cancelPickerChange:function(e){this.ageIndex=[0,0],this.form.min_age="",this.form.max_age="",this.$apply()},changeInput:function(e){var t=e.currentTarget.dataset.name;this.form[t]=e.detail.value},save:function(){if(this.form.name)if(""===this.form.job_type)(0,_util.wxToast)("请选择职位类别");else if(this.form.required_number)if(this.form.provinceid)if(this.form.min_age||this.form.max_age)if(this.form.money_type)if(""===this.form.money)(0,_util.wxToast)("请设置薪资");else if(this.form.job_content)if(this.form.job_content.length<30)(0,_util.wxToast)("职位描述不少于30个字");else{var e=JSON.stringify(this.form);(0,_util.wxNavigateTo)("/pages/company/ceateMoreList?query="+e)}else(0,_util.wxToast)("请输入职位描述");else(0,_util.wxToast)("请选择薪资类型");else(0,_util.wxToast)("请选择年龄");else(0,_util.wxToast)("请选择地区");else(0,_util.wxToast)("请输入需求人数");else(0,_util.wxToast)("请输入职位名称")}},r=i,_possibleConstructorReturn(n,r)}return _inherits(t,e),_createClass(t,[{key:"onLoad",value:function(){var e=store.getState().contant.list;for(var t in e)this[t]=e[t];this.ageArray=[(0,_util.ageList)(),(0,_util.ageList)()],this.$apply()}},{key:"onShow",value:function(){wx.getStorageSync("preForm")&&(this.form=JSON.parse(wx.getStorageSync("preForm")),this.$apply())}},{key:"registerTeam",value:function(){var e=this;this.form.uid=wx.getStorageSync("rendaUid"),(0,_http.$http)("/login/teamRegister",this.form).then(function(t){if(t.data){var i=(0,_util.getErrorTip)(6006);e.modalObj.title=i.title,e.modalObj.subTitle=i.subTitle,e.isModal=!1,e.$apply()}else(0,_util.wxToast)("注册失败")})}}]),t}(_wepy2.default.component))||_class;exports.default=baseInfoReceipt;