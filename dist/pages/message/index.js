"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),_wepy=require("./../../npm/wepy/lib/wepy.js"),_wepy2=_interopRequireDefault(_wepy),_http=require("./../../http.js"),_util=require("./../../util.js"),message=function(e){function t(){var e,r,i,n;_classCallCheck(this,t);for(var a=arguments.length,o=Array(a),s=0;s<a;s++)o[s]=arguments[s];return r=i=_possibleConstructorReturn(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(o))),i.data={teamData:{},rendaUserTeamType:0,params:{uid:""},list:[{header_img:"",com_read:1,job_name:"前端开发",view_time:1532384e3,user_name:"杨萌萌",com_name:"仁达"}],count:0},i.config={navigationBarTitleText:"消息管理"},i.computed={urlApi:function(){return 1==this.usertype?"/personinfo/getcom_msglist":"/personinfo/getMsg"},newList:function(){return(0,_util.getList)(this.list,"view_time","YYYY-MM-DD HH:mm")}},i.methods={viewMessage:function(e){1==this.usertype?(0,_util.wxNavigateTo)("/pages/message/dialogBox?query="+e.id):(0,_util.wxNavigateTo)("/pages/message/personalDialogBox?query="+e.id)},searchScrollLower:function(){this.count>this.list.length&&this.count>this.params.limit&&(this.params.limit=this.params.limit+10,this.getMsglist())}},n=r,_possibleConstructorReturn(i,n)}return _inherits(t,e),_createClass(t,[{key:"onLoad",value:function(){this.usertype=wx.getStorageSync("rendaUserType"),1==this.usertype&&(this.tabBarIndex=2),this.$apply(),this.params.uid=wx.getStorageSync("rendaUid")||this.$parent.globalData.uid}},{key:"onShow",value:function(){}},{key:"getMsglist",value:function(){var e=this;(0,_http.$http)(this.urlApi,this.params).then(function(t){e.list=t.data.data||[],e.list.forEach(function(e){e.logo_url&&(e.logo_url=(0,_util.getImgUrl)(e.logo_url))}),e.count=t.data.count,e.$apply()})}}]),t}(_wepy2.default.page);Page(require("./../../npm/wepy/lib/wepy.js").default.$createPage(message,"pages/message/index"));