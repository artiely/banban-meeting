<template>
  <div class="hello">
    <div v-if="!joined">
      <md-input-item
        preview-type="text"
        v-model="name"
        title="真实姓名或花名"
        maxlength="8"
        placeholder="请输入真实姓名或花名"
        is-title-latent
        :error="error_name"
      ></md-input-item>
      <br />
      <md-button type="primary" @click="greet">加入</md-button>
    </div>
    <div v-else>
      <md-input-item
        preview-type="text"
        v-model="message"
        title="请输入"
        placeholder="请输入"
        :error="error_message"
        is-title-latent
      ></md-input-item>
      <md-button type="primary" @click="send">发送</md-button>

      <md-button @click="danmuSettingVisible = true">设置弹幕样式</md-button>
      <md-icon name="message" size="lg"></md-icon>
      <div
        class="messageitem"
        :class="item.uid ? '' : 'active'"
        v-for="(item, i) in msgList"
        :key="i"
      >
        {{ item.name }}:{{ item.text }}
      </div>
      <span ref="link"></span>
    </div>
    <div
      ref="danmuArea"
      id="vs"
      style="
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: -1;
        background: #fafafa;
      "
    ></div>
    <!-- 弹幕设置 -->
    <md-popup v-model="danmuSettingVisible" position="right">
      <div
        class="md-example-popup md-example-popup-right"
        style="height: 100%; width: 300px; background: #fff"
      >
        样式

        <md-field>
          <md-cell-item title="弹幕颜色">
            <input
              type="color"
              class="color"
              v-model="style.color"
              slot="right"
            />
          </md-cell-item>
          <md-cell-item title="弹幕背景">
            <input
              type="color"
              class="color"
              v-model="style.background"
              slot="right"
            />
          </md-cell-item>
          <md-cell-item title="弹幕大小" brief="滑动下方卡尺设置">
            <span slot="right">{{ fontSize }}</span>
          </md-cell-item>
          <md-ruler
            :scope="[10, 40]"
            :step="10"
            :unit="1"
            :max="40"
            :min="10"
            v-model="fontSize"
          ></md-ruler>
        </md-field>
      </div>
    </md-popup>
  </div>
</template>

<script>
import {
  Button,
  InputItem,
  Icon,
  Popup,
  Field,
  CellItem,
  RadioBox,
  Ruler,
} from "mand-mobile";
import RTMClient from "../agora-rtm-client";
export default {
  name: "HelloWorld",
  components: {
    "md-button": Button,
    "md-input-item": InputItem,
    "md-icon": Icon,
    "md-popup": Popup,
    [Field.name]: Field,
    [CellItem.name]: CellItem,
    [RadioBox.name]: RadioBox,
    [Ruler.name]: Ruler,
  },
  data() {
    return {
      danmuSettingVisible: false,
      name: "",
      styleIndex: 0,
      joined: false,
      message: "",
      error_name: "",
      error_message: "",
      rtm: null,
      msgList: [],
      danmaku: null,
      fontSize: 20,
      style: {
        color: "#000",
        background: "transparent",
        fontSize: "20px",
        border: "1px solid #337ab7",
      },
    };
  },
  methods: {
    greet() {
      if (this.name == "") {
        this.error_name = "请认真填写哟";
        return;
      }
      this.error_name = "";
      this.joined = true;
      this.rtm = new RTMClient();

      this.rtm.joinChannel();

      this.rtm.on("ChannelMessage", ({ text }, uid) => {
        let msgobj = JSON.parse(text);

        this.msgList.push({
          uid: uid,
          name: msgobj.name,
          text: msgobj.text,
        });
      });
    },
    send() {
      if (!this.message) {
        this.error_message = "请输入内容哟";
        return;
      }
      this.error_message = "";
      let message = {
        text: this.message,
        style: { ...this.style, fontSize: this.fontSize + "px" },
        name: this.name,
      };
      this.rtm.sendMessage(JSON.stringify(message)).then(() => {
        this.msgList.push(message);
        // this.message = "";
      });
    },
  },
};
</script>

<style scoped lang="less">
.messageitem {
  font-size: 24px;
  color: #666;
  padding: 10px;
  &.active {
    border: 1px solid #abcdef;
  }
}
.color {
  flex: 1;
}
.hello h1 {
  color: #333;
  line-height: 1.15;
  font-size: 64px;
  margin-bottom: 32px;
}

.hello h1 span {
  position: relative;
}

.hello h1 span::after {
  content: "";
  position: absolute;
  z-index: -1;
  left: 0;
  bottom: 8px;
  width: 100%;
  height: 20px;
  background: #ecf6ff;
}
</style>
