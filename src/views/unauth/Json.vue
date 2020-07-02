<template>
  <div class="container">
    <div class="title">{{ title }}</div>
    <div class="content">
      <div class="left">
        <el-input
          type="textarea"
          placeholder="请输入内容"
          @input="jsonformat"
          resize="none"
          v-model="inputData"
        >
        </el-input>
      </div>
      <div class="right">
        <json-view :data="jsonData" v-show="!errorInfoShow" />
        <div class="inputInfo" v-show="errorInfoShow">
          <p class="errorColor">{{errorDesc}}</p>
          <p v-html="inputMsg"></p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
<script>
import jsonView from "@/components/jsonView";
import Footer from "@/components/Footer.vue";
import Vue from "vue";
var _this;

//异常拦截处理
Vue.config.errorHandler = (err, vm, info) => {
  const position = "position";
  const positionIndex = err.message.indexOf(position);
  if (positionIndex != -1) {
    //js报错位置
    const errorIndex = err.message.substr(positionIndex + position.length + 1);
    _this.errorDesc = `在第${errorIndex}位置发生解析错误`
    //报错文字
    const errorText = _this.inputData.substr(errorIndex - 1, 3);
    //正则匹配前后{}
    const regex = "\\{((?!\\{|\\}).)*" + errorText + "((?!\\}).)*\\}";

    let inputMsg;
    if (_this.inputData.match(regex)) {
      inputMsg = _this.inputData.match(regex)[0];
      inputMsg = inputMsg.replace(
        errorText,
        `<span class="errorColor weight">${errorText}</span>`
      );
    } else {
      inputMsg = `<div class="errorColor">${_this.inputData}</div>`;
    }

    //高亮显示
    _this.inputMsg = inputMsg;
    _this.jsonData = {};
  }
  _this.errorInfoShow = true;
};

Vue.config.warnHandler = (err, vm, info) => {
  _this.inputMsg = `<p class="errorColor">${err}</p>`;
  _this.jsonData = {};

  _this.errorInfoShow = true;
};


export default {
  name: "Json",
  components: {
    jsonView,
    Footer,
  },
  data() {
    return {
      title: "JSON格式化",
      inputData: null,
      jsonData: {},
      errorInfoShow: true,
      inputMsg: "",
      errorDesc: "",
    };
  },
  created() {
    _this = this;
  },
  methods: {
    jsonformat(val) {
      if (!val) {
        return;
      }
      this.jsonData = JSON.parse(val.replace(/\\/g, ""));
      this.errorInfoShow = false;
    },
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
    width: 100%;
    height: 88%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .left,
    .right {
      width: 50%;
      height: 91%;
      background: #fff;
      border: 0.005208rem solid #999;
      position: relative;
    }
    .left {
      outline: none;
      .el-textarea {
        height: 100%;

        /deep/.el-textarea__inner {
          min-height: 100% !important;
          height: 100% !important;
        }
      }
    }
    .right {
      overflow: auto;
      .inputInfo {
        width: 90%;
        height: 88%;
        position: absolute;
        top: 0;
        background: #fff;
        letter-spacing: 1.5px;
        margin: 5%;
        overflow: auto;
      }
      p {
        color: #999;
        font-size: 0.119792rem;
        margin-top: 4%;
        word-break: break-all;
      }
      i {
        color: #088d13;
        margin-left: 77px;
        font-size: 40px;
      }
    }
  }
}
</style>
