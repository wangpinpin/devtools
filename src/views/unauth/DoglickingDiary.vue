<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>
    <div class="qrcode">
      <div>
        网站域名可能因费用随时更换
        <br />长按或扫描二维码关注公众号<br />更多内容正在建设中...
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
        <div class="audio" ref="audioDiv">
          <audio id="ttsAudio">
            <source :src="musicUrl" type="audio/mp3" />
          </audio>
        </div>
        <div class="readDogText">
          <i
            v-if="!readLoading"
            @click="readDogText"
            id="readDogText"
            class="iconfont"
            >&#xe6fd;</i
          >
          <i
            v-if="readLoading"
            @click="noReadDogText"
            id="noReadDogText"
            class="el-icon-loading"
          ></i>
        </div>

        <div class="copy" @click="copy" id="copy">
          <i class="iconfont">&#xe65b;</i>
        </div>
        <div class="text-content">{{ text }}</div>
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
      musicUrl:
        "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=5&&text=舔狗日记",
    };
  },
  created() {},
  methods: {
    search() {
      this.noReadDogText();

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
        let url =
          "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=5&&text=舔狗日记，" +
          this.text +
          "哈哈 今天也是一只合格的舔狗呢。";

        let audioDiv = this.$refs.audioDiv;
        let ttsAudio = document.getElementById("ttsAudio");
        audioDiv.removeChild(ttsAudio);

        const audio = `<audio id="ttsAudio">
              <source src="${url}" type="audio/mp3">
              </audio>`;
        audioDiv.innerHTML = audio;
        ttsAudio = document.getElementById("ttsAudio");
        ttsAudio.play();

        //添加监听
        ttsAudio.addEventListener(
          "ended",
          () => {
            this.readLoading = false;
          },
          false
        );
      }
    },
    //不读了
    noReadDogText() {
      let ttsAudio = document.getElementById("ttsAudio");
      ttsAudio.pause();
      this.readLoading = false;
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
      .text-content {
        text-indent: 2em;
      }
      .copy,
      .readDogText {
        position: absolute;
        z-index: 999;
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
        z-index: 997;
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
