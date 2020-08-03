<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>
    <div class="content">
      <div class="left">
        <el-input
          id="aa"
          type="textarea"
          placeholder="请输入内容"
          resize="none"
          v-model="inputData"
        >
        </el-input>
      </div>
      <div class="right">
        <!-- <json-viewer :value="jsonData" copyable sort></json-viewer> -->
        <Json :json="inputData" @clearText="clearText" />
      </div>
    </div>
    <Footer />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Json from "@/components/Json.vue";

export default {
  name: "JsonFormat",
  components: {
    Header,
    Json,
    Footer,
  },
  data() {
    return {
      title: "JSON格式化",
      inputData: null,
    };
  },
  created() {},

  methods: {
    //清空
    clearText(data) {
      this.inputData = data;
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
  }
  .content {
    width: 100%;
    height: 75%;
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
          border-radius: 0;
          border: 0;
          &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          &::-webkit-scrollbar-thumb {
            border-radius: 3px;
            -moz-border-radius: 3px;
            -webkit-border-radius: 3px;
            background-color: rgba(144, 147, 153, 0.3);
          }
          &::-webkit-scrollbar-track {
            background-color: transparent;
          }
          &:focus {
            -webkit-box-shadow: 0 -1px 10px #3eb0d361;
            box-shadow: 0 -1px 10px #3eb0d361;
          }
        }
      }
    }
    .right {
      overflow: auto;
    }
  }
}
@media screen and (max-width: 900px) {
  .container {
    .title {
      font-size: 100px;
      margin-top: 5%;
    }
    .content {
      flex-direction: column;
      .left,
      .right {
        width: 100%;
        height: 50%;
      }
    }
  }
}
</style>
