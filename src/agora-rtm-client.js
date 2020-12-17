import AgoraRTM from "agora-rtm-sdk";
import EventEmitter from "events";
import {v4 as uuid} from "uuid";
import Danmaku from "danmaku/dist/esm/danmaku.dom.js";
let _uid = `${uuid()}`;
export default class RTMClient {
  constructor() {
    // Options for joining a channel
    this.option = {
      appId: "e05fb970e72f484992a4dd012e302162",
      channel: "banban2020",
      uid: _uid,
      token: "",
    };
    this.client = null;
    this.channel = null;
    this._eventBus = new EventEmitter();
    this.danmaku = null
  }
  initDanmuku(){
    this.danmaku = new Danmaku({
      container: document.getElementById("vs"),
      comments: [],
      engine: "DOM",
      speed: 144,
    });
    window.addEventListener("resize", this.resize);
  }
  resize() {
    this.danmaku.resize();
  }
  sendComment(message) {
    console.log("🚀 ~ file: agora-rtm-client.js ~ line 34 ~ RTMClient ~ sendComment ~ this.danmaku", this.danmaku)
    this.danmaku.emit({
      text: message.text,
      // 默认为 rtl（从右到左），支持 ltr、rtl、top、bottom。
      mode: "bottom",
      // 在使用 DOM 引擎时，该函数应当返回一个 HTMLElement。
      render: function () {
        var $div = document.createElement("div");
        let style = {
          fontSize: "20px",
          color: "#333",
          border: "1px solid #337ab7",
          ...message.style,
        };
        $div.style.fontSize = style.fontSize;
        $div.style.color = style.color;
        $div.style.baorder = style.baorder;
        $div.style.textShadow = style.textShadow;
        $div.style.background = style.background;

        $div.innerHTML = message.name + ":" + message.text;
        return $div;
      },
    });
  }
  // 登录
  login() {
    this.client = AgoraRTM.createInstance(this.option.appId);
    const client = this.client;
    this.initDanmuku()

    return new Promise((resolve, reject) => {
      client
        .login({ token: null, uid: _uid })
        .then(() => {
          console.log("AgoraRTM client login success");
          resolve();
        })
        .catch((err) => {
          console.log("AgoraRTM client login failure", err);
          reject();
        });
    });
  }
  // 加入频道
  joinChannel() {
    return new Promise((resolve, reject) => {
      this.login().then(() => {
        const client = this.client;
        // 创建并加入频道
        this.channel = client.createChannel(this.option.channel); // 此处传入频道 ID
        this.channel
          .join()
          .then(() => {
            this.clientListener();
            /* 加入频道成功的处理逻辑 */
            resolve();
          })
          .catch((error) => {
            /* 加入频道失败的处理逻辑 */
            reject(error);
          });
      });
    });
  }
  sendMessage(text) {
    return new Promise((resolve, reject) => {
      this.channel
        .sendMessage({ text })
        .then((res) => {
          /* 频道消息发送成功的处理逻辑 */
          resolve(res);
        })
        .catch((error) => {
          /* 频道消息发送失败的处理逻辑 */
          reject(error);
        });
    });
  }
  clientListener() {
    const client = this.client;

    // 监听连接状态改变
    client.on("ConnectionStateChanged", (newState, reason) => {
      console.log(
        "on connection state changed to " + newState + " reason: " + reason
      );
      this._eventBus.emit("ConnectionStateChanged", newState, reason);
    });

    this.channel.on("ChannelMessage", ({ text }, senderId) => {
      // text 为收到的频道消息文本，senderId 为发送方的 User ID
      /* 收到频道消息的处理逻辑 */
      this._eventBus.emit("ChannelMessage", { text }, senderId);

      this.sendComment(JSON.parse(text))
    });
  }

  on(eventName, callback) {
    this._eventBus.on(eventName, callback);
  }

  leaveChannel() {
   
  }
}
