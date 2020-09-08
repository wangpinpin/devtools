<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>
    <div class="content">
      <div class="image">
        <el-upload
          action="#"
          list-type="picture-card"
          ref="upload"
          :auto-upload="false"
          :on-change="onChange"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{ file }">
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url"
              alt=""
            />
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </div>
      <div class="base">
        <div class="open" @click="open">浏览器打开</div>
        <div class="copy" @click="copy">复制</div>
        <div class="textScroll" ref="textscroll">
          <el-scrollbar>
            <div class="text" ref="text" v-text="base64"></div>
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

export default {
  name: "Base64",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      title: "图片转Base64",
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      base64: "",
    };
  },
  created() {},
  methods: {
    onChange(file) {
      if (file.raw) {
        document.getElementsByClassName("el-upload")[0].style.display = "none";
        document.getElementsByClassName("el-upload-list")[0].style.display =
          "unset";
        this.imgToBase64(file.raw);
      }
    },
    handleRemove(file) {
      document.getElementsByClassName("el-upload-list")[0].style.display =
        "none";

      this.$refs.upload.clearFiles();
      document.getElementsByClassName("el-upload")[0].style.display = "flex";
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    imgToBase64(file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.base64 = reader.result;
      };
      reader.onerror = function(error) {
        this.$message({
          message: error,
          type: "error",
        });
      };
    },
    copy() {
      this.$copyText(this.base64).then(() => {
        this.$message({
          message: "复制成功",
          type: "success",
        });
      });
    },
    //浏览器打开
    open() {
      const img = new Image();
      img.src = this.base64;
      const newWin = window.open("", "_blank");
      newWin.document.write(img.outerHTML);
      newWin.document.title = "小破站-图片转Base64";
      newWin.document.close();
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;

  .title {
    font-size: 0.3rem;
    text-align: center;
    color: #7c96b1;
  }
  .content {
    display: flex;
    flex-direction: row;
    width: 80%;
    height: 50%;
    margin: 4% auto;
    justify-content: space-around;
    .image {
      width: 40%;
      height: 5rem;
      div {
        width: 100%;
        height: 100%;
        /deep/.el-upload {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        /deep/.el-upload-list__item {
          width: 100%;
          height: 100%;
          i {
            font-size: 0.4rem;
          }
        }
      }
    }
    .base {
      width: 40%;
      height: 4.5rem;
      background: #fff;
      position: relative;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      word-wrap: break-word;
      word-break: break-all;
      .copy {
        position: absolute;
        top: 0.2rem;
        right: 0.24rem;
        color: blue;
        cursor: pointer;
        font-size: 0.18rem;
      }
      .open {
        position: absolute;
        top: 0.2rem;
        right: 0.8rem;
        color: blue;
        cursor: pointer;
        font-size: 0.18rem;
      }
      .textScroll {
        background: #fff;
        height: 100%;
        padding-top: 0.5rem;
        font-size: 0.17rem;
        color: #616161;
        overflow: auto;
      }
      /deep/.el-scrollbar {
        height: 100%;
        .el-scrollbar__wrap {
          overflow-x: hidden;
          padding: 0 5%;
        }
      }
    }
  }
  /deep/.el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
@media screen and (max-width: 900px) {
  .container {
    .content {
      display: flex;
      flex-direction: column;
      width: 90%;
      margin: 10% auto;
      align-items: center;
      height: 60%;
      .image {
        width: 100%;
        height: 80%;
      }
      .base {
        width: 100%;
        height: 70%;
        margin-top: 6%;
      }
    }
  }
}
</style>
