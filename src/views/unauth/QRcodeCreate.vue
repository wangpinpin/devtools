<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>
    <div class="content">
      <div class="left">
        <div v-if="!isSuccess">
          <el-popover
            placement="top-start"
            width="100"
            trigger="manual"
            content="请输入正确的url"
            v-model="visible"
          >
            <el-input
              type="input"
              placeholder="http://"
              v-model="inputData"
              slot="reference"
              :class="visible ? 'invalid' : ''"
            ></el-input>
          </el-popover>
          <el-button class="btn" type="success" @click="bindQRCode()" id="create-qrcode"
            >生成二维码</el-button
          >
        </div>
        <div v-else>
          <p class="urlText">{{ inputData }}</p>
          <el-button class="btn" @click="initCode()">再建一个</el-button>
        </div>
      </div>
      <div class="right">
        <div id="qrCode" ref="qrCodeDiv"></div>
        <span v-show="!isSuccess" class="tip" @click="visible = true"
          >此处生成二维码</span
        >
        <el-button
          v-if="isSuccess"
          class="btn-download"
          type="success"
          @click="downloadCode()"
          >保存图片</el-button
        >
        <el-tabs
          v-if="isSuccess"
          class="settings"
          v-model="activeName"
          type="border-card"
        >
          <el-tab-pane class="tab-1" label="颜色" name="first">
            <div class="item">
              <p>二维码颜色</p>
              <el-color-picker
                v-model="colorDark"
                show-alpha
                @change="changeColor()"
              ></el-color-picker>
            </div>
            <div class="item">
              <p>背景色</p>
              <el-color-picker
                v-model="colorLight"
                show-alpha
                @change="changeColor()"
              ></el-color-picker>
            </div>
          </el-tab-pane>
          <el-tab-pane class="tab-2" label="设置" name="second">
            <div class="item">
              <span>大小</span>
              <el-slider
                class="item-options"
                v-model="size"
                :min="50"
                :max="1000"
                :format-tooltip="formatTooltip"
                @change="qrcode()"
              >
              </el-slider>
            </div>
            <div class="item">
              <span>容错</span>
              <el-select
                class="item-options"
                v-model="selectLevelValue"
                @change="qrcode()"
              >
                <el-option
                  v-for="item in levelOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                >
                </el-option>
              </el-select>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <Footer />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import QRCode from "qrcodejs2";

export default {
  name: "QRcodeCreate",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      title: "二维码生成",
      inputData: "",
      size: 200, // 二维码尺寸
      colorDark: "#333333", //二维码颜色
      colorLight: "#ffffff", //二维码背景色
      levelOptions: [
        { value: "L", label: "7%" },
        { value: "M", label: "15%" },
        { value: "H", label: "30%" },
      ],
      selectLevelValue: "H", //容错率，L/M/H
      visible: false, // url输入框验证失败提示是否显示
      isSuccess: false, // 是否生成成功
      activeName: "first", // 设置TAB活动页
    };
  },
  created() {},
  methods: {
    qrcode() {
      this.$refs.qrCodeDiv.innerHTML = "";
      new QRCode(this.$refs.qrCodeDiv, {
        text: this.inputData,
        width: this.size,
        height: this.size,
        colorDark: this.colorDark,
        colorLight: this.colorLight,
        correctLevel: QRCode.CorrectLevel[this.selectLevelValue],
      });
    },
    // 生成二维码
    bindQRCode() {
      let url = this.inputData.replace(/\s+/g, "").toLowerCase();
      if (/^(https?|ftp|file):/.test(url)) {
        this.visible = false;
        this.isSuccess = true;
        this.qrcode();
      } else {
        this.visible = true;
      }
    },
    // 重新创建二维码
    initCode() {
      this.$refs.qrCodeDiv.title = "";
      this.$refs.qrCodeDiv.innerHTML = "";
      this.isSuccess = false;
      this.inputData = "";
    },
    // 下载二维码图片
    downloadCode() {
      let a = document.createElement("a");
      a.download = "pic";
      a.href = this.$refs.qrCodeDiv.lastChild.currentSrc;
      a.click();
    },
    // 调整二维码颜色
    changeColor() {
      (this.colorDark = null == this.colorDark ? "#333333" : this.colorDark),
        (this.colorLight =
          null == this.colorLight ? "#ffffff" : this.colorLight),
        this.qrcode();
    },
    // 格式化尺寸值
    formatTooltip(val) {
      return `${val}px`;
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;

  .title {
    font-size: .4rem;
    text-align: center;
    color: #7c96b1;
    margin-top: .2rem;
  }
  .content {
    width: 88%;
    height: 70%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    .left,
    .right {
      text-align: center;
    }
    .left {
      width: 58%;
      margin-right: 8%;
      .el-input {
        &.invalid {
          /deep/.el-input__inner {
            border-color: red;
          }
        }
      }
      /deep/.el-input__inner {
        height: .8rem;
        line-height: .8rem;
        font-size: .2rem;
        outline: none;
        border: 1px dashed transparent;
        &:focus {
          -webkit-box-shadow: 0 -1px 10px #3eb0d361;
          box-shadow: 0 -1px 10px #3eb0d361;
        }
      }
      .urlText {
        min-height: .8rem;
        font-size: .2rem;
        background-color: #fff;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        word-break: break-all;
        padding: .1rem .2rem;
      }
    }
    .btn {
      margin-top: .4rem;
    }
    .right {
      width: 3.5rem;
      position: relative;
          line-height: 0;
      .tip {
        font-size: 0.1rem;
        color: #999;
        cursor: pointer;
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
      }
      .tab-1 {
        .item {
          width: 40%;
          display: inline-block;
          p {
            color: #000;
            font-size: .18rem;
            margin: 0;
            line-height: .4rem;
          }
        }
      }
      .tab-2 {
        .item {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            color: #000;
            font-size: .18rem;
            margin: 0;
            line-height: .4rem;
          }
          .item-options {
            width: 80%;
          }
        }
      }
    }
    #qrCode {
      width: 3.5rem;
      height: 3.5rem;
      background-color: #fff;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      /deep/img {
        max-width: 95%;
      }
    }
    .btn-download {
      width: 100%;
    }
    .settings {
      .el-button {
        margin: 0.05rem .1rem;
      }
    }
  }
}
/deep/.el-color-picker {
    height: unset;
}
/deep/.el-slider__button-wrapper {
  top: -14px !important;
  line-height: 0;
}
@media screen and (max-width: 900px) {
  .container .content{
    display: block;
    .left{
      width: 100%;
      margin: 0;
      margin-bottom: 0.4rem;
    }
    .right{
      margin: 0 auto;
    }
  }
}
</style>
