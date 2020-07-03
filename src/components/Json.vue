<template>
  <div class="container">
    <json-view :data="jsonData" v-show="!errorInfoShow" />
    <div class="inputInfo" v-show="errorInfoShow">
      <p class="errorColor">{{ errorDesc }}</p>
      <p v-html="inputMsg"></p>
    </div>
  </div>
</template>

<script>
import jsonView from "@/assets/js/jsonView";
import Vue from "vue";

var _this;

//异常拦截处理
Vue.config.errorHandler = (err, vm, info) => {
  const position = "position";
  const positionIndex = err.message.indexOf(position);
  if (positionIndex != -1) {
    //js报错位置
    const errorIndex = err.message.substr(positionIndex + position.length + 1);
    _this.errorDesc = `在第${parseInt(errorIndex + 1)}位置发生解析错误`;
    //报错文字
    const errorText = _this.inputData.substr(errorIndex - 1, 3);
    //正则匹配前后{}
    let regex = "\\{((?!\\{|\\}).)*" + errorText + "((?!\\}).)*\\}";

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
    _this.errorInfoShow = true;
  }
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
  },
  props: {
    json: {
      type: Object,
      required: false,
    },
  },

  watch: {
    json: function(indexVal, oldVal) {
      if (!indexVal) {
        return;
      }
      this.inputData = indexVal;
      this.jsonData = JSON.parse(indexVal.replace(/\\/g, ""));
      this.errorInfoShow = false;
    },
  },
  data() {
    return {
      inputData: "",
      errorInfoShow: true,
      inputMsg: "",
      errorDesc: "",
      jsonData: {},
    };
  },
  created() {
    _this = this;
  },
};
</script>
<style lang="less" scoped>
.container {
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
</style>
