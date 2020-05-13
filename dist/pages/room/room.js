import { genTestUserSig } from '../../debug/GenerateTestUserSig.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rtcConfig: {
      sdkAppID: 1400335565, // 必要参数 开通实时音视频服务创建应用后分配的 sdkAppID
      userID: '', // 必要参数 用户 ID 可以由您的帐号系统指定
      userSig: '', // 必要参数 身份签名，相当于登录密码的作用
      template: 'grid', // 必要参数 组件模版，支持的值 1v1 grid custom ，注意：不支持动态修改, iOS 不支持 pusher 动态渲染
      debugMode: true,
      cloudenv: 'PRO',
      frontCamera: 'front',
      localVideo: true,
      localAudio: true,
      enableEarMonitor: false,
      enableAutoFocus: true,
      localMirror: 'auto',
      enableAgc: true,
      enableAns: true,
      encsmall: 1,
      videoHeight: 640,
      videoWidth: 360,
      scene: 'rtc',
      maxBitrate: 900,
      minBitrate: 600,
      beautyLevel: 9,
      enableIM: false
    },
    showTipToast: false,
    args: '',
    message: {},
    type: '',
    from: '',
    to: '',
    timeoutId: '',
    startTime: 0,
    isPending: true,
    isCalling: false,
    option: {}
  },
  handleCloseRoom() {
    this.closeVedio(2)
  },
  handleRefuse() {
    this.closeVedio(1)
  },
  closeVedio(type) {
    let obj = Object.assign(this.data.message, { type })
    let rtcConfig = this.data.rtcConfig
    rtcConfig.enableIM = true
    this.setData({
      isPending: false,
      isCalling: false,
      rtcConfig: rtcConfig,
      message: obj
    })
  },
  enterRoom: function () {
    let rtcConfig = this.data.rtcConfig
    rtcConfig.enableIM = true
    this.setData({
      isCalling: true,
      rtcConfig: rtcConfig
    }, () => {
      this.trtcComponent.enterRoom({ roomID: Number(this.data.rtcConfig.roomID) }).then(() => {
        if (this.template === 'custom') {
          // 设置推流端视窗的坐标和尺寸
          this.trtcComponent.setViewRect({
            userID: params.userID,
            xAxis: '480rpx',
            yAxis: '160rpx',
            width: '240rpx',
            height: '320rpx',
          })
        }
      }).catch((res) => {
        console.error('* room joinRoom 进房失败:', res)
      })
    })
  },
  bindTRTCRoomEvent: function () {
    const TRTC_EVENT = this.trtcComponent.EVENT
    this.timestamp = []
    // 初始化事件订阅
    this.trtcComponent.on(TRTC_EVENT.LOCAL_JOIN, (event) => {
      console.log('* room LOCAL_JOIN', event)
      // 进房成功，触发该事件后可以对本地视频和音频进行设置
      if (this.options.localVideo === true || this.options.template === '1v1') {
        this.trtcComponent.publishLocalVideo()
      }
      if (this.options.localAudio === true || this.options.template === '1v1') {
        this.trtcComponent.publishLocalAudio()
      }
    })
    this.trtcComponent.on(TRTC_EVENT.LOCAL_LEAVE, (event) => {
      console.log('* room LOCAL_LEAVE', event)
    })
    this.trtcComponent.on(TRTC_EVENT.ERROR, (event) => {
      console.log('* room ERROR', event)
    })
    // 远端用户进房
    this.trtcComponent.on(TRTC_EVENT.REMOTE_USER_JOIN, (event) => {
      console.log('* room REMOTE_USER_JOIN', event, this.trtcComponent.getRemoteUserList())
      this.timestamp.push(new Date())
    })
    // 远端用户退出
    this.trtcComponent.on(TRTC_EVENT.REMOTE_USER_LEAVE, (event) => {
      console.log('远端用户退出了')
      console.log('* room REMOTE_USER_LEAVE', event, this.trtcComponent.getRemoteUserList())
      if (this.template === '1v1') {
        this.timestamp = []
      }
      if (this.template === '1v1' && this.remoteUser === event.data.userID) {
        this.remoteUser = null
      }
    })
    // 远端用户推送视频
    this.trtcComponent.on(TRTC_EVENT.REMOTE_VIDEO_ADD, (event) => {
      console.log('* room REMOTE_VIDEO_ADD', event, this.trtcComponent.getRemoteUserList())
      // 订阅视频
      const userList = this.trtcComponent.getRemoteUserList()
      const data = event.data
      if (this.template === '1v1' && (!this.remoteUser || this.remoteUser === data.userID)) {
        // 1v1 只订阅第一个远端流
        this.remoteUser = data.userID
        this.trtcComponent.subscribeRemoteVideo({
          userID: data.userID,
          streamType: data.streamType,
        })
      } else if (this.template === 'grid') {
        this.trtcComponent.subscribeRemoteVideo({
          userID: data.userID,
          streamType: data.streamType,
        })
      }
      if (this.template === 'custom' && data.userID && data.streamType) {
        let index = userList.findIndex((item) => {
          return item.userID === data.userID
        })
        index++
        const y = 320 * index + 160
        // 设置远端视图坐标和尺寸
        this.trtcComponent.setViewRect({
          userID: data.userID,
          streamType: data.streamType,
          xAxis: '480rpx',
          yAxis: y + 'rpx',
          width: '240rpx',
          height: '320rpx',
        })
      }
    })
    // 远端用户取消推送视频
    this.trtcComponent.on(TRTC_EVENT.REMOTE_VIDEO_REMOVE, (event) => {
      console.log('* room REMOTE_VIDEO_REMOVE', event, this.trtcComponent.getRemoteUserList())
    })
    // 远端用户推送音频
    this.trtcComponent.on(TRTC_EVENT.REMOTE_AUDIO_ADD, (event) => {
      console.log('* room REMOTE_AUDIO_ADD', event, this.trtcComponent.getRemoteUserList())
      // 订阅音频
      const data = event.data
      if (this.template === '1v1' && (!this.remoteUser || this.remoteUser === data.userID)) {
        this.remoteUser = data.userID
        this.trtcComponent.subscribeRemoteAudio({ userID: data.userID })
      } else if (this.template === 'grid' || this.template === 'custom') {
        this.trtcComponent.subscribeRemoteAudio({ userID: data.userID })
      }
      // 如果不订阅就不会自动播放音频
      // this.trtcComponent.subscribeRemoteAudio({ userID: data.userID })
    })
    // 远端用户取消推送音频
    this.trtcComponent.on(TRTC_EVENT.REMOTE_AUDIO_REMOVE, (event) => {
      console.log('* room REMOTE_AUDIO_REMOVE', event, this.trtcComponent.getRemoteUserList())
    })
    this.trtcComponent.on(TRTC_EVENT.IM_SDK_READY, (event) => {
      console.log('* room IM_SDK_READY', event)
    })
    this.trtcComponent.on(TRTC_EVENT.IM_MESSAGE_RECEIVED, (event) => {
      console.log('* room IM_MESSAGE_RECEIVED', event)
      event.data.data.forEach(item => {
        if (item.type == 'TIMCustomElem') {
          let userinfo = JSON.parse(item._elements[0].content.data)
          console.log(item)
          console.log(userinfo)
          console.log(this.data.option)
          let action = userinfo.action
          if (action == 4) {
            console.log(action)
            // let viewdeoInfo = {
            //   roomID: Number(userinfo.room_id),
            //   userID: options.from, // 必要参数 用户 ID 可以由您的帐号系统指定
            // }
            // let query = Object.assign(this.data.rtcConfig, viewdeoInfo)
            this.enterRoom()
          }
        } 
      })
    })
  },
  randomUserID: function () {
    return new Date().getTime().toString(16).split('').reverse().join('')
  },
  randomRoomID: function () {
    return parseInt(Math.random() * 9999)
  },
  /**
   * 生命周期函数--监听页面加载
   * @param {*} options 配置项
   */
  setInit(options) {
    let type = (options.userID === options.fromId) ? 'call' : 'onCall'
    let obj = {
      args: options.args,
      from: options.fromId,
      to: options.to,
      startTime: new Date().getTime(),
      type: ''
    }
    let viewdeoInfo = {
      roomID: Number(options.roomID),
      userID: options.userID, // 必要参数 用户 ID 可以由您的帐号系统指定
      userSig: options.userSig //
    }
    let query = Object.assign(this.data.rtcConfig, viewdeoInfo)
    this.setData({
      rtcConfig: query,
      message: obj,
      type: type,
      isCalling: false,
      isPending: true,
      startTime: new Date().getTime(),
      option: options
    })
  },
  receive() {
    // this.options = this.data.option
    this.enterRoom()
  },
  onLoad: function (options) {
    console.log('room onload', options)
    wx.setKeepScreenOn({
      keepScreenOn: true,
    })
    // 获取 rtcroom 实例
    this.trtcComponent = this.selectComponent('#trtc-component')
    // 监听TRTC Room 关键事件
    this.bindTRTCRoomEvent()
    this.setInit(options)
    // if (options.args && JSON.parse(options.args).action == 4) {
    //   this.receive()
    // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('room ready')
    wx.setKeepScreenOn({
      keepScreenOn: true,
    })
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    console.log('room show')
    if (this.data.userID === this.data.from) {
      this.data.timeoutId = setTimeout(() => {
        this.timeout()
      }, 60000)
    }
    wx.setKeepScreenOn({
      keepScreenOn: true,
    })
  },
  
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('room hide')
    wx.setStorageSync('setSdkReady', false)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('room unload')
    // wx.setKeepScreenOn({
    //   keepScreenOn: false,
    // })
    wx.setStorageSync('setSdkReady', false)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})

