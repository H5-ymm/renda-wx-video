"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}var _moment=require("./npm/moment/moment.js"),_moment2=_interopRequireDefault(_moment),manglingFormatCardNumber=function(e){return e&&e.length>8?e.substring(0,4)+" "+"*".repeat(e.length-8).replace(/(.{4})/g,"\n        $1 ")+(e.length%4?" ":"")+e.slice(-4):e},validateIdCard=function(e){var t=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;return!!t.test(e)},checkMobile=function(e){var t=/^1[3456789]\d{9}$/;return!!t.test(e)},getErrorTip=function(e){var t="联系客服人员：021-51991869，\n 微信：18621532378 QQ：529350865",r={title:"",subTitle:""};switch(e){case 6001:r.title="您还没有注册哦",r.subTitle="亲！您还不是团队成员或企业，请前往 www.rsd123.com 进行注册申请，\n或"+t;break;case 6002:r.title="仅允许团队成员查看",r.subTitle=t;break;case 6006:case 6010:r.title="账号审核中需要1-2工作日",r.subTitle=t;break;case 6007:r.title="您的团队审核未通过哦",r.subTitle=t;break;case 6008:r.title="团队信息未完善",r.subTitle="亲！您的团队信息未完善，请前往 www.rsd123.com 进行完善，\n或"+t;break;case 1009:r.title="您的团队账号被锁定",r.subTitle=t;break;default:r={title:"",subTitle:""}}return r},getImgUrl=function(e){return"http://www.ttxsg.com.cn:39009/"+e},compressImg=function(e){var t=(arguments.length>1&&void 0!==arguments[1]&&arguments[1],{url:"",cWidth:0,cHeight:""});return new Promise(function(r,a){wx.getImageInfo({src:e,success:function(e){var a=this,n=e.width,i=e.height;n=300,i=200,t.cWidth=n+100,t.cHeight=i+100;var o=wx.createCanvasContext("canvas");o.drawImage(e.path,0,0,n,i),o.draw(!1,setTimeout(function(){wx.canvasToTempFilePath({canvasId:"canvas",destWidth:n,destHeight:i,success:function(e){console.log(e.tempFilePath),t.url=e.tempFilePath,r(t)},fail:function(e){console.log(e.errMsg)}},a)},100))},fail:function(e){console.log(e.errMsg)}})})},wxToast=function(e){return wx.showToast({title:e,icon:"none",duration:2e3})},wxNavigateTo=function(e){setTimeout(function(){wx.navigateTo({url:e})},300)},wxRedirectTo=function(e){setTimeout(function(){wx.redirectTo({url:e})},300)},wxReLaunch=function(e){setTimeout(function(){wx.reLaunch({url:e})},300)},getArray=function(e){var t=[];for(var r in e)t.push(e[r]);return t},getKeyValue=function(e){for(var t in e)"job_array"===t&&(e[t]=getArray(e[t]));return e},weekList=function(){for(var e=[],t=1;t<8;t++)e.push(replaceWeek(t));return e},replaceWeek=function(e){var t="";switch(e){case 1:t="周一";break;case 2:t="周二";break;case 3:t="周三";break;case 4:t="周四";break;case 5:t="周五";break;case 6:t="周六";break;case 7:t="周日";break;default:t=""}return t},ageList=function(){for(var e=[],t=16;t<66;t++)e.push(t);return e},rewardTypeText=function(){var e="";switch(number){case 1:e="时";break;case 2:e="日";break;case 3:e="月";break;default:e=""}return"元/人/"+e},wxShowModal=function(e,t,r){return new Promise(function(a,n){wx.showModal({title:e||"操作提示",content:t,confirmText:r||"确定",cancelColor:"#666666",confirmColor:"#1890FF",success:function(e){e.confirm?a():e.cancel&&n()}})})},getList=function(e,t,r){var a=r||"YYYY-MM-DD";return e.map(function(e){var r=void 0,n=/^[0-9]+.?[0-9]*$/;return e[t]&&n.test(e[t])&&(r=!0),e[t]=r?_moment2.default.unix(e[t]).format(a):(0,_moment2.default)(e[t]).format(a),e})};module.exports={manglingFormatCardNumber:manglingFormatCardNumber,validateIdCard:validateIdCard,checkMobile:checkMobile,getErrorTip:getErrorTip,getImgUrl:getImgUrl,wxToast:wxToast,compressImg:compressImg,wxNavigateTo:wxNavigateTo,wxRedirectTo:wxRedirectTo,wxReLaunch:wxReLaunch,getArray:getArray,getKeyValue:getKeyValue,weekList:weekList,ageList:ageList,rewardTypeText:rewardTypeText,wxShowModal:wxShowModal,getList:getList};