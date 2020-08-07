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
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">
            只能上传jpg/png文件, 且不超过{{ formMaxSize }}M
          </div>
        </el-upload>
        <div class="language">
          <el-select v-model="value">
            <el-option
              v-for="item in languages"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-button type="success" @click="upload">提取文字</el-button>
        </div>
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
      languages: [
        {
          value: "CHN_ENG",
          label: "中英文混合",
        },
        {
          value: "ENG",
          label: "英文",
        },
        {
          value: "JAP",
          label: "日语",
        },
        {
          value: "KOR",
          label: "韩语",
        },
        {
          value: "FRE",
          label: "法语",
        },
        {
          value: "SPA",
          label: "西班牙语",
        },
        {
          value: "POR",
          label: "葡萄牙语",
        },
        {
          value: "GER",
          label: "德语",
        },
        {
          value: "ITA",
          label: "意大利语",
        },
        {
          value: "RUS",
          label: "俄语",
        },
      ],
      value: "",
      formMaxSize: 3,
      text: "",
      loading: "",
    };
  },
  created() {
    this.value = this.languages[0].value;
  },
  methods: {
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
      formData.append("languageType", this.value);
      
      this.$http.post("unAuth/imgToText", formData).then((res) => {
        this.loading.close();
        if (res.words_result) {
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
    font-size: 40px;
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
        margin-top: 20px;
      }
    }
    .right {
      width: 50%;
      height: 500px;
      background: #fff;
      position: relative;
      .copy {
        position: absolute;
        top: 10px;
        right: 24px;
        color: blue;
        cursor: pointer;
        font-size: 18px;
      }
      .textScroll {
        background: #fff;
        height: 100%;
        margin: 5% auto;
        font-size: 17px;
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
}
</style>
