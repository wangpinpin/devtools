<template>
  <div class="container">
    <div class="jsonBtn">
      <!-- <el-tooltip
        class="item"
        effect="dark"
        content="压缩"
        placement="bottom"
        @click.native="isCompressed = !isCompressed"
        :class="isCompressed ? 'active' : ''"
      >
        <el-button type="text" icon="el-icon-coin"></el-button>
      </el-tooltip> -->
      <el-tooltip
        class="item one"
        effect="dark"
        content="复制"
        placement="bottom"
      >
        <el-button
          type="text"
          icon="el-icon-document-copy"
          @click="copy()"
        ></el-button>
      </el-tooltip>
      <el-tooltip
        class="item two"
        effect="dark"
        content="清空"
        placement="bottom"
      >
        <el-button
          type="text"
          icon="el-icon-delete"
          @click="clear()"
        ></el-button>
      </el-tooltip>
    </div>
    <div class="jsonScroll">
      <el-scrollbar>
        <json-view :data="jsonData" v-show="!errorInfoShow" />
        <div class="inputInfo" v-show="errorInfoShow">
          <p class="errorColor">{{ errorDesc }}</p>
          <p v-html="inputMsg"></p>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import jsonView from "@/assets/js/jsonView";

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
    let regex = "{[^{|}]*" + errorText + "[^{|}]*}";

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
  if (!_this.inputData) {
    _this.inputMsg = "";
    _this.errorDesc = "";
  }
};

export default {
  name: "Json",
  components: {
    jsonView,
  },
  props: {
    json: {
      type: String,
    },
  },

  watch: {
    json: function(indexVal, oldVal) {
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
      isCompressed: false,
    };
  },
  methods: {
    //清空
    clear() {
      (this.inputData = null),
        (this.errorInfoShow = true),
        (this.inputMsg = ""),
        (this.errorDesc = ""),
        (this.jsonData = ""),
        this.$emit("clearText", this.inputData);
    },
    //复制
    copy() {
      this.$copyText(JSON.stringify(this.jsonData, null, 2)).then(() => {
        this.$message({
          message: "复制成功",
          type: "success",
          duration: 0
        });
      });
    },
  },
  created() {
    _this = this;
  },
};
</script>
<style lang="less" scoped>
.container {
  position: relative;
  .inputInfo {
    width: 90%;
    height: 88%;
    position: absolute;
    top: 0;
    background: #fff;
    letter-spacing: 1.5px;
    margin: 4.4%;
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
    margin-left: 0.77rem;
    font-size: 0.4rem;
  }
  .jsonBtn {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    border-bottom: 0.01rem solid #999;
    z-index: 2;
    height: 0.5rem;
    button {
      position: absolute;
      top: 0.05rem;
      width: 0.6rem;
      padding: 0.06rem 0;
      /deep/i {
        font-size: 0.24rem;
        color: #999;
      }
      &:hover,
      &:active,
      &.active {
        /deep/i {
          color: #409eff;
        }
      }
    }
    .two {
      left: 0.4rem;
    }
  }
  .jsonScroll {
    padding-top: 0.7rem;
    height: 100%;
    box-sizing: border-box;
  }
  /deep/.el-scrollbar {
    width: 100%;
    height: 100%;
    .el-scrollbar__wrap {
      overflow: auto;
    }
  }
}
</style>
