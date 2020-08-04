<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>
    <div class="content">
      <el-upload
        class="upload-demo"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
      <div class="">
        <el-select v-model="value" placeholder="请选择语言">
          <el-option
            v-for="item in languages"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button type="success" @click="transfer">提取文字</el-button>
      </div>
      <p class="result">{{ result }}</p>
    </div>
    <Footer />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import config from "@/config/config";

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
    };
  },
  created() {},
  methods: {
    getToken() {
      // 获取token地址
      const getAccessTokenUrl =
        "https://aip.baidubce.com/oauth/2.0/token?" +
        // 1. grant_type为固定参数
        "grant_type=client_credentials" +
        // 2. 官网获取的 API Key
        "&client_id=" +
        BAIDU_API_KEY +
        // 3. 官网获取的 Secret Key
        "&client_secret=" +
        BAIDU_SECRET_KEY;
      this.$http.get(getAccessTokenUrl).then((data) => {
        console.log(data);
      });
    },
    transfer() {
      this.getToken();
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
  }
}
@media screen and (max-width: 900px) {
}
</style>
