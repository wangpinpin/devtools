<template>
  <div class="container">
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
          <el-button class="btn" type="success" @click="bindQRCode()"
            >生成二维码</el-button
          >
        </div>
        <div v-if="isSuccess">
          <p class="urlText">{{ inputData }}</p>
          <el-button class="btn" @click="initCode()">再建一个</el-button>
        </div>
      </div>
      <div class="right">
        <div id="qrCode" ref="qrCodeDiv"></div>
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
          <el-tab-pane label="LOGO" name="first">
            <el-upload>
              <el-button>上传LOGO</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="颜色" name="second">
            <el-button class="" @click="">二维码颜色</el-button>
            <el-button class="" @click="">背景色</el-button>
          </el-tab-pane>
          <el-tab-pane label="设置" name="third"> </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <Footer />
  </div>
</template>
<script>
import Footer from "@/components/Footer.vue";
import QRCode from "qrcodejs2";

export default {
  name: "QRcodeCreate",
  components: {
    Footer,
  },
  data() {
    return {
      title: "二维码生成",
      inputData: null,
      size: 200, // 二维码尺寸
      colorDark: "#333333", //二维码颜色
      colorLight: "#ffffff", //二维码背景色
      correctLevel: QRCode.CorrectLevel.L, //容错率，L/M/H
      visible: false, // url输入框验证失败提示是否显示
      isSuccess: false, // 是否生成成功
      activeName: "first", // 设置TAB活动页
    };
  },
  created() {},
  methods: {
    // 生成二维码
    bindQRCode() {
      let strRegex =
        "^((https|http|ftp|rtsp|mms)?://)" +
        "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" + //ftp的user@
        "(([0-9]{1,3}.){3}[0-9]{1,3}" + // IP形式的URL- 199.194.52.184
        "|" + // 允许IP和DOMAIN（域名）
        "([0-9a-z_!~*'()-]+.)*" + // 域名- www.
        "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." + // 二级域名
        "[a-z]{2,6})" + // first level domain- .com or .museum
        "(:[0-9]{1,4})?" + // 端口- :80
        "((/?)|" + // a slash isn't required if there is no file name
        "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
      let re = new RegExp(strRegex);
      if (re.test(this.inputData)) {
        this.visible = false;
        this.isSuccess = true;
        document.getElementById("qrCode").innerHTML = "";
        new QRCode(this.$refs.qrCodeDiv, {
          text: this.inputData,
          width: this.size,
          height: this.size,
          colorDark: this.colorDark,
          colorLight: this.colorLight,
          correctLevel: this.correctLevel,
        });
      } else {
        this.visible = !this.visible;
      }
    },
    // 重新创建二维码
    initCode() {
      document.getElementById("qrCode").innerHTML = "";
      this.isSuccess = false;
      this.inputData = "";
    },
    // 下载二维码图片
    downloadCode() {
      let a = document.createElement("a");
      a.download = "pic";
      a.href = document.getElementById("qrCode").lastChild.currentSrc;
      a.click();
    },
    // 二维码设置
    popSettings() {},
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;

  .title {
    font-size: 40px;
    text-align: center;
    color: #fff;
    padding-top: 40px;
  }
  .content {
    width: 88%;
    height: 88%;
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
        height: 80px;
        line-height: 80px;
        font-size: 20px;
        outline: none;
        border: 1px dashed transparent;
        &:focus {
          -webkit-box-shadow: 0 -1px 10px #3eb0d361;
          box-shadow: 0 -1px 10px #3eb0d361;
        }
      }
      .urlText {
        height: 80px;
        line-height: 80px;
        font-size: 20px;
        background-color: #fff;
        margin: 0;
      }
    }
    .btn {
      margin-top: 40px;
    }
    .right {
      width: 350px;
    }
    #qrCode {
      width: 350px;
      height: 350px;
      background-color: #fff;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-download {
      width: 100%;
    }
    .settings {
      .el-button {
        margin: 5px 10px;
      }
    }
  }
}
</style>
