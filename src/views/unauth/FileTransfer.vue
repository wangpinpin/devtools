<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>
    <div class="content">
      <div class="left">
        <el-tabs>
          <el-tab-pane label="文字">
            <!-- 留言框 -->
            <vue-tinymce v-model="text" :setting="setting" />
          </el-tab-pane>
          <el-tab-pane label="文件">
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
                *文件最大支持{{ fileMaxSize }}MB
              </div>
            </el-upload>
          </el-tab-pane>
        </el-tabs>
        <el-button class="btn" type="success" @click="confirmFile"
          >确定</el-button
        >
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
      </div>
    </div>
    <Footer class="footer" />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import QRCode from "qrcodejs2";

export default {
  name: "FileTransfer",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      title: "小破传",
      setting: {
        menubar: false,
        toolbar:
          "undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontselect fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | removeformat |",
        toolbar_drawer: "sliding",
        quickbars_selection_toolbar:
          "removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor",
        plugins: "link image media table lists fullscreen quickbars",
        language: "zh_CN", //本地化设置
        height: 350,
      },
      text: "",
      fileList: [],
      loading: "",
      fileMaxSize: 100,
      isSuccess: false, // 是否生成成功
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

      //   this.loading = this.$loading.service({
      //     target: this.$refs.textscroll,
      //   });
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
    },

    //移除图片
    removeFile() {
      this.fileList.length = 0;
      this.loading.close();
      this.$refs.upload.abort();
    },

    exceedFile() {
      this.$message({
        message: "单次仅支持传一个文件！",
        type: "warning",
      });
    },
    // 生成二维码
    bindQRCode(url) {
      if (/^(https?|ftp|file):/.test(url)) {
        this.visible = false;
        this.isSuccess = true;
        this.$refs.qrCodeDiv.innerHTML = "";
        new QRCode(this.$refs.qrCodeDiv, {
          text: url,
          width: 200,
          height: 200,
          correctLevel: "H",
        });
      } else {
        this.visible = true;
      }
    },
    // 下载二维码图片
    downloadCode() {
      let a = document.createElement("a");
      a.download = "pic";
      a.href = this.$refs.qrCodeDiv.lastChild.currentSrc;
      a.click();
    },
    // 确定上传
    confirmFile() {},
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  min-height: 100%;
  background-image: linear-gradient(
    to top,
    #f3e7e9 0%,
    #e3eeff 99%,
    #e3eeff 100%
  );
  position: relative;
  padding-bottom: 0.5rem;
  box-sizing: border-box;
  .title {
    font-size: 0.4rem;
    text-align: center;
    color: #7c96b1;
    margin-top: 0.2rem;
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
        height: 0.8rem;
        line-height: 0.8rem;
        font-size: 0.2rem;
        outline: none;
        border: 1px dashed transparent;
        &:focus {
          -webkit-box-shadow: 0 -1px 10px #3eb0d361;
          box-shadow: 0 -1px 10px #3eb0d361;
        }
      }
      .urlText {
        min-height: 0.8rem;
        font-size: 0.2rem;
        background-color: #fff;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        word-break: break-all;
        padding: 0.1rem 0.2rem;
      }
    }
    .btn {
      margin-top: 0.4rem;
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
            font-size: 0.18rem;
            margin: 0;
            line-height: 0.4rem;
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
            font-size: 0.18rem;
            margin: 0;
            line-height: 0.4rem;
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
        margin: 0.05rem 0.1rem;
      }
    }
  }
}
</style>
