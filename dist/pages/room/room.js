import { genTestUserSig } from '../../debug/GenerateTestUserSig.js'
const ERROR_OPEN_CAMERA = -4 // 打开摄像头失败
const ERROR_OPEN_MIC = -5 // 打开麦克风失败
const ERROR_PUSH_DISCONNECT = -6 // 推流连接断开
const ERROR_CAMERA_MIC_PERMISSION = -7 // 获取不到摄像头或者麦克风权限
const ERROR_EXCEEDS_THE_MAX_MEMBER = -8 // 超过最大成员数
const ERROR_REQUEST_ROOM_SIG = -9 // 获取房间SIG错误
const ERROR_JOIN_ROOM = -10 // 进房失败
import TIM from '../../lib/tim-wx.js'
const tim = TIM.create({
  SDKAppID: 1400335565
})
tim.setLogLevel(0)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    args: {},
    closeFlag: false,
    refuseFlag: false,
    isPending: true,
    isCalling: false,
    frontCamera: false,
    beauty: 0,
    muted: false,
    timeStamp: 0,
    sdkAppID: 1400335565,
    userSig: '',
    userID: '',
    roomID: 0,
    type: '',
    from: '',
    to: '',
    timeoutId: '',
    startTime: 0
  },
  onShow() {
    // 初始化参数
    const loginOptions = genTestUserSig(this.data.userID)
    this.setData({
      userSig: loginOptions.userSig,
      // isCalling: false,
      isPending: true
    })
    // 发起方发起通话，1分钟超时时间
    if (this.data.userID === this.data.from) {
      this.data.timeoutId = setTimeout(() => {
        this.timeout()
      }, 60000)
    }
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    // this.$store.commit('setCalling', true)
  },
  onUnload() {
    if (!(this.data.refuseFlag || this.data.closeFlag)) {
      if (this.data.isCalling) {
        this.closeRoom()
      } else {
        if (this.data.type === 'call') {
          this.closeRoom()
        } else {
          this.refuse()
        }
      }
    }
    // this.refuseFlag = false
    // this.closeFlag = false
    // this.isCalling = false
    // this.isPending = false
    clearTimeout(this.data.timeoutId)
    // this.$store.commit('setCalling', false)
  },
  onHide() {
    this.data.isCalling = false
    this.data.isPending = false
    clearTimeout(this.data.timeoutId)
    this.closeRoom()
    // this.$store.commit('setCalling', false)
    // // 清理掉监听
    // this.$bus.$off('onCall')
    // this.$bus.$off('isCalling')
    // this.$bus.$off('onClose')
    // this.$bus.$off('onRefuse')
    // this.$bus.$off('onBusy')
  },
  onLoad(options) {
    // onLoad的时候监听，在收到某些message的时候会触发的事件，可在main.js里查看事件 emit 条件
    console.log(options)
    this.setData({
      args: JSON.parse(options.args),
      userID: options.uid + '',
      from: options.from,
      to: options.to,
      type: (this.data.userID === this.data.from) ? 'call' : 'onCall',
      roomID: JSON.parse(options.args).room_id,
      isCalling: true,
      isPending: false,
      startTime: new Date().getTime()
    })
    // this.$bus.$on('onCall', () => {
    //   this.isCalling = true
    //   this.isPending = false
    //   this.startTime = new Date().getTime()
    //   clearTimeout(this.timeoutId)
    //   this.onCall()
    // })
    // this.$bus.$on('isCalling', (message) => {
    //   this.alreadyCalling(message)
    // })
    // this.$bus.$on('onClose', () => {
    //   this.closeFlag = true
    //   wx.navigateBack({
    //     delta: 1
    //   })
    // })
    // this.$bus.$on('onRefuse', () => {
    //   this.closeFlag = true
    //   wx.navigateBack({
    //     delta: 1
    //   })
    // })
    // this.$bus.$on('onBusy', () => {
    //   this.closeFlag = true
    //   wx.navigateBack({
    //     delta: 1
    //   })
    // })
  },
  methods: {
    onRoomEvent(e) {
      if ([ERROR_OPEN_CAMERA,
        ERROR_OPEN_MIC,
        ERROR_PUSH_DISCONNECT,
        ERROR_CAMERA_MIC_PERMISSION,
        ERROR_EXCEEDS_THE_MAX_MEMBER,
        ERROR_REQUEST_ROOM_SIG,
        ERROR_JOIN_ROOM].includes(e.target.code)) {
        this.webrtcroomComponent = this.selectComponent('#webrtcroom')
        this.webrtcroomComponent.stop()
        let args = {
          action: -2,
          code: e.target.code 
        }
        this.setData({
          args: args,
          userID: options.uid, 
        })
        const data = JSON.stringify(this.args)
        // 对方发起视频，接通成功后如果是我挂断的，这时挂断消息应该发给视频发起方
        let to = (this.data.to === this.data.userID) ? this.data.from : this.data.to
        const message = tim.createCustomMessage({
          to: to,
          conversationType: TIM.TYPES.CONV_C2C,
          payload: {
            data: data,
            description: '',
            extension: ''
          }
        })
        tim.sendMessage(message)
        clearTimeout(this.data.timeoutId)
      }
      if (e.target.tag === 'error') {
        wx.showToast({
          title: e.target.detail,
          duration: 1000
        })
      }
    },
    handleCloseRoom() {
      this.closeFlag = true
      this.closeRoom()
      wx.navigateBack({
        delta: 1
      })
    },
    handleRefuse() {
      this.refuseFlag = true
      this.refuse()
      wx.navigateBack({
        delta: 1
      })
    },
    // 发起方等待时挂断
    closeRoom() {
      this.webrtcroomComponent = this.selectComponent('#webrtcroom')
      this.webrtcroomComponent.stop()
      var args = {
        action: 5
      }
      this.setData({
        args: args
      })
      this.args.action = 5
      if (this.data.startTime === 0) {
        var args = {
          action: 1
        }
        this.setData({
          args: args
        })
      }
      if (this.data.startTime !== 0) {
        const endTime = new Date().getTime()
        var args = {
          duration: Math.round((endTime - this.startTime) / 1000)
        }
        this.setData({
          args: args
        })
        this.data.startTime = 0
      }
      const data = JSON.stringify(this.data.args)
      // 对方发起视频，接通成功后如果是我挂断的，这时挂断消息应该发给视频发起方
      let to = (this.data.to === this.data.userID) ? this.data.from : this.data.to
      const message = tim.createCustomMessage({
        to: to,
        conversationType: TIM.TYPES.CONV_C2C,
        payload: {
          data: data,
          description: '',
          extension: ''
        }
      })
      tim.sendMessage(message)
      clearTimeout(this.data.timeoutId)
    },
    // 发起方等待接收方超过60s
    timeout() {
      var args = {
        action: 3
      }
      this.setData({
        args: args
      })
      const data = JSON.stringify(this.args)
      const message = tim.createCustomMessage({
        to: this.data.to,
        conversationType: TIM.TYPES.CONV_C2C,
        payload: {
          data: data,
          description: '',
          extension: ''
        }
      })
      tim.sendMessage(message)
      wx.navigateBack({
        delta: 1
      })
    },
    // 接受对方的请求
    receive() {
      var args = {
        action: 4
      }
      const data = JSON.stringify(this.args)
      this.setData({
        args: args,
        startTime: new Date().getTime()
      })
      const message = tim.createCustomMessage({
        to: this.data.from,
        conversationType: TIM.TYPES.CONV_C2C,
        payload: {
          data: data,
          description: '',
          extension: ''
        }
      })
      tim.sendMessage(message)
      clearTimeout(this.data.timeoutId)
      this.isCalling = true
      this.isPending = false
      this.webrtcroomComponent = this.selectComponent('#webrtcroom')
      this.webrtcroomComponent.start()
    },
    onCall() {
      this.webrtcroomComponent = this.selectComponent('#webrtcroom')
      this.webrtcroomComponent.start()
    },
    // 拒绝
    refuse() {
      var args = {
        action: 2
      }
      this.setData({
        args: args,
      })
      const data = JSON.stringify(this.data.args)
      const message = tim.createCustomMessage({
        to: this.data.from,
        conversationType: TIM.TYPES.CONV_C2C,
        payload: {
          data: data,
          description: '',
          extension: ''
        }
      })
      tim.sendMessage(message)
      clearTimeout(this.data.timeoutId)
    },
    alreadyCalling(item) {
      const options = JSON.parse(item.payload.data)
      var args = {
        action: 6
      }
      this.setData({
        args: args,
      })
      const message = tim.createCustomMessage({
        to: item.from,
        conversationType: TIM.TYPES.CONV_C2C,
        payload: {
          data: JSON.stringify(options),
          description: '',
          extension: ''
        }
      })
      tim.sendMessage(message)
    },
    microphone() {
      this.setData({
        muted: !this.data.muted
      })
    },
    monitor() {
      this.webrtcroomComponent = this.selectComponent('#webrtcroom')
      this.webrtcroomComponent.switchCamera()
    }
  },
  destory() { }
})

