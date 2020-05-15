"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),_dec,_class,_wepy=require("./../../npm/wepy/lib/wepy.js"),_wepy2=_interopRequireDefault(_wepy),_districtSelet=require("./../../components/districtSelet.js"),_districtSelet2=_interopRequireDefault(_districtSelet),_welfareModal=require("./../../components/welfareModal.js"),_welfareModal2=_interopRequireDefault(_welfareModal),_dataPicker=require("./../../components/dataPicker.js"),_dataPicker2=_interopRequireDefault(_dataPicker),_util=require("./../../util.js"),_http=require("./../../http.js"),_wepyRedux=require("./../../npm/wepy-redux/lib/index.js"),store=(0,_wepyRedux.getStore)(),companyForm=(_dec=(0,_wepyRedux.connect)({list:function(e){return e.contant.list}}))(_class=function(e){function t(){var e,n,a,i;_classCallCheck(this,t);for(var r=arguments.length,o=Array(r),s=0;s<r;s++)o[s]=arguments[s];return n=a=_possibleConstructorReturn(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(o))),a.$repeat={},a.$props={welfareModal:{"v-bind:isScaleModal.sync":"isModal",bindhandleBenefitOk:"handleBenefitOk"},districtSelet:{"xmlns:v-bind":"","v-bind:address.sync":"address","v-bind:disabled.sync":"disabled",bindselectCity:"selectCity"},dataPicker:{"v-bind:range.sync":"com_type","v-bind:value.sync":"comIndex",text:"请选择企业性质"},dataTradesPicker:{"v-bind:range.sync":"job_array","v-bind:value.sync":"jobIndex",text:"请选择从事行业","xmlns:v-on":""},dataScalePicker:{"v-bind:range.sync":"com_scale","v-bind:value.sync":"comScaleIndex",text:"请选择企业规模"}},a.$events={dataPicker:{"v-on:bindPickerChange":"bindChange"},dataTradesPicker:{"v-on:bindPickerChange":"bindTradesChange"},dataScalePicker:{"v-on:bindPickerChange":"bindScaleChange"}},a.components={welfareModal:_welfareModal2.default,districtSelet:_districtSelet2.default,dataPicker:_dataPicker2.default,dataTradesPicker:_dataPicker2.default,dataScalePicker:_dataPicker2.default},a.data={form:{com_name:"",address:"",province:"",city:"",area:"",trades:"",nature:"",scale:"",link_tel:"",link_man:"",email:"",content:"",license_url:"",id:"",uid:"",benefits:""},isModal:!0,infoImg:"",disabled:!0,address:[],com_type:[],com_scale:[],job_array:[],jobIndex:-1,comIndex:-1,comScaleIndex:-1,benefits:"",benefitsArr:[],uid:""},a.config={navigationBarTitleText:"企业信息"},a.events={selectCity:function(e){a.form.province=e[0]?e[0]:0,a.form.city=e[1]?e[1]:0,a.form.area=e[2]?e[2]:0},handleBenefitOk:function(e){a.benefits=e.benefitsNameList,a.form.benefits=e.idList,a.$apply()}},a.methods={selectBenefits:function(){this.isModal=!this.isModal,this.$apply()},uploadImg:function(){var e=this;wx.chooseImage({sizeType:["compressed"],success:function(t){(0,_util.compressImg)(t.tempFilePaths[0]).then(function(t){e.getImg([t.url])})}})},changeInput:function(e){var t=e.currentTarget.dataset.name;this.form[t]=e.detail.value},bindTradesChange:function(e){this.form.trades=Number(e)+1},bindChange:function(e){this.form.nature=Number(e)+1},bindScaleChange:function(e){this.form.scale=Number(e)+1},save:function(){this.form.com_name?this.form.province?this.form.trades?this.form.nature?this.form.scale?this.form.benefits?this.form.content?this.form.link_man?this.form.link_tel?(0,_util.checkMobile)(this.form.link_tel)?this.updateCompany():(0,_util.wxToast)("请输入正确的手机号码"):(0,_util.wxToast)("请输入手机号码"):(0,_util.wxToast)("请输入联系人"):(0,_util.wxToast)("请输入企业简介"):(0,_util.wxToast)("请选择企业福利"):(0,_util.wxToast)("请选择企业规模"):(0,_util.wxToast)("请选择企业性质"):(0,_util.wxToast)("请选择所属行业"):(0,_util.wxToast)("请选择所属区域"):(0,_util.wxToast)("请输入公司名称")}},i=n,_possibleConstructorReturn(a,i)}return _inherits(t,e),_createClass(t,[{key:"onLoad",value:function(){this.uid=wx.getStorageSync("rendaUid")||this.$parent.globalData.uid;var e=store.getState().contant.list;for(var t in e)this[t]=e[t];this.getCompanyInfo(),this.$apply()}},{key:"getCompanyInfo",value:function(){var e=this;(0,_http.$http)("/Company/getcompanyinfobyuid",{uid:this.uid}).then(function(t){var n=t.data;for(var a in n)e.form[a]=n[a];e.benefitsArr=n.benefits.filter(function(e){return e&&e.trim()}),e.$broadcast("getBenefitsArr",e.benefitsArr),e.infoImg="null"==n.license_url?"":n.license_url,e.form.benefits="",e.jobIndex=e.form.trades?Number(e.form.trades)-1:"",e.comIndex=e.form.nature?Number(e.form.nature)-1:"",e.comScaleIndex=e.form.scale?Number(e.form.scale)-1:"",n.province&&(e.address=[n.province,n.city,n.area]),e.$apply()})}},{key:"getImg",value:function(e){var t=this;(0,_http.uploadFile)(e).then(function(e){e.data&&e.data.url?(t.infoImg=(0,_util.getImgUrl)(e.data.url),t.form.license_url=t.infoImg,t.$apply()):(0,_util.wxToast)("图片获取失败")})}},{key:"updateCompany",value:function(){this.form.uid=wx.getStorageSync("rendaUid"),(0,_http.$http)("/Company/save_company",this.form).then(function(e){e.data?((0,_util.wxToast)("修改成功"),wx.setStorageSync("rendaPerfect",1),(0,_util.wxReLaunch)("/pages/my/index")):(0,_util.wxToast)("修改失败")})}}]),t}(_wepy2.default.page))||_class;Page(require("./../../npm/wepy/lib/wepy.js").default.$createPage(companyForm,"pages/my/companyForm"));