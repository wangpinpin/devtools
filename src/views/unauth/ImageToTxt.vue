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
          :data="uploadData"
          :file-list="fileList"
          :on-success="uploadSuccess"
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
        <p class="result">{{ result }}</p>
      </div>
      <div class="right">
        <div class="copy" @click="copy">复制</div>
        <div class="text" ref="text" v-html="text"></div>
      </div>
    </div>
    <Footer />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "ColorTransfer",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      title: "图片文字提取",
      result: "",
      uploadData: {},
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

      this.uploadData.languageType = this.value;
      return true;
    },

    //上传图片到服务器
    upload() {
      this.$refs.upload.submit();
    },

    //上传成功之后
    uploadSuccess(res) {
      //清空列表
      this.$refs.upload.clearFiles();
      if (res.data.words_result) {
        let words = "";
        res.data.words_result.forEach((e) => {
          words += e.words + "<br />";
        });
        this.text = words;
      }
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
    color: #fff;
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
      .text {
        background: #fff;
        height: 100%;
        margin: 5% auto;
        font-size: 17px;
        color: #616161;
        padding: 0 3%;
        overflow: auto;
      }
    }
  }
}
@media screen and (max-width: 900px) {
}
</style>
