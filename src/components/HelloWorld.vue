<template>
  <div class="hello">
    <img src="./banner1.png" style="width: 100%; margin-top: 20px" alt="" />
    <div>
      <textarea
        name=""
        id=""
        cols="30"
        rows="10"
        placeholder="请输入"
        v-model="message"
        class="input"
      ></textarea>
      <div class="btn-group">
        <div class="btn btn1" @click="danmuSettingVisible = true">弹幕设置</div>
        <div class="btn btn2" type="primary" @click="send">发送弹幕</div>
      </div>
    </div>
    <img src="./banner2.png" class="banner2" alt="" />

    <!-- 弹幕设置 -->
    <md-popup v-model="danmuSettingVisible" position="bottom">
      <div
        class="md-example-popup md-example-popup-right"
        style="
          height: 100%;
          background: #fff;
          border-top-left-radius: 40px;
          border-top-right-radius: 40px;
          overflow: hidden;
        "
      >
        <md-field>
          <md-radio-list :options="banks" v-model="myBank" icon-size="lg">
            <template slot-scope="{ option }">
              <div class="cell-item" :style="{ background: option.background }">
                <div class="icon"></div>
                <div class="name" :style="{ color: option.nameColor }">
                  用户名称
                </div>
                <div class="text">未来已来！</div>
              </div>
            </template>
          </md-radio-list>
        </md-field>
        <div class="bottom-btn" @click="danmuSettingVisible = false">确定</div>
      </div>
    </md-popup>
  </div>
</template>

<script>
import {
  Popup,
  Field,
  CellItem,
  RadioBox,
  Ruler,
  RadioList,
  Toast,
} from "mand-mobile";
import RTMClient from "../agora-rtm-client";
export default {
  name: "HelloWorld",
  components: {
    "md-popup": Popup,
    [Field.name]: Field,
    [CellItem.name]: CellItem,
    [RadioBox.name]: RadioBox,
    [Ruler.name]: Ruler,
    [RadioList.name]: RadioList,
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
      myBank: 0,
      banks: [
        {
          value: 0,
          nameColor: "#FFF000",
          background: "rgba(0, 0, 0, 0.5)",
        },
        {
          value: 1,
          nameColor: "#FFA7F9FF",
          background: "linear-gradient(270deg, #A8DFBE 0%, #7DA7E7 100%)",
        },
        {
          value: 2,
          nameColor: "#FFF000",
          background: "linear-gradient(270deg, #FFE1D6 0%, #FF82A7 100%)",
        },
        {
          value: 3,
          nameColor: "#FFF000",
          background: "linear-gradient(270deg, #D8B6FF 0%, #1EAE98 100%)",
        },
        {
          value: 4,
          nameColor: "#FFA7F9FF",
          background: "linear-gradient(270deg, #FFB9BE 0%, #A9F0DF 100%)",
        },
        {
          value: 5,
          nameColor: "rgba(146, 99, 70, 1)",
          background: "linear-gradient(270deg, #FFDB80 0%, #EAA286 100%)",
        },
      ],
    };
  },
  computed: {
    style() {
      return {
        color: this.banks[this.myBank].nameColor,
        background: this.banks[this.myBank].background,
      };
    },
  },
  created() {
    this.greet();
  },
  methods: {
    greet() {
      this.joined = true;
      this.rtm = new RTMClient();
      this.rtm.joinChannel();
    },
    send() {
      if (!this.message) {
        Toast.info("请先输入哟");
        return;
      }
      this.error_message = "";
      let message = {
        text: this.message,
        style: { ...this.style },
        name: this.name,
      };
      this.rtm.sendMessage(JSON.stringify(message)).then(() => {
        this.msgList.push(message);
        this.message = "";
        Toast.succeed("已发送", 1000, false);
      });
    },
  },
};
</script>
<style lang="stylus">
.md-radio-list {
  .md-cell-item-body {
    padding-top: 0 !important;

    &::before {
      display: none !important;
    }
  }
}

.md-radio.is-checked .md-radio-icon {
  color: rgba(217, 78, 25, 1) !important;
}
</style>
<style scoped lang="less">
.bottom-btn {
  width: 750px;
  height: 120px;
  background: #d94e19;
  border-radius: 40px 40px 0px 0px;

  font-weight: 500;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}
.banner2 {
  width: 100%;
  display: block;
  margin: 65px auto;
}
.input {
  width: 600px;
  height: 150px;
  margin: 40px auto;
  display: block;
  outline: none;
  border: none;
  border-radius: 20px;
  font-size: 28px;
  padding: 20px;
  box-sizing: border-box;
}
.cell-item {
  width: 588px;
  height: 96px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 48px;

  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 500;
  .icon {
    width: 80px;
    height: 80px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    margin-left: 8px;
  }
  .name {
    font-size: 28px;
    padding: 10px;
  }
  .text {
    font-size: 28px;
    color: #fff;
  }
}
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
.hello {
  background: linear-gradient(0deg, #dc2e22 0%, #d85018 100%);
  min-height: 100vh;
  height: 100%;
  .btn-group {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
  .btn {
    width: 230px;
    height: 90px;
    border-radius: 45px;
    background: #00b5eb;
    box-shadow: 0 10px 3px 4px #0575c5;
    font-size: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    &.btn1 {
      color: #fff;
    }
    &.btn2 {
      color: rgba(68, 23, 9, 1);
      background: rgb(244 221 89);
      box-shadow: 0 10px 3px 4px rgb(244 176 35);
    }
  }
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
