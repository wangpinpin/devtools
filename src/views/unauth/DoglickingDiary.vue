<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>
    <div class="sub-tilte">本站数据全网最全, 定时搜索全网数据</div>
    <div class="content">
      <div class="condition">
        <div class="select">
          <el-select v-model="value">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
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
    <!-- <div class="advertisement">
      <Adsense
        data-ad-client="ca-pub-8697460075278474"
        ins-style="display:inline-block;width:300px;height:250px"
        data-ad-slot="6734414294"
      >
      </Adsense>
    </div> -->
    <!-- <div class="advertisement advertisement2">
      <Adsense
        data-ad-client="ca-pub-8697460075278474"
        ins-style="display:inline-block;width:300px;height:250px"
        data-ad-slot="6844249022"
      >
      </Adsense>
    </div> -->
    <Footer class="footer" />
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
      musicUrl: "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=5&&text=",
      options: [],
      value: "",
    };
  },
  created() {
    this.getTypeList();
  },
  mounted() {},
  methods: {
    //获取类型列表
    getTypeList() {
      this.$http.get("unAuth/findTypeList", { t: "DOG" }).then((res) => {
        this.options = res;
        this.value = res[0].id;
      });
    },
    search() {
      //关闭读一读
      this.noReadDogText();

      this.$http
        .get("unAuth/getDoglickingDiary", { typeId: this.value })
        .then((res) => {
          if (this.value == "0c97d296-e5b1-11ea-9d4b-00163e1e93a5") {
            const date =
              this.date.getFullYear() +
              "年" +
              (this.date.getMonth() + 1) +
              "月" +
              this.date.getDate() +
              "日";
            this.text = date + " " + res;
          } else {
            this.text = res;
          }
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
          "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=5&&text=" +
          this.text;

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
    margin-top: .2rem;
  }
  .sub-tilte {
    font-size: 0.3rem;
    text-align: center;
    color: #7c96b1;
  }
  .advertisement {
    position: absolute;
    top: 60%;
    left: 4%;
  }
  .advertisement2 {
    left: unset;
    right: 4%;
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
        text-align: left;
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
    width: 100%;
    min-height: 100%;
    height: unset;
    text-align: center;
    background-image: linear-gradient(
      to top,
      #f3e7e9 0%,
      #e3eeff 99%,
      #e3eeff 100%
    );
    padding-bottom: 1%;
    box-sizing: border-box;
    .advertisement {
      position: unset;
      top: 60%;
      text-align: center;
    }
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
    .footer {
      /deep/.container {
        position: unset;
      }
    }
  }
}
</style>
