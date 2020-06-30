import UserController from 'controller/user-controller.js'
import Pusher from 'model/pusher.js'
import { EVENT, DEFAULT_COMPONENT_CONFIG } from 'common/constants.js'
import Event from 'utils/event.js'
import * as ENV from 'utils/environment.js'
import TIM from 'libs/tim-wx.js'
import MTA from 'libs/mta_analysis.js'

const TAG_NAME = 'TRTC-ROOM'
const IM_GROUP_TYPE = TIM.TYPES.GRP_CHATROOM // TIM.TYPES.GRP_CHATROOM 体验版IM无数量限制，成员20个， TIM.TYPES.GRP_AVCHATROOM IM体验版最多10个，升级后无限制

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 必要的初始化参数
    config: {
      type: Object,
      value: {
        sdkAppID: '',
        userID: '',
        userSig: '',
        template: '',
        debugMode: false, // 是否开启调试模式
        enableIM: false, // 是否开启 IM
      },
      observer: function (newVal, oldVal) {
        this._propertyObserver({
          'name': 'config', newVal, oldVal,
        })
      },
    },
    message: {
      type: Object,
      value: {
        args: '',
        to: '',
        from: '',
        type: '',
        startTime: 0
      },
      observer: function (newVal, oldVal) {
        this._propertyObserver({
          'name': 'message', newVal, oldVal,
        })
      },
    },
    isPending: {
      type: Boolean,
      value: true,
      observer: function (newVal, oldVal) {
        this._propertyObserver({
          'name': 'isPending', newVal, oldVal,
        })
      },
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    pusher: null,
    debugPanel: true, // 是否打开组件调试面板
    debug: true, // 是否打开player pusher 的调试信息
    streamList: [], // 用于渲染player列表,存储stram
    visibleStreamList: [], // 有音频或者视频的StreamList
    userList: [], // 扁平化的数据用来返回给用户
    template: '', // 不能设置默认值，当默认值和传入组件的值不一致时，iOS渲染失败
    cameraPosition: '', // 摄像头位置，用于debug
    panelName: '', // 控制面板名称，包括 setting-panel  memberlist-panel
    localVolume: 0,
    remoteVolumeList: [],
    enableIM: false, // 用于组件内渲染
    exitIMThrottle: false,
    messageContent: '',
    messageList: [], // 仅保留10条消息
    maxMessageListLength: 10,
    messageListScrollTop: 0,
    appVersion: ENV.APP_VERSION,
    libVersion: ENV.LIB_VERSION,
    argsInfo: {},
    msgInfo: {},
    isResolve: true,
    startTime: 0
  },
  /**
   * 生命周期方法
   */
  lifetimes: {
    created: function () {
      // 在组件实例刚刚被创建时执行
      console.log(TAG_NAME, 'created', ENV)
      MTA.App.init({
        appID: '500710685',
        eventID: '500710697',
        autoReport: true,
        statParam: true,
      })
    },
    attached: function () {
      // 在组件实例进入页面节点树时执行
      console.log(TAG_NAME, 'attached')
      this._init()
      MTA.Page.stat()
    },
    ready: function () {
      // 在组件在视图层布局完成后执行
      console.log(TAG_NAME, 'ready')
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      console.log(TAG_NAME, 'detached')
      // 停止所有拉流，并重置数据
      this.exitRoom()
    },
    error: function (error) {
      // 每当组件方法抛出错误时执行
      console.log(TAG_NAME, 'error', error)
    },
  },
  pageLifetimes: {
    show: function () {
      // 组件所在的页面被展示时执行
      console.log(TAG_NAME, 'show status:', this.status)
      if (this.status.isPending) {
        // 经历了 5000 挂起事件
        this.status.isPending = false
        // 修复iOS 最小化触发5000事件后，音频推流失败的问题
        if (ENV.IS_IOS && this.data.pusher.enableMic) {
          this.unpublishLocalAudio().then(() => {
            this.publishLocalAudio()
          })
        }
      }
      if (this.status.isPush) {
        // 小程序hide - show 有一定概率本地黑屏或静止，远端正常，或者远端和本地同时黑屏或静止，需要手动启动预览，非必现
        this.data.pusher.getPusherContext().startPreview()
        this.data.pusher.getPusherContext().resume()
      }
    },
    hide: function () {
      // 组件所在的页面被隐藏时执行
      this.exitRoom()
      console.log(TAG_NAME, 'hide')
    },
    resize: function (size) {
      // 组件所在的页面尺寸变化时执行
      console.log(TAG_NAME, 'resize', size)
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 初始化各项参数和用户控制模块，在组件实例触发 attached 时调用，此时不建议对View进行变更渲染（调用setData方法）
     */
    _init () {
      console.log(TAG_NAME, '_init')
      this.userController = new UserController(this)
      this._emitter = new Event()
      this.EVENT = EVENT
      this._initStatus()
      this._bindEvent()
      this._bindEventGrid()
      this._keepScreenOn()
      console.log(TAG_NAME, '_init success component:', this)
    },
    _initStatus () {
      this.status = {
        isPush: false, // 推流状态
        isPending: false, // 挂起状态，触发5000事件标记为true，onShow后标记为false
      }
      this._lastTapTime = 0 // 点击时间戳 用于判断双击事件
      this._beforeLastTapTime = 0 // 点击时间戳 用于判断双击事件
      this._isFullscreen = false // 是否进入全屏状态
    },
    /**
     * 监听组件属性变更，外部变更组件属性时触发该监听
     * @param {Object} data newVal，oldVal
     */
    _propertyObserver (data) {
      console.log(data)
      console.log(TAG_NAME, '_propertyObserver', data, this.data.config)
      if (data.name === 'config') {
        const config = Object.assign({}, DEFAULT_COMPONENT_CONFIG, data.newVal)
        console.log(TAG_NAME, '_propertyObserver config:', config)
        // 由于 querystring 只支持 String 类型，做一个类型防御
        if (typeof config.debugMode === 'string') {
          config.debugMode === 'true' ? true : false
        }
        // 初始化IM
        if (config.userID) {
          this._initIM(config)
        }
        if (config.sdkAppID && data.oldVal.sdkAppID !== config.sdkAppID && MTA) {
          MTA.Event.stat('sdkAppID', { 'value': config.sdkAppID })
        }
        // 独立设置与pusher无关的配置
        this.setData({
          enableIM: config.enableIM,
          template: config.template,
          debugMode: config.debugMode || false,
          debug: config.debugMode || false,
        })
        this._setPusherConfig(config)
      } else if (data.name === 'message') {
        this.setData({
          msgInfo: data.newVal,
          argsInfo: data.newVal && data.newVal.args ? JSON.parse(data.newVal.args): {},
          startTime: data.newVal && data.newVal.startTime ? data.newVal.startTime : 0
        })
        console.log(this.data.isResolve)
        console.log(data.newVal)
        if (!this.data.isResolve && data.newVal.type) {
          console.log('走这里来里面')
          this._hangRoom()
        }
      } else {
        console.log(data.newVal)
        this.setData({
          isResolve: data.newVal
        })
      }
    },
    receive() {
      var args = this.data.argsInfo
      args.action = 4
      const data = JSON.stringify(args)
      this.setData({
        argsInfo: args
      })
      const message = this.tim.createCustomMessage({
        to: this.data.msgInfo.from,
        conversationType: TIM.TYPES.CONV_C2C,
        payload: {
          data: data,
          description: '',
          extension: ''
        }
      })
      console.log(this.data.msgInfo.from)
      console.log('发送成功')
      this.tim.sendMessage(message)
    },
      _handleSubscribeRemoteAudio (event) {
      const userID = event.currentTarget.dataset.userID
      const streamType = event.currentTarget.dataset.streamType
      const stream = this.data.streamList.find((item) => {
        return item.userID === userID && item.streamType === streamType
      })
      if (stream.muteAudio) {
        this.subscribeRemoteAudio({ userID })
      } else {
        this.unsubscribeRemoteAudio({ userID })
      }
    },
    //  _______             __        __  __
    //  |       \           |  \      |  \|  \
    //  | $$$$$$$\ __    __ | $$____  | $$ \$$  _______
    //  | $$__/ $$|  \  |  \| $$    \ | $$|  \ /       \
    //  | $$    $$| $$  | $$| $$$$$$$\| $$| $$|  $$$$$$$
    //  | $$$$$$$ | $$  | $$| $$  | $$| $$| $$| $$
    //  | $$      | $$__/ $$| $$__/ $$| $$| $$| $$_____
    //  | $$       \$$    $$| $$    $$| $$| $$ \$$     \
    //   \$$        \$$$$$$  \$$$$$$$  \$$ \$$  \$$$$$$$

    /**
     * 进房
     * @param {Object} params 必传 roomID 取值范围 1 ~ 4294967295
     * @returns {Promise}
     */
    enterRoom (params) {
      return new Promise((resolve, reject) => {
        console.log(TAG_NAME, 'enterRoom')
        console.log(TAG_NAME, 'params', params)
        console.log(TAG_NAME, 'config', this.data.config)
        console.log(TAG_NAME, 'pusher', this.data.pusher)
        // 1. 补齐进房参数，校验必要参数是否齐全
        if (params) {
          Object.assign(this.data.pusher, params)
          Object.assign(this.data.config, params)
        }
        if (!this._checkParam(this.data.config)) {
          reject(new Error('缺少必要参数'))
          return
        }
        // 2. 根据参数拼接 push url，赋值给 live-pusher，
        this._getPushUrl(this.data.config).then((pushUrl) => {
          this.data.pusher.url = pushUrl
          // clearTimeout(this.timeoutId)
          this.setData({
            pusher: this.data.pusher,
            startTime: new Date().getTime()
          }, () => {
            // 真正进房成功需要通过 1018 事件通知
            console.log(TAG_NAME, 'enterRoom', this.data.pusher)
            // view 渲染成功回调后，开始推流
            this.data.pusher.getPusherContext().start()
            this.status.isPush = true
            this.publishLocalAudio()
            console.log(this.data.msgInfo.from != this.data.config.userID)
            console.log('滴滴答答')
            if (this.data.msgInfo.from != this.data.config.userID && this.data.isResolve) {
              this.receive()
            } 
            resolve()
          })
        }).catch((res) => {
          // 进房失败需要通过 pusher state 事件通知，目前还没有准确的事件通知
          console.error(TAG_NAME, 'enterRoom error', res)
          reject(res)
        })
        // 初始化 IM SDK
        // this._initIM(this.data.config)
        // 登录IM
        
      })
    },
    /**
     * 退房，停止推流和拉流，并重置数据
     * @returns {Promise}
     */
    exitRoom () {
      return new Promise((resolve, reject) => {
        console.log(TAG_NAME, 'exitRoom')
        // this._exitIM()
        this.data.pusher.reset()
        this.status.isPush = false
        const result = this.userController.reset()
        this.setData({
          pusher: this.data.pusher,
          userList: result.userList,
          streamList: result.streamList,
          visibleStreamList: this._filterVisibleStream(result.streamList),
        }, () => {
          // 在销毁页面时调用，不会走到这里
          resolve({ userList: this.data.userList, streamList: this.data.streamList })
          console.log(TAG_NAME, 'exitRoom success', this.data.pusher, this.data.streamList, this.data.userList)
        })
      })
    },
    /**
     * 开启摄像头
     * @returns {Promise}
     */
    publishLocalVideo () {
      // 设置 pusher enableCamera
      console.log(TAG_NAME, 'publishLocalVideo 开启摄像头')
      return this._setPusherConfig({ enableCamera: true })
    },
    /**
     * 关闭摄像头
     * @returns {Promise}
     */
    unpublishLocalVideo () {
      // 设置 pusher enableCamera
      console.log(TAG_NAME, 'unpublshLocalVideo 关闭摄像头')
      return this._setPusherConfig({ enableCamera: false })
    },
    /**
     * 开启麦克风
     * @returns {Promise}
     */
    publishLocalAudio () {
      // 设置 pusher enableCamera
      console.log(TAG_NAME, 'publishLocalAudio 开启麦克风')
      return this._setPusherConfig({ enableMic: true })
    },
    /**
     * 关闭麦克风
     * @returns {Promise}
     */
    unpublishLocalAudio () {
      // 设置 pusher enableCamera
      console.log(TAG_NAME, 'unpublshLocalAudio 关闭麦克风')
      return this._setPusherConfig({ enableMic: false })
    },
    /**
     * 订阅远端视频 主流 小画面 辅流
     * @param {Object} params {userID,streamType} streamType 传入 small 时修改对应的主流 url 的 _definitionType 参数为 small, stream.streamType 仍为 main
     * @returns {Promise}
     */
    subscribeRemoteVideo (params) {
      console.log(TAG_NAME, 'subscribeRemoteVideo', params)
      // 设置指定 user streamType 的 muteVideo 为 false
      const config = {
        muteVideo: false,
      }
      // 本地数据结构里的 streamType 只支持 main 和 aux ，订阅 small 也是对 main 进行处理
      const streamType = params.streamType === 'small' ? 'main' : params.streamType
      if (params.streamType === 'small' || params.streamType === 'main') {
        const stream = this.userController.getStream({
          userID: params.userID,
          streamType: streamType,
        })
        if (stream && stream.streamType === 'main') {
          console.log(TAG_NAME, 'subscribeRemoteVideo switch small', stream.src)
          if (params.streamType === 'small') {
            config.src = stream.src.replace('main', 'small')
            config._definitionType = 'small' // 用于设置面板的渲染
          } else if (params.streamType === 'main') {
            stream.src = stream.src.replace('small', 'main')
            config._definitionType = 'main'
          }
          console.log(TAG_NAME, 'subscribeRemoteVideo', stream.src)
        }
      }
      return this._setPlayerConfig({
        userID: params.userID,
        streamType: streamType,
        config: config,
      })
    },
    /**
     * 取消订阅远端视频
     * @param {Object} params {userID,streamType}
     * @returns {Promise}
     */
    unsubscribeRemoteVideo (params) {
      console.log(TAG_NAME, 'unsubscribeRemoteVideo', params)
      // 设置指定 user streamType 的 muteVideo 为 true
      return this._setPlayerConfig({
        userID: params.userID,
        streamType: params.streamType,
        config: {
          muteVideo: true,
        },
      })
    },
    /**
     * 订阅远端音频
     * @param {Object} params userID 用户ID
     * @returns {Promise}
     */
    subscribeRemoteAudio (params) {
      console.log(TAG_NAME, 'subscribeRemoteAudio', params)
      return this._setPlayerConfig({
        userID: params.userID,
        streamType: 'main',
        config: {
          muteAudio: false,
        },
      })
    },
    /**
     * 取消订阅远端音频
     * @param {Object} params userID 用户ID
     * @returns {Promise}
     */
    unsubscribeRemoteAudio (params) {
      console.log(TAG_NAME, 'unsubscribeRemoteAudio', params)
      return this._setPlayerConfig({
        userID: params.userID,
        streamType: 'main',
        config: {
          muteAudio: true,
        },
      })
    },
    on (eventCode, handler, context) {
      this._emitter.on(eventCode, handler, context)
    },
    off (eventCode, handler) {
      this._emitter.off(eventCode, handler)
    },
    /**
     * 切换前后摄像头
     */
    switchCamera () {
      if (!this.data.cameraPosition) {
        // this.data.pusher.cameraPosition 是初始值，不支持动态设置
        this.data.cameraPosition = this.data.pusher.frontCamera
      }
      console.log(TAG_NAME, 'switchCamera', this.data.cameraPosition)
      this.data.cameraPosition = this.data.cameraPosition === 'front' ? 'back' : 'front'
      this.setData({
        cameraPosition: this.data.cameraPosition,
      }, () => {
        console.log(TAG_NAME, 'switchCamera success', this.data.cameraPosition)
      })
      // wx 7.0.9 不支持动态设置 pusher.frontCamera ，只支持调用 API switchCamer() 设置，这里修改 cameraPosition 是为了记录状态
      this.data.pusher.getPusherContext().switchCamera()
    },
    /**
     * 设置指定player view的渲染坐标和尺寸
     * @param {object} params
     * userID: string
     * streamType: string
     * xAxis: number
     * yAxis: number
     * width: number
     * height: number
     * @returns {Promise}
     */
    setViewRect (params) {
      console.log(TAG_NAME, 'setViewRect', params)
      if (this.data.pusher.template !== 'custom') {
        console.warn(`如需使用setViewRect方法，请设置template:"custom", 当前 template:"${this.data.pusher.template}"`)
      }
      if (this.data.pusher.userID === params.userID) {
        return this._setPusherConfig({
          xAxis: params.xAxis,
          yAxis: params.yAxis,
          width: params.width,
          height: params.height,
        })
      }
      return this._setPlayerConfig({
        userID: params.userID,
        streamType: params.streamType,
        config: {
          xAxis: params.xAxis,
          yAxis: params.yAxis,
          width: params.width,
          height: params.height,
        },
      })
    },
    /**
     * 设置指定 player 或者 pusher view 是否可见
     * @param {object} params
     * userID: string
     * streamType: string
     * isVisible：boolean
     * @returns {Promise}
     */
    setViewVisible (params) {
      console.log(params)
      console.log('我的内容')
      console.log(TAG_NAME, 'setViewVisible', params)
      // if (this.data.pusher.template !== 'custom') {
      //   console.warn(`如需使用setViewVisible方法，请设置template:"custom", 当前 template:"${this.data.pusher.template}"`)
      // }
      if (this.data.pusher.userID === params.userID) {
        return this._setPusherConfig({
          isVisible: params.isVisible,
        })
      }
      return this._setPlayerConfig({
        userID: params.userID,
        streamType: params.streamType,
        config: {
          isVisible: params.isVisible,
        },
      })
    },
    /**
     * 设置指定player view的层级
     * @param {Object} params
     * userID: string
     * streamType: string
     * zIndex: number
     * @returns {Promise}
     */
    setViewZIndex (params) {
      console.log(TAG_NAME, 'setViewZIndex', params)
      if (this.data.pusher.template !== 'custom') {
        console.warn(`如需使用setViewZIndex方法，请设置template:"custom", 当前 template:"${this.data.pusher.template}"`)
      }
      if (this.data.pusher.userID === params.userID) {
        return this._setPusherConfig({
          zIndex: params.zindex || params.zIndex,
        })
      }
      return this._setPlayerConfig({
        userID: params.userID,
        streamType: params.streamType,
        config: {
          zIndex: params.zindex || params.zIndex,
        },
      })
    },
    /**
     * 设置背景音音量
     * @param {Object} params volume
     */
    setBGMVolume (params) {
      this.data.pusher.getPusherContext().setBGMVolume({ volume: params.volume })
    },
    /**
     * 设置麦克风音量
     * @param {Object} params volume
     */
    setMICVolume (params) {
      this.data.pusher.getPusherContext().setMICVolume({ volume: params.volume })
    },
    /**
     * 将远端视频全屏
     * @param {Object} params userID streamType direction
     * @returns {Promise}
     */
    enterFullscreen (params) {
      console.log(TAG_NAME, 'enterFullscreen', params)
      return new Promise((resolve, reject) => {
        this.userController.getStream(params).playerContext.requestFullScreen({
          direction: params.direction || 0,
          success: (event) => {
            console.log(TAG_NAME, 'enterFullscreen success', event)
            resolve(event)
          },
          fail: (event) => {
            console.log(TAG_NAME, 'enterFullscreen fail', event)
            reject(event)
          },
        })
      })
    },
    /**
     * 将远端视频取消全屏
     * @param {Object} params userID streamType
     * @returns {Promise}
     */
    exitFullscreen (params) {
      console.log(TAG_NAME, 'exitFullscreen', params)
      return new Promise((resolve, reject) => {
        this.userController.getStream(params).playerContext.exitFullScreen({
          success: (event) => {
            console.log(TAG_NAME, 'exitFullScreen success', event)
            resolve(event)
          },
          fail: (event) => {
            console.log(TAG_NAME, 'exitFullScreen fail', event)
            reject(event)
          },
        })
      })
    },
    /**
     * 设置 player 视图的横竖屏显示
     * @param {Object} params userID streamType orientation: vertical, horizontal
     * @returns {Promise}
     */
    setRemoteOrientation (params) {
      return this._setPlayerConfig({
        userID: params.userID,
        streamType: params.streamType,
        config: {
          orientation: params.orientation,
        },
      })
    },
    // 改为：
    setViewOrientation (params) {
      return this._setPlayerConfig({
        userID: params.userID,
        streamType: params.streamType,
        config: {
          orientation: params.orientation,
        },
      })
    },
    /**
     * 设置 player 视图的填充模式
     * @param {Object} params userID streamType fillMode: contain，fillCrop
     * @returns {Promise}
     */
    setRemoteFillMode (params) {
      return this._setPlayerConfig({
        userID: params.userID,
        streamType: params.streamType,
        config: {
          objectFit: params.fillMode,
        },
      })
    },
    // 改为：
    setViewFillMode (params) {
      return this._setPlayerConfig({
        userID: params.userID,
        streamType: params.streamType,
        config: {
          objectFit: params.fillMode,
        },
      })
    },
    // ______             __                                              __
    // |      \           |  \                                            |  \
    //  \$$$$$$ _______  _| $$_     ______    ______   _______    ______  | $$
    //   | $$  |       \|   $$ \   /      \  /      \ |       \  |      \ | $$
    //   | $$  | $$$$$$$\\$$$$$$  |  $$$$$$\|  $$$$$$\| $$$$$$$\  \$$$$$$\| $$
    //   | $$  | $$  | $$ | $$ __ | $$    $$| $$   \$$| $$  | $$ /      $$| $$
    //  _| $$_ | $$  | $$ | $$|  \| $$$$$$$$| $$      | $$  | $$|  $$$$$$$| $$
    // |   $$ \| $$  | $$  \$$  $$ \$$     \| $$      | $$  | $$ \$$    $$| $$
    //  \$$$$$$ \$$   \$$   \$$$$   \$$$$$$$ \$$       \$$   \$$  \$$$$$$$ \$$
    /**
     * 设置推流参数并触发页面渲染更新
     * @param {Object} config live-pusher 的配置
     * @returns {Promise}
     */
    _setPusherConfig (config) {
      console.log(TAG_NAME, '_setPusherConfig', config, this.data.pusher)
      return new Promise((resolve, reject) => {
        if (!this.data.pusher) {
          this.data.pusher = new Pusher(config)
        } else {
          Object.assign(this.data.pusher, config)
        }
        this.setData({
          pusher: this.data.pusher,
        }, () => {
          // console.log(TAG_NAME, '_setPusherConfig setData compelete', 'config:', config, 'pusher:', this.data.pusher)
          resolve(config)
        })
      })
    },
    /**
     * 设置指定 player 属性并触发页面渲染
     * @param {Object} params include userID,streamType,config
     * @returns {Promise}
     */
    _setPlayerConfig (params) {
      const userID = params.userID
      const streamType = params.streamType
      const config = params.config
      console.log(TAG_NAME, '_setPlayerConfig', params)
      return new Promise((resolve, reject) => {
        // 获取指定的userID streamType 的 stream
        const user = this.userController.getUser(userID)
        if (user && user.streams[streamType]) {
          Object.assign(user.streams[streamType], config)
          // user.streams引用的对象和 streamList 里的是同一个
          this.setData({
            streamList: this.data.streamList,
            visibleStreamList: this._filterVisibleStream(this.data.streamList),
          }, () => {
            // console.log(TAG_NAME, '_setPlayerConfig complete', params, 'streamList:', this.data.streamList)
            resolve(params)
          })
        } else {
          // 不需要reject，静默处理
          console.warn(TAG_NAME, '指定 userID 或者 streamType 不存在')
          // reject(new Error('指定 userID 或者 streamType 不存在'))
        }
      })
    },
    /**
     * 必选参数检测
     * @param {Object} rtcConfig rtc参数
     * @returns {Boolean}
     */
    _checkParam (rtcConfig) {
      console.log(TAG_NAME, 'checkParam config:', rtcConfig)
      if (!rtcConfig.sdkAppID) {
        console.error('未设置 sdkAppID')
        return false
      }
      if (rtcConfig.roomID === undefined) {
        console.error('未设置 roomID')
        return false
      }
      if (rtcConfig.roomID < 1 || rtcConfig.roomID > 4294967296) {
        console.error('roomID 超出取值范围 1 ~ 4294967295')
        return false
      }
      if (!rtcConfig.userID) {
        console.error('未设置 userID')
        return false
      }
      if (!rtcConfig.userSig) {
        console.error('未设置 userSig')
        return false
      }
      if (!rtcConfig.template) {
        console.error('未设置 template')
        return false
      }
      return true
    },
    _getPushUrl (rtcConfig) {
      // 拼接 puhser url rtmp 方案
      console.log(TAG_NAME, '_getPushUrl', rtcConfig)
      if (ENV.IS_TRTC) {
        // 版本高于7.0.8，基础库版本高于2.10.0 使用新的 url
        return new Promise((resolve, reject) => {
          // appscene videocall live
          // cloudenv PRO CCC DEV UAT
          // encsmall 0
          // 对外的默认值是rtc ，对内的默认值是videocall
          rtcConfig.scene = !rtcConfig.scene || rtcConfig.scene === 'rtc' ? 'videocall' : 'live'
          rtcConfig.enableBlackStream = rtcConfig.enableBlackStream || 1
          rtcConfig.encsmall = rtcConfig.encsmall || 0
          rtcConfig.cloudenv = rtcConfig.cloudenv || 'PRO'
          setTimeout(() => {
            const pushUrl = 'room://cloud.tencent.com/rtc?sdkappid=' + rtcConfig.sdkAppID +
              '&roomid=' + rtcConfig.roomID +
              '&userid=' + rtcConfig.userID +
              '&usersig=' + rtcConfig.userSig +
              '&appscene=' + rtcConfig.scene +
              '&encsmall=' + rtcConfig.encsmall +
              '&cloudenv=' + rtcConfig.cloudenv

            console.log(TAG_NAME, 'getPushUrl result:', pushUrl)
            resolve(pushUrl)
          }, 0)
        })
      }
      return this._requestSigServer(rtcConfig)
    },
    /**
     * 获取签名和推流地址
     * @param {Object} rtcConfig 进房参数配置
     * @returns {Promise}
     */
    _requestSigServer (rtcConfig) {
      console.log(TAG_NAME, '_requestSigServer:', rtcConfig)
      const sdkAppID = rtcConfig.sdkAppID
      const userID = rtcConfig.userID
      const userSig = rtcConfig.userSig
      const roomID = rtcConfig.roomID
      const privateMapKey = rtcConfig.privateMapKey

      rtcConfig.useCloud = rtcConfig.useCloud === undefined ? true : rtcConfig.useCloud
      let url = rtcConfig.useCloud ? 'https://official.opensso.tencent-cloud.com/v4/openim/jsonvideoapp' : 'https://yun.tim.qq.com/v4/openim/jsonvideoapp'
      url += '?sdkappid=' + sdkAppID + '&identifier=' + userID + '&usersig=' + userSig + '&random=' + Date.now() + '&contenttype=json'

      const reqHead = {
        'Cmd': 1,
        'SeqNo': 1,
        'BusType': 7,
        'GroupId': roomID,
      }
      const reqBody = {
        'PrivMapEncrypt': privateMapKey,
        'TerminalType': 1,
        'FromType': 3,
        'SdkVersion': 26280566,
      }
      console.log(TAG_NAME, '_requestSigServer:', url, reqHead, reqBody)
      return new Promise((resolve, reject) => {
        wx.request({
          url: url,
          data: {
            'ReqHead': reqHead,
            'ReqBody': reqBody,
          },
          method: 'POST',
          success: (res) => {
            console.log('_requestSigServer success:', res)
            if (res.data['ErrorCode'] || res.data['RspHead']['ErrorCode'] !== 0) {
              // console.error(res.data['ErrorInfo'] || res.data['RspHead']['ErrorInfo'])
              console.error('获取roomsig失败')
              reject(res)
            }

            const roomSig = JSON.stringify(res.data['RspBody'])
            let pushUrl = 'room://cloud.tencent.com?sdkappid=' + sdkAppID + '&roomid=' + roomID + '&userid=' + userID + '&roomsig=' + encodeURIComponent(roomSig)
            // TODO 需要重新整理的逻辑 TRTC尚未支持 20200213
            // 如果有配置纯音频推流或者recordId参数
            if (rtcConfig.pureAudioPushMod || rtcConfig.recordId) {
              const bizbuf = {
                Str_uc_params: {
                  pure_audio_push_mod: 0,
                  record_id: 0,
                },
              }
              // 纯音频推流
              if (rtcConfig.pureAudioPushMod) {
                bizbuf.Str_uc_params.pure_audio_push_mod = rtcConfig.pureAudioPushMod
              } else {
                delete bizbuf.Str_uc_params.pure_audio_push_mod
              }
              // 自动录制时业务自定义id
              if (rtcConfig.recordId) {
                bizbuf.Str_uc_params.record_id = rtcConfig.recordId
              } else {
                delete bizbuf.Str_uc_params.record_id
              }
              pushUrl += '&bizbuf=' + encodeURIComponent(JSON.stringify(bizbuf))
            }
            console.log('roomSigInfo', pushUrl)
            resolve(pushUrl)
          },
          fail: (res) => {
            console.log(TAG_NAME, 'requestSigServer fail:', res)
            reject(res)
          },
        })
      })
    },
    _doubleTabToggleFullscreen (event) {
      const curTime = event.timeStamp
      const lastTime = this._lastTapTime
      // 已知问题：上次全屏操作后，必须等待1.5s后才能再次进行全屏操作，否则引发SDK全屏异常，因此增加节流逻辑
      const beforeLastTime = this._beforeLastTapTime
      console.log(TAG_NAME, '_doubleTabToggleFullscreen', event, lastTime, beforeLastTime)
      if (curTime - lastTime > 0 && curTime - lastTime < 300 && lastTime - beforeLastTime > 1500) {
        const userID = event.currentTarget.dataset.userid
        const streamType = event.currentTarget.dataset.streamtype
        if (this._isFullscreen) {
          this.exitFullscreen({ userID, streamType }).then(() => {
            this._isFullscreen = false
          }).catch(() => {
          })
        } else {
          // const stream = this.userController.getStream({ userID, streamType })
          let direction
          // // 已知问题：视频的尺寸需要等待player触发NetStatus事件才能获取到，如果进房就双击全屏，全屏后的方向有可能不对。
          // if (stream && stream.videoWidth && stream.videoHeight) {
          //   // 如果是横视频，全屏时进行横屏处理。如果是竖视频，则为0
          //   direction = stream.videoWidth > stream.videoHeight ? 90 : 0
          // }
          this.enterFullscreen({ userID, streamType, direction }).then(() => {
            this._isFullscreen = true
          }).catch(() => {
          })
        }
        this._beforeLastTapTime = lastTime
      }
      this._lastTapTime = curTime
    },
    /**
     * TRTC-room 远端用户和音视频状态处理
     */
    _bindEvent () {
      // 远端用户进房
      this.userController.on(EVENT.REMOTE_USER_JOIN, (event) => {
        console.log(TAG_NAME, '远端用户进房', event, event.data.userID)
        this.setData({
          userList: event.data.userList,
        }, () => {
          this._emitter.emit(EVENT.REMOTE_USER_JOIN, { userID: event.data.userID })
        })
        console.log(TAG_NAME, 'REMOTE_USER_JOIN', 'streamList:', this.data.streamList, 'userList:', this.data.userList)
      })
      // 远端用户离开
      this.userController.on(EVENT.REMOTE_USER_LEAVE, (event) => {
        console.log(TAG_NAME, '远端用户离开', event, event.data.userID)
        if (event.data.userID) {
          this.setData({
            userList: event.data.userList,
            streamList: event.data.streamList,
            visibleStreamList: this._filterVisibleStream(event.data.streamList),
          }, () => {
            this._emitter.emit(EVENT.REMOTE_USER_LEAVE, { userID: event.data.userID })
          })
        }
        console.log(TAG_NAME, 'REMOTE_USER_LEAVE', 'streamList:', this.data.streamList, 'userList:', this.data.userList)
      })
      // 视频状态 true
      this.userController.on(EVENT.REMOTE_VIDEO_ADD, (event) => {
        console.log(TAG_NAME, '远端视频可用', event, event.data.stream.userID)
        const stream = event.data.stream
        this.setData({
          userList: event.data.userList,
          streamList: event.data.streamList,
          visibleStreamList: this._filterVisibleStream(event.data.streamList),
        }, () => {
          // 完善 的stream 的 playerContext
          stream.playerContext = wx.createLivePlayerContext(stream.streamID, this)
          // 新增的需要触发一次play 默认属性才能生效
          // stream.playerContext.play()
          // console.log(TAG_NAME, 'REMOTE_VIDEO_ADD playerContext.play()', stream)
          // TODO 视频通话模版默认订阅且显示
          this._emitter.emit(EVENT.REMOTE_VIDEO_ADD, { userID: stream.userID, streamType: stream.streamType })
        })
        console.log(TAG_NAME, 'REMOTE_VIDEO_ADD', 'streamList:', this.data.streamList, 'userList:', this.data.userList)
      })
      // 视频状态 false
      this.userController.on(EVENT.REMOTE_VIDEO_REMOVE, (event) => {
        console.log(TAG_NAME, '远端视频移除', event, event.data.stream.userID)
        const stream = event.data.stream
        this.setData({
          userList: event.data.userList,
          streamList: event.data.streamList,
          visibleStreamList: this._filterVisibleStream(event.data.streamList),
        }, () => {
          // 有可能先触发了退房事件，用户名下的所有stream都已清除
          if (stream.userID && stream.streamType) {
            this._emitter.emit(EVENT.REMOTE_VIDEO_REMOVE, { userID: stream.userID, streamType: stream.streamType })
          }
        })
        console.log(TAG_NAME, 'REMOTE_VIDEO_REMOVE', 'streamList:', this.data.streamList, 'userList:', this.data.userList)
      })
      // 音频可用
      this.userController.on(EVENT.REMOTE_AUDIO_ADD, (event) => {
        console.log(TAG_NAME, '远端音频可用', event)
        const stream = event.data.stream
        this.setData({
          userList: event.data.userList,
          streamList: event.data.streamList,
          visibleStreamList: this._filterVisibleStream(event.data.streamList),
        }, () => {
          stream.playerContext = wx.createLivePlayerContext(stream.streamID, this)
          // 新增的需要触发一次play 默认属性才能生效
          // stream.playerContext.play()
          // console.log(TAG_NAME, 'REMOTE_AUDIO_ADD playerContext.play()', stream)
          this._emitter.emit(EVENT.REMOTE_AUDIO_ADD, { userID: stream.userID, streamType: stream.streamType })
        })
        console.log(TAG_NAME, 'REMOTE_AUDIO_ADD', 'streamList:', this.data.streamList, 'userList:', this.data.userList)
      })
      // 音频不可用
      this.userController.on(EVENT.REMOTE_AUDIO_REMOVE, (event) => {
        console.log(TAG_NAME, '远端音频移除', event, event.data.stream.userID)
        const stream = event.data.stream
        this.setData({
          userList: event.data.userList,
          streamList: event.data.streamList,
          visibleStreamList: this._filterVisibleStream(event.data.streamList),
        }, () => {
          // 有可能先触发了退房事件，用户名下的所有stream都已清除
          if (stream.userID && stream.streamType) {
            this._emitter.emit(EVENT.REMOTE_AUDIO_REMOVE, { userID: stream.userID, streamType: stream.streamType })
          }
        })
        console.log(TAG_NAME, 'REMOTE_AUDIO_REMOVE', 'streamList:', this.data.streamList, 'userList:', this.data.userList)
      })
    },
    /**
     * pusher event handler
     * @param {*} event 事件实例
     */
    _pusherStateChangeHandler (event) {
      const code = event.detail.code
      const message = event.detail.message
      console.log(TAG_NAME, 'pusherStateChange：', code, event)
      switch (code) {
        case 0:
          console.log(message, code)
          break
        case 1001:
          console.log('已经连接推流服务器', code)
          break
        case 1002:
          console.log('已经与服务器握手完毕,开始推流', code)
          break
        case 1003:
          console.log('打开摄像头成功', code)
          break
        case 1004:
          console.log('录屏启动成功', code)
          break
        case 1005:
          console.log('推流动态调整分辨率', code)
          break
        case 1006:
          console.log('推流动态调整码率', code)
          break
        case 1007:
          console.log('首帧画面采集完成', code)
          break
        case 1008:
          console.log('编码器启动', code)
          break
        case 1018:
          console.log('进房成功', code)
          this._emitter.emit(EVENT.LOCAL_JOIN, { userID: this.data.pusher.userID })
          break
        case 1019:
          console.log('退出房间', code)
          this._emitter.emit(EVENT.LOCAL_LEAVE, { userID: this.data.pusher.userID })
          break
        case 2003:
          console.log('渲染首帧视频', code)
          break
        case 1020:
        case 1031:
        case 1032:
        case 1033:
        case 1034:
          // 通过 userController 处理 1020 1031 1032 1033 1034
          this.userController.userEventHandler(event)
          break
        case -1301:
          console.error('打开摄像头失败: ', code)
          this._emitter.emit(EVENT.ERROR, { code, message })
          break
        case -1302:
          console.error('打开麦克风失败: ', code)
          this._emitter.emit(EVENT.ERROR, { code, message })
          break
        case -1303:
          console.error('视频编码失败: ', code)
          this._emitter.emit(EVENT.ERROR, { code, message })
          break
        case -1304:
          console.error('音频编码失败: ', code)
          this._emitter.emit(EVENT.ERROR, { code, message })
          break
        case -1307:
          console.error('推流连接断开: ', code)
          this._emitter.emit(EVENT.ERROR, { code, message })
          break
        case -100018:
          console.error('进房失败: ', code, message)
          this._emitter.emit(EVENT.ERROR, { code, message })
          break
        case 5000:
          this.exitRoom()
          break
        case 1021:
          console.log('网络类型发生变化，需要重新进房', code)
          break
        case 2007:
          console.log('本地视频播放loading: ', code)
          break
        case 2004:
          console.log('本地视频播放开始: ', code)
          break
        default:
          console.log(message, code)
      }

      this._emitter.emit(EVENT.LOCAL_STATE_UPDATE, event)
    },
    _pusherNetStatusHandler (event) {
      // 触发 LOCAL_NET_STATE_UPDATE
      this._emitter.emit(EVENT.LOCAL_NET_STATE_UPDATE, event)
    },
    _pusherErrorHandler (event) {
      // 触发 ERROR
      console.warn(TAG_NAME, 'pusher error', event)
      try {
        const code = event.detail.errCode
        const message = event.detail.errMsg
        this._emitter.emit(EVENT.ERROR, { code, message })
      } catch (exception) {
        console.error(TAG_NAME, 'pusher error data parser exception', event, exception)
      }
    },
    _pusherBGMStartHandler (event) {
      // 触发 BGM_START 已经在playBGM方法中进行处理
      // this._emitter.emit(EVENT.BGM_PLAY_START, { data: event })
    },
    _pusherBGMProgressHandler (event) {
      // BGM_PROGRESS
      this._emitter.emit(EVENT.BGM_PLAY_PROGRESS, event)
    },
    _pusherBGMCompleteHandler (event) {
      // BGM_COMPLETE
      this._emitter.emit(EVENT.BGM_PLAY_COMPLETE, event)
    },
    // player event handler
    // 获取 player ID 再进行触发
    _playerStateChange (event) {
      // console.log(TAG_NAME, '_playerStateChange', event)
      this._emitter.emit(EVENT.REMOTE_STATE_UPDATE, event)
    },
    _playerFullscreenChange (event) {
      // console.log(TAG_NAME, '_playerFullscreenChange', event)
      this._emitter.emit(EVENT.REMOTE_FULLSCREEN_UPDATE, event)
      this._emitter.emit(EVENT.VIDEO_FULLSCREEN_UPDATE, event)
    },
    _playerNetStatus (event) {
      // console.log(TAG_NAME, '_playerNetStatus', event)
      // 获取player 视频的宽高
      const stream = this.userController.getStream({
        userID: event.currentTarget.dataset.userid,
        streamType: event.currentTarget.dataset.streamtype,
      })
      if (stream && (stream.videoWidth !== event.detail.info.videoWidth || stream.videoHeight !== event.detail.info.videoHeight)) {
        console.log(TAG_NAME, '_playerNetStatus update video size', event)
        stream.videoWidth = event.detail.info.videoWidth
        stream.videoHeight = event.detail.info.videoHeight
      }
      this._emitter.emit(EVENT.REMOTE_NET_STATE_UPDATE, event)
    },
    _playerAudioVolumeNotify (event) {
      // console.log(TAG_NAME, '_playerAudioVolumeNotify', event)
      this._emitter.emit(EVENT.REMOTE_AUDIO_VOLUME_UPDATE, event)
    },
    _filterVisibleStream (streamList) {
      const list = streamList.filter((item) => {
        return (item.hasVideo || item.hasAudio)
      })
      // console.log(TAG_NAME, '_filterVisibleStream list:', list)
      return list
    },
    _keepScreenOn () {
      setInterval(() => {
        wx.setKeepScreenOn({
          keepScreenOn: true,
        })
      }, 20000)
    },
    //  ______  __       __        ______             __                                              __
    //  |      \|  \     /  \      |      \           |  \                                            |  \
    //   \$$$$$$| $$\   /  $$       \$$$$$$ _______  _| $$_     ______    ______   _______    ______  | $$
    //    | $$  | $$$\ /  $$$        | $$  |       \|   $$ \   /      \  /      \ |       \  |      \ | $$
    //    | $$  | $$$$\  $$$$        | $$  | $$$$$$$\\$$$$$$  |  $$$$$$\|  $$$$$$\| $$$$$$$\  \$$$$$$\| $$
    //    | $$  | $$\$$ $$ $$        | $$  | $$  | $$ | $$ __ | $$    $$| $$   \$$| $$  | $$ /      $$| $$
    //   _| $$_ | $$ \$$$| $$       _| $$_ | $$  | $$ | $$|  \| $$$$$$$$| $$      | $$  | $$|  $$$$$$$| $$
    //  |   $$ \| $$  \$ | $$      |   $$ \| $$  | $$  \$$  $$ \$$     \| $$      | $$  | $$ \$$    $$| $$
    //   \$$$$$$ \$$      \$$       \$$$$$$ \$$   \$$   \$$$$   \$$$$$$$ \$$       \$$   \$$  \$$$$$$$ \$$

    /**
     * 初始化 IM SDK
     * @param {Object} config sdkAppID
     */
    _initIM (config) {
      console.log(this.tim)
      if (this.tim) {
        return
      }
      console.log(TAG_NAME, '_initIM', config)
      // 初始化 sdk 实例
      const tim = TIM.create({
        SDKAppID: config.sdkAppID || 1400335565,
      })
      // 0 普通级别，日志量较多，接入时建议使用
      // 1 release级别，SDK 输出关键信息，生产环境时建议使用
      // 2 告警级别，SDK 只输出告警和错误级别的日志
      // 3 错误级别，SDK 只输出错误级别的日志
      // 4 无日志级别，SDK 将不打印任何日志
      if (config.debugMode) {
        tim.setLogLevel(1)
      } else {
        tim.setLogLevel(4)
      }
      tim.off(TIM.EVENT.SDK_READY, this._onIMReady);
      tim.off(TIM.EVENT.MESSAGE_RECEIVED, this._onIMMessageReceived)
      tim.off(TIM.EVENT.SDK_NOT_READY, this._onIMNotReady)
      tim.off(TIM.EVENT.KICKED_OUT, this._onIMKickedOut)
      tim.off(TIM.EVENT.ERROR, this._onIMError)
      // 监听事件)
      tim.on(TIM.EVENT.SDK_READY, this._onIMReady, this);
      tim.on(TIM.EVENT.MESSAGE_RECEIVED, this._onIMMessageReceived, this)
      tim.on(TIM.EVENT.SDK_NOT_READY, this._onIMNotReady, this)
      tim.on(TIM.EVENT.KICKED_OUT, this._onIMKickedOut, this)
      tim.on(TIM.EVENT.ERROR, this._onIMError, this)
      this.tim = tim
      wx.tim = tim
      wx.$app = tim
      this._loginIM({ ...config, roomID: config.roomID })
    },
    _loginIM (params) {
      if (!this.tim) {
        return
      }
      console.log(TAG_NAME, '_loginIM', params)
      return this.tim.login({
        userID: params.userID,
        userSig: params.userSig,
      })
    },
    _logoutIM () {
      if (!this.tim) {
        return
      }
      console.log(TAG_NAME, '_logoutIM')
      return this.tim.logout()
    },
    _exitIM () {
      // 方法需要调用限制，否则重复解散群 退群会有warn
      if (this.data.exitIMThrottle || !this.tim) {
        return
      }
      this.data.exitIMThrottle = true
      // const userList = this.getRemoteUserList()
      const roomID = this.data.config.roomID
      const userID = this.data.config.userID
    },
    getConversationProfile() {
      let conversationID = 'C2C' + this.data.msgInfo.from
      let promise = this.tim.getConversationProfile(conversationID);
      promise.then(imResponse => {
        // 获取成功
        const { userProfile } = imResponse.data.conversation
      }).catch(function (imError) {
        console.warn('getConversationProfile error:', imError); // 获取会话资料失败的相关信息
      });
    },
    _onIMReady(event) {
      this.getConversationProfile()
      console.log(TAG_NAME, 'IM.SDK_READY', event)
      this._emitter.emit(EVENT.IM_SDK_READY, event)
      // this.getConversationProfile()
      // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
      // event.name - TIM.EVENT.SDK_READY
    },
    _onIMMessageReceived (event) {
      // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
      console.log(TAG_NAME, 'IM.MESSAGE_RECEIVED', event)
      // messageList 仅保留10条消息
      const messageData = event.data
      console.log(messageData)
      const roomID = this.data.config.roomID + ''
      const userID = this.data.config.userID + ''
      for (let i = 0; i < messageData.length; i++) {
        const message = messageData[i]
        // console.log(TAG_NAME, 'IM.MESSAGE_RECEIVED', message, this.data.config, TIM.TYPES.MSG_TEXT)
        if (message.to === roomID + '' || message.to === userID) {
          if (message.type == 'TIMCustomElem') {
            let userinfo = JSON.parse(message._elements[0].content.data)
            console.log(userinfo)
            let action = userinfo.action
            // if (action == 2 || action == 1 || action == 3) {
            //   this.exitRoom()
            //   wx.navigateBack({
            //     delta: 1
            //   })
            // }
          } 
          // 遍历messageData 获取当前room 或者当前user的消息
          this._emitter.emit(EVENT.IM_MESSAGE_RECEIVED, event)
        }
      }
      
    },
    _onIMNotReady (event) {
      console.log(TAG_NAME, 'IM.SDK_NOT_READY', event)
      this._emitter.emit(EVENT.IM_SDK_NOT_READY, event)
      // 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
      // event.name - TIM.EVENT.SDK_NOT_READY
    },
    _onIMKickedOut (event) {
      console.log(TAG_NAME, 'IM.KICKED_OUT', event)
      this._loginIM(this.data.config)
      this._emitter.emit(EVENT.IM_KICKED_OUT, event)
      // 收到被踢下线通知
      // event.name - TIM.EVENT.KICKED_OUT
      // event.data.type - 被踢下线的原因，例如 :
      //    - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
      //    - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
      //    - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢。使用前需要将SDK版本升级至v2.4.0或以上。
    },
    _onIMError (event) {
      console.log(TAG_NAME, 'IM.ERROR', event)
      this._emitter.emit(EVENT.IM_ERROR, event)
      // 收到 SDK 发生错误通知，可以获取错误码和错误信息
      // event.name - TIM.EVENT.ERROR
      // event.data.code - 错误码
      // event.data.message - 错误信息
    },
    _toggleVideo () {
      if (this.data.pusher.enableCamera) {
        this.unpublishLocalVideo()
      } else {
        this.publishLocalVideo()
      }
    },
    _toggleAudio () {
      if (this.data.pusher.enableMic) {
        this.unpublishLocalAudio()
      } else {
        this.publishLocalAudio()
      }
    },
    _debugToggleRemoteVideo (event) {
      console.log(TAG_NAME, '_debugToggleRemoteVideo', event.currentTarget.dataset)
      const userID = event.currentTarget.dataset.userID
      const streamType = event.currentTarget.dataset.streamType
      const stream = this.data.streamList.find((item) => {
        return item.userID === userID && item.streamType === streamType
      })
      if (stream.muteVideo) {
        this.subscribeRemoteVideo({ userID, streamType })
        // this.setViewVisible({ userID, streamType, isVisible: true })
      } else {
        this.unsubscribeRemoteVideo({ userID, streamType })
        // this.setViewVisible({ userID, streamType, isVisible: false })
      }
    },
    _debugToggleRemoteAudio (event) {
      console.log(TAG_NAME, '_debugToggleRemoteAudio', event.currentTarget.dataset)
      const userID = event.currentTarget.dataset.userID
      const streamType = event.currentTarget.dataset.streamType
      const stream = this.data.streamList.find((item) => {
        return item.userID === userID && item.streamType === streamType
      })
      if (stream.muteAudio) {
        this.subscribeRemoteAudio({ userID })
      } else {
        this.unsubscribeRemoteAudio({ userID })
      }
    },
    _debugToggleVideoDebug () {
      this.setData({
        debug: !this.data.debug,
      })
    },
    _debugExitRoom () {
      this.closeRoom()
    },
    _debugEnterRoom () {
      this.publishLocalVideo()
      this.publishLocalAudio()
      this.enterRoom({ roomID: this.data.config.roomID }).then(() => {
        // 进房后开始推送视频或音频
      })
    },
    _debugTogglePanel () {
      this.setData({
        debugPanel: !this.data.debugPanel,
      })
    },
    _toggleAudioVolumeType () {
      if (this.data.pusher.audioVolumeType === 'voicecall') {
        this._setPusherConfig({
          audioVolumeType: 'media',
        })
      } else {
        this._setPusherConfig({
          audioVolumeType: 'voicecall',
        })
      }
    },
    _toggleSoundMode () {
      if (this.data.userList.length === 0) {
        return
      }
      const stream = this.userController.getStream({
        userID: this.data.userList[0].userID,
        streamType: 'main',
      })
      if (stream) {
        if (stream.soundMode === 'speaker') {
          stream['soundMode'] = 'ear'
        } else {
          stream['soundMode'] = 'speaker'
        }
        this._setPlayerConfig({
          userID: stream.userID,
          streamType: 'main',
          config: {
            soundMode: stream['soundMode'],
          },
        })
      }
    },
    /**
     * 退出通话
     */
    _hangRoom () {
      console.log(this.data.msgInfo.type )
      console.log('参数')
      if (this.data.msgInfo.type == 1) {
        this.refuse()
      } else if (this.data.msgInfo.type == 2) {
        this.selfCloseVideo()
      }
      wx.navigateBack({
        delta: 1,
      })
      wx.setStorageSync('hangRoom', true)
    },
    _hangUp () {
      this.closeRoom()
      this.exitRoom()
      wx.navigateBack({
        delta: 1,
      })
      // let to = (this.data.msgInfo.to === this.data.config.userID) ? this.data.msgInfo.from : this.data.msgInfo.to
      // wx.redirectTo({
      //   url: '/pages/message/personalDialogBox?toUser=' + to + '&userID=' + this.data.config.userID
      // })
    },
    // 拒绝
    refuse() {
      var args = this.data.argsInfo
      args.action = 2
      const data = JSON.stringify(args)
      const message = this.tim.createCustomMessage({
        to: this.data.msgInfo.from,
        conversationType: TIM.TYPES.CONV_C2C,
        payload: {
          data: data,
          description: '',
          extension: ''
        }
      })
      let promise1 = this.tim.sendMessage(message)
      promise1.then(imResponse => {
        console.log('发送成功h')
        // this.exitRoom()
      
      }).catch(function (imError) {
        console.warn('sendMessage error:', imError);
      }); 
    },
    closeRoom() {
      var args = this.data.argsInfo
      let startTime = this.data.startTime
      if (startTime!== 0) {
        const endTime = new Date().getTime()
        args.duration = Math.round((endTime - startTime) / 1000)
        startTime = 0
      }
      args.action = 5
      const data = JSON.stringify(args)
      let to = (this.data.msgInfo.to === this.data.config.userID) ? this.data.msgInfo.from : this.data.msgInfo.to
      const message = this.tim.createCustomMessage({
        to: to,
        conversationType: TIM.TYPES.CONV_C2C,
        payload: {
          data: data,
          description: '',
          extension: ''
        }
      })
      let promise1 = this.tim.sendMessage(message)
      promise1.then(imResponse => {
        console.log('发送成功hhhhhhhhhh')
        // this.exitRoom()
      }).catch(function (imError) {
        console.warn('sendMessage error:', imError);
      }); 
      // clearTimeout(this.data.timeoutId)
    },
    // 自己取消视频
    selfCloseVideo() {
      var args = this.data.argsInfo
      args.action = 1
      const data = JSON.stringify(args)
      // 对方发起视频，接通成功后如果是我挂断的，这时挂断消息应该发给视频发起方
      let to = (this.data.msgInfo.to === this.data.config.userID) ? this.data.msgInfo.to: this.data.msgInfo.from 
      console.log(this.data.config.userID + '获取12222')
      console.log(this.data.msgInfo.to)
      const message = this.tim.createCustomMessage({
        to: this.data.msgInfo.to,
        conversationType: TIM.TYPES.CONV_C2C,
        payload: {
          data: data,
          description: '',
          extension: ''
        }
      })
      let promise1 = this.tim.sendMessage(message)
      promise1.then(imResponse => {
        console.log('发送成功dddd')
      }).catch(function (imError) {
        console.warn('sendMessage error:', imError);
      }); 
    },
    // 发起方等待接收方超过60s
    timeout() {
      var args = this.data.argsInfo
      args.action = 1
      this.setData({
        argsInfo: args
      })
      const data = JSON.stringify(args)
      const message = this.tim.createCustomMessage({
        to: this.data.msgInfo.to,
        conversationType: TIM.TYPES.CONV_C2C,
        payload: {
          data: data,
          description: '',
          extension: ''
        }
      })
      this.tim.sendMessage(message)
    },
    outVideo() {
      var args = this.data.argsInfo
      args.action = 6
      const data = JSON.stringify(args)
      const message = this.tim.createCustomMessage({
        to: this.data.msgInfo.to,
        conversationType: TIM.TYPES.CONV_C2C,
        payload: {
          data: data,
          description: '',
          extension: ''
        }
      })
      this.tim.sendMessage(message)
    },
    /**
     * grid布局, 唤起 memberlist-panel
     */
    _switchMemberListPanel () {
      this.setData({
        panelName: this.data.panelName !== 'memberlist-panel' ? 'memberlist-panel' : '',
      })
    },
    /**
     * grid布局, 唤起 setting-panel
     */
    _switchSettingPanel () {
      this.setData({
        panelName: this.data.panelName !== 'setting-panel' ? 'setting-panel' : '',
      })
    },
    _handleMaskerClick () {
      this.setData({
        panelName: '',
      })
    },
    _handleSnapshotClick (event) {
      wx.showToast({
        title: '开始截屏',
        icon: 'none',
        duration: 1000,
      })
      const userID = event.currentTarget.dataset.userid
      const streamType = event.currentTarget.dataset.streamtype
      this.snapshot({ userID, streamType })
    },
    /**
     * grid布局, 绑定事件
     */
    _bindEventGrid () {
      // 远端音量变更
      this.on(EVENT.REMOTE_AUDIO_VOLUME_UPDATE, (event) => {
        const data = event.data
        const userID = data.currentTarget.dataset.userid
        const streamType = data.currentTarget.dataset.streamtype
        const volume = data.detail.volume
        // console.log(TAG_NAME, '远端音量变更', userID, streamType, volume)
        const stream = this.userController.getStream({
          userID: userID,
          streamType: streamType,
        })
        if (stream) {
          stream.volume = volume
        }
        this.setData({
          streamList: this.data.streamList,
          visibleStreamList: this._filterVisibleStream(this.data.streamList),
        }, () => {
        })
      })
    },
    _toggleFullscreen (event) {
      console.log(TAG_NAME, '_toggleFullscreen', event)
      const userID = event.currentTarget.dataset.userID
      const streamType = event.currentTarget.dataset.streamType
      if (this._isFullscreen) {
        this.exitFullscreen({ userID, streamType }).then(() => {
          this._isFullscreen = false
        }).catch(() => {
        })
      } else {
        // const stream = this.userController.getStream({ userID, streamType })
        const direction = 0
        // 已知问题：视频的尺寸需要等待player触发NetStatus事件才能获取到，如果进房就双击全屏，全屏后的方向有可能不对。
        // if (stream && stream.videoWidth && stream.videoHeight) {
        //   // 如果是横视频，全屏时进行横屏处理。如果是竖视频，则为0
        //   direction = stream.videoWidth > stream.videoHeight ? 90 : 0
        // }
        this.enterFullscreen({ userID, streamType, direction }).then(() => {
          this._isFullscreen = true
        }).catch(() => {
        })
      }
    }
  }
})
