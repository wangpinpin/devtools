<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>
    <div class="content">
      <div class="left">
        <el-upload
          ref="upload"
          drag
          class="upload"
          action="https://api.wangpinpin.com/unAuth/imgToText"
          :limit="1"
          :auto-upload="false"
          :before-upload="beforUpload"
          :file-list="fileList"
          :on-remove="removeFile"
          :on-exceed="exceedFile"
          :http-request="coustomUpload"
          :on-change="onChange"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">
            只能上传jpg/png文件, 且不超过{{ formMaxSize }}M
          </div>
        </el-upload>
        <!-- <div class="language">
          <el-button type="success" @click="upload" id="img-to-text"
            >提取文字</el-button
          >
        </div> -->
      </div>
      <div class="right">
        <div class="copy" @click="copy">复制</div>
        <div class="textScroll" ref="textscroll">
          <el-scrollbar>
            <div class="text" ref="text" v-html="text"></div>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import axios from "axios";

export default {
  name: "ColorTransfer",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      title: "图片文字提取",
      fileList: [],
      formMaxSize: 1,
      text: "",
      loading: "",
    };
  },
  created() {},
  methods: {
    onChange(file) {
      if (file.raw) {
        this.upload();
      }
    },
    //上传前操作
    beforUpload(file) {
      // 验证文件大小
      if (file.size / 1024 / 1024 > this.formMaxSize) {
        this.$message({
          message: `上传文件大小不能超过${this.formMaxSize}M!`,
          type: "warning",
        });
        return false;
      }

      // 验证文件类型
      var fileType = file.name
        .substring(file.name.lastIndexOf(".") + 1)
        .toLowerCase();
      if (fileType != "jpg" && fileType != "png") {
        this.$message({
          message: "上传文件只能是jpg/png格式!",
          type: "warning",
        });
        return false;
      }

      this.loading = this.$loading.service({
        target: this.$refs.textscroll,
      });
      return true;
    },

    //上传图片到服务器
    upload() {
      this.$refs.upload.submit();
    },

    //自定义上传方法
    coustomUpload(data) {
      var formData = new FormData();
      formData.append("file", data.file);

      this.$http.post("unAuth/imgToText", formData).then((res) => {
        this.loading.close();
        if (res && res.words_result) {
          let words = "";
          res.words_result.forEach((e) => {
            words += e.words + "<br />";
          });
          this.text = words;
        }
      });
    },

    //移除图片
    removeFile() {
      this.fileList.length = 0;
      this.loading.close();
      this.$refs.upload.abort();
    },

    exceedFile() {
      this.$message({
        message: "单次仅支持识别一张图片！",
        type: "warning",
      });
    },

    copy() {
      this.$copyText(this.$refs.text.innerText).then(() => {
        this.$message({
          message: "复制成功",
          type: "success",
        });
      });
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;

  .title {
    font-size: 0.4rem;
    text-align: center;
    color: #7c96b1;
  }
  .content {
    width: 70%;
    margin: 3% auto;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    .left {
      .language {
        line-height: 0;
      }
    }
    .right {
      width: 50%;
      height: 5rem;
      background: #fff;
      position: relative;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      .copy {
        position: absolute;
        top: 0.1rem;
        right: 0.24rem;
        color: blue;
        cursor: pointer;
        font-size: 0.18rem;
      }
      .textScroll {
        background: #fff;
        height: 100%;
        margin: 5% auto;
        font-size: 0.17rem;
        color: #616161;
        overflow: auto;
      }
      /deep/.el-scrollbar {
        height: 100%;
        .el-scrollbar__wrap {
          overflow-x: hidden;
          padding: 0 3%;
        }
      }
    }
  }
}
@media screen and (max-width: 900px) {
  .container {
    .content {
      flex-direction: column;
      width: unset;
      margin: 0;
      height: 75%;
      margin-top: 2%;
      overflow-y: scroll;
      .left {
        text-align: center;
        .language {
          line-height: 0;
        }
      }
      .right {
        width: unset;
        margin: 5%;
        .textScroll {
          height: unset;
        }
      }
      /deep/.el-upload-dragger {
        width: 6rem;
      }
    }
  }
}
</style>
