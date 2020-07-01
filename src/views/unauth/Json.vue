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
        <json-view :data="jsonData" />
        <div class="inputInfo" v-show="inputInfoshow">{{inputMsg}}</div>
      </div>
    </div>
    <Footer />
  </div>
</template>
<script>
import jsonView from "@/components/jsonView";
import Footer from "@/components/Footer.vue";
import Vue from 'vue'

Vue.config.errorHandler = function(err, vm, info) {
  const errorMsg = "Unexpected string in JSON at position ";
  if(err.message.startsWith(errorMsg)) {
    const errorIndex = err.message.substr(errorMsg.length, 4)
    this.inputMsg = vm.$options.propsData.value.substr(errorIndex - 10, errorIndex + 10)

  }
  console.log(err)
}

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
      inputInfoshow: true,
      inputMsg: ""
    };
  },
  created() {},
  methods: {
    jsonformat(val) {
      this.jsonData = JSON.parse(val);
      this.inputInfoshow = false
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
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        background: #fff;
      }
    }
  }
}
</style>
