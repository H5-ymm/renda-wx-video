"use strict";var _util=require("./util.js"),baseUrl="http://www.ttxsg.com.cn:39009/",apiUrl=baseUrl+"wx.php",http=function(t,e,a){return new Promise(function(o,i){wx.request({url:""+apiUrl+t,data:e,header:{"Content-Type":"application/x-www-form-urlencoded"},method:a||"POST",success:function(t){if(200===t.statusCode)if(200===t.data.status.code)o(t.data);else if(4e3===t.data.status.code||6100===t.data.status.code)(0,_util.wxToast)(t.data.status.remind),setTimeout(function(){wx.redirectTo({url:"/pages/login/welcome"})},300);else{var e=t.data.status.remind?t.data.status.remind:"没有信息";(0,_util.wxToast)(e)}else(0,_util.wxToast)("请求失败")},fail:function(t){(0,_util.wxToast)("网络失败"),i(t)}}).onHeadersReceived(function(t){})})},uploadFile=function(t){return new Promise(function(e,a){wx.uploadFile({url:apiUrl+"/Constant/moreupload",filePath:t[0],name:"image",success:function(t){t.data&&e(JSON.parse(t.data))},fail:function(t){a(t)}})})},uploadFileVideo=function(t){return console.log(t),new Promise(function(e,a){wx.uploadFile({url:apiUrl+"/uploadimg/moreupload",filePath:t[0],name:"image",success:function(t){console.log(t),t.data&&e(JSON.parse(t.data))},fail:function(t){a(t)}})})};module.exports={$http:http,uploadFile:uploadFile,uploadFileVideo:uploadFileVideo};