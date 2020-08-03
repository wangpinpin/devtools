<template>
  <div class="home">
    <Header />

    <div class="home-container">
      <div class="content">
        <div class="slogan">
          <!-- title -->
          <div class="title">
            {{ title }}
          </div>
          <div class="inputText">{{ inputText }}</div>
          <div class="sub-title">{{ subTitle }}</div>

          <!-- 搜索框 -->
          <div class="search">
            <input class="searchText" />
            <div class="searchButton">
              Search
            </div>
          </div>
        </div>
        <!-- 功能标签 -->
        <div class="card">
          <div
            class="card-tool"
            v-for="(bgf, index) in devBackgroundFamily"
            :key="index"
            :style="bgf"
            @click="go(devText[index].path)"
          >
            {{ devText[index].text }}
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "Home",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      title: "I love to Explore",
      inputText: "",
      subTitle:
        " Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in",
      devBackgroundFamily: [
        "background-image: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);",
        "background-image: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);",
        "background-image: linear-gradient(to top, #fad0c4 0%, #fad0c4 1%, #ffd1ff 100%);",
        "background-image: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);",
        "background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);",
        "background-image: linear-gradient(to top, #fdcbf1 0%, #fdcbf1 1%, #e6dee9 100%);",
        "background-image: linear-gradient(to top, #a8edea 0%, #fed6e3 100%);",
        "background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);",
        "background-image: linear-gradient(to top, #9795f0 0%, #fbc8d4 100%);",
        "background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);",
      ],
      devText: [
        { path: "/JsonFormat", text: "JSON格式化" },
        { path: "/QRcodeCreate", text: "二维码生成" },
        { path: "/ColorTransfer", text: "颜色代码转换" },
        { path: "/DoglickingDiary", text: "舔狗日记" },
        { path: "JsonFormat", text: "JSON格式化" },
        { path: "JsonFormat", text: "JSON格式化" },
        { path: "JsonFormat", text: "JSON格式化" },
        { path: "JsonFormat", text: "JSON格式化" },
        { path: "JsonFormat", text: "JSON格式化" },
        { path: "JsonFormat", text: "JSON格式化" },
      ],
    };
  },
  beforeCreate() {
    // this.loading = this.$loading.service({
    //   lock: true, //是否锁定
    //   background: "rgba(212, 212, 212, 0.9)", //遮罩背景色
    // });
  },
  created() {
    this.devBackgroundFamily.sort(function() {
      return Math.random() - 0.5;
    });
    // this.loading.close();
    this.inputAnimation();
  },
  methods: {
    
    //路由跳转
    go(path) {
      const router = this.$router.resolve(path)
      window.open(router.href, '_blank');

    },

    //模拟鼠标光标动画
    inputAnimation() {
      const _this = this;
      setInterval(function() {
        const inputText = "|";
        if (_this.inputText == inputText) {
          _this.inputText = "";
        } else {
          _this.inputText += inputText;
        }
      }, 800);
    },
  },
};
</script>
<style scoped lang="less">
.home-container {
  margin: 40px auto 0;
  text-align: center;
  color: #ffffff;
  display: flex;
  .content {
    width: 100%;
    .slogan {
      position: relative;
      margin: 0 auto;
      width: 35%;
      .title {
        font-size: 48px;
      }
      .inputText {
        position: absolute;
        right: 140px;
        top: 12px;
        font-size: 32px;
      }
      .sub-title {
        margin-top: 20px;
        font-size: 16px;
        line-height: 30px;
      }
      .search {
        margin: 0.208333rem auto 0;
        display: flex;
        flex-direction: row;
        border: 0.005208rem solid #ffffff;
        width: 58%;
        height: 54px;
        border-radius: 50px;
        line-height: 54px;
        justify-content: space-around;
        .searchText {
          background: none;
          border: none;
          outline: none;
          height: 0.265625rem;
          width: 57%;
          font-size: 0.109375rem;
          line-height: 0.265625rem;
          color: #e8e8e8;
        }
        .searchButton {
          border-left: 1px solid #fff;
          font-size: 16px;
          padding-left: 18px;
          cursor: pointer;
        }
      }
    }
    .card {
      margin: 80px auto 0;
      width: 80%;
      height: 400px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .card-tool {
        width: 15%;
        height: 120px;
        line-height: 120px;
        border-radius: 30px;
        margin-left: 60px;
        font-size: 24px;
        cursor: pointer;
      }
      .card-tool:hover {
        border: 4px solid #fff;
        box-sizing: border-box;
        line-height: 111px;
      }
    }
  }
}
</style>
