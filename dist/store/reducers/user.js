"use strict";function _defineProperty(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}Object.defineProperty(exports,"__esModule",{value:!0});var _extends=Object.assign||function(e){for(var r=1;r<arguments.length;r++){var n=arguments[r];for(var t in n)Object.prototype.hasOwnProperty.call(n,t)&&(e[t]=n[t])}return e},_reduxActions=require("./../../npm/redux-actions/lib/index.js"),_user=require("./../types/user.js"),loginUser={};exports.default=(0,_reduxActions.handleActions)(_defineProperty({},_user.GETALLUSER,function(e,r){return _extends({},e,{loginUser:r.payload})}),loginUser);