"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function genTestUserSig(e){var s=new _libGenerateTestUsersigEsMin2.default(SDKAPPID,SECRETKEY,EXPIRETIME),r=s.genTestUserSig(e);return{sdkAppID:SDKAPPID,userSig:r}}var _libGenerateTestUsersigEsMin=require("./lib-generate-test-usersig-es.min.js"),_libGenerateTestUsersigEsMin2=_interopRequireDefault(_libGenerateTestUsersigEsMin),SDKAPPID=1400335565,EXPIRETIME=604800,SECRETKEY="62da18a3ff77f85d158fcdffc584837e5eccd2deddf4db1709b6cba5f6cc01dd";module.exports={genTestUserSig:genTestUserSig,SDKAPPID:SDKAPPID};