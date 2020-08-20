<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>
    <div class="qrcode">
      <div>
        网站域名可能因费用随时更换
        <br />扫描二维码关注公众号不迷路 <br />更多内容正在建设中...
        <br />
      </div>
      <div>
        <img src="@/assets/imgs/qrcode.png" />
      </div>
    </div>
    <div class="content">
      <div class="condition">
        <div class="date">
          <el-date-picker
            v-model="date"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </div>
        <div class="search" @click="search">
          <el-button type="success">开舔</el-button>
        </div>
      </div>
      <div class="text">
        <div class="copy" @click="copy">复制</div>
        {{ text }}
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
      title: "舔狗日记",
      date: new Date(),
      text: "",
    };
  },
  created() {},
  methods: {
    search() {
      this.$http.get("unAuth/getDoglickingDiary").then((res) => {
        const date = this.$options.filters["formatDate"](
          this.date,
          "yyyy年MM月dd日"
        );
        this.text = date + " " + res;
      });
    },
    copy() {
      this.$copyText(this.text).then(() => {
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
  position: relative;

  .title {
    font-size: 0.4rem;
    text-align: center;
    color: #7c96b1;
  }
  .qrcode {
    position: absolute;
    right: 1rem;
    bottom: 0.2rem;
    font-size: 0.24rem;
    img {
      margin-top: 0.2rem;
      width: 2rem;
    }
  }
  .content {
    margin: 10% auto 0;
    width: 27%;

    .condition {
      display: flex;
      flex-direction: row;
      margin: 0 auto;
      justify-content: space-between;
      line-height: 0;
      .date {
        // visibility: hidden;
      }
    }
    .text {
      background: #fff;
      height: 3rem;
      margin: 5% auto;
      padding: 11% 5% 5% 5%;
      font-size: 0.17rem;
      color: #616161;
      position: relative;

      .copy {
        position: absolute;
        top: 0.1rem;
        right: 0.24rem;
        color: blue;
        cursor: pointer;
        font-size: 0.2rem;
      }
    }
  }
}
@media screen and (max-width: 900px) {
  .container {
    position: relative;

    .qrcode {
      position: absolute;
      right: 0;
      bottom: 5%;
      font-size: 0.125rem;
      left: 0;
      margin: 0 auto;
      text-align: center;
      img {
        margin-top: 0.2rem;
        width: 30%;
      }
    }
    .content {
      margin: 13% auto;
      width: 90%;
    }
  }
}
</style>
