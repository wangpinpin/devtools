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
        <div class="search" @click="search" id="start">
          <el-button type="success">开舔</el-button>
        </div>
      </div>
      <div class="text">
        <div class="readDogText" @click="readDogText" id="readDogText">
          <i v-if="!readLoading" class="iconfont">&#xe6fd;</i>
          <i v-if="readLoading" class="el-icon-loading"></i>
        </div>

        <div class="copy" @click="copy" id="copy">
          <i class="iconfont">&#xe65b;</i>
        </div>
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
      readLoading: false,
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
    //读一读
    readDogText() {
      if (this.text) {
        this.readLoading = true;
        const url =
          "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=5&&text=舔狗日记，" +
          this.text +
          "哈哈 今天也是一只合格的舔狗呢。";
        var n = new Audio(url);
        n.src = url;
        n.play();
        this.readLoading = false;
      }
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

      .copy,
      .readDogText {
        position: absolute;
        top: 0.1rem;
        right: 0.24rem;
        cursor: pointer;
        color: rgb(32, 162, 221);
        i {
          font-size: 0.25rem;
        }
      }
      .readDogText {
        right: 0.84rem;
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
