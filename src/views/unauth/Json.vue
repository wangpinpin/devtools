<template>
  <div class="container">
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
          <p>{{ inputMsg }}</p>
          <i class="iconfont" v-show="errorInfoShow && iconShow">&#xe729;</i>
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
    const errorIndex = err.message.substr(positionIndex + position.length + 1);

    //正则匹配前后{}
    const regex =
      "\\{((?!\\{|\\}).)*" +
      _this.inputData.substr(errorIndex - 1, 3) +
      "((?!\\}).)*\\}";
    _this.inputMsg = _this.inputData.match(regex) ? _this.inputData.match(regex) : _this.inputData.substr(errorIndex - 1, 3);
  }
  _this.errorInfoShow = true;
  _this.iconShow = true;
};
Vue.config.warnHandler = (err, vm, info) => {
  _this.inputMsg = err;
  _this.errorInfoShow = true;
  _this.iconShow = true;
};
export default {
  name: "Json",
  components: {
    jsonView,
    Footer,
  },
  data() {
    return {
      inputData: null,
      jsonData: {},
      errorInfoShow: true,
      iconShow: false,
      inputMsg: "",
    };
  },
  created() {
    _this = this;
  },
  methods: {
    jsonformat(val) {
      console.log(1)
      if(!val) {
        return;
      }
      this.jsonData = JSON.parse(val);
      this.errorInfoShow = false;
      this.iconShow = false;

    },
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .left,
    .right {
      width: 50%;
      height: 78%;
      background: #fff;
      border: 0.005208rem solid #999;
      position: relative;
      margin-top: 3%;
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
        height: 100%;
        position: absolute;
        top: 0;
        background: #fff;
        letter-spacing: 1.5px;
        margin: 5%;
      }
      p {
        color: red;
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
