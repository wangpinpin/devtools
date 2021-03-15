<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>

    <div class="content">
      <video
        ref="player"
        id="player"
        :src="src"
        muted
        autoplay="autoplay"
        controls
        webkit-playsinline
        playsinline
      ></video>
      <div class="next" id="next">
        <el-button type="success" @click="auto = !auto"
          >连续：{{ auto ? "开" : "关" }}</el-button
        >
        <el-button type="success" @click="getVideo">换一个</el-button>
      </div>
    </div>
    <div class="advertisement">
      <Adsense
        data-ad-client="ca-pub-8697460075278474"
        ins-style="display:inline-block;width:300px;height:250px"
        data-ad-slot="6734414294"
      ></Adsense>
    </div>
    <div class="advertisement advertisement2">
      <Adsense
        data-ad-client="ca-pub-8697460075278474"
        ins-style="display:inline-block;width:300px;height:250px"
        data-ad-slot="6844249022"
      ></Adsense>
    </div>
    <Footer class="footer" />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
var _this;
Vue.config.errorHandler = (err, vm, info) => {
  console.log("error");
  _this.getVideo();
};
export default {
  name: "V",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      title: "看一看",
      src: "https://www.nihaowua.com/v/video.php",
      auto: true,
    };
  },
  created() {
    _this = this;
    this.getVideo();
  },
  mounted() {
    //判断视频播放完毕
    document.getElementById("player").addEventListener("ended", function () {
      if (_this.auto) {
        _this.getVideo();
      }
    });
  },
  methods: {
    getVideo() {
      this.src = "https://www.nihaowua.com/v/video.php?_t=" + Math.random();
      document.getElementById("player").play();
      document.getElementById("player").addEventListener("error", function () {
        _this.getVideo();
      });
    },
  },
};
</script>
<style lang="less">
.container {
  .content {
    p {
      text-indent: 2em;
    }
  }
}
</style>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  text-align: center;

  .title {
    font-size: 0.4rem;
    color: #7c96b1;
    margin-top: 0.2rem;
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
    margin: 3%;
    .next {
      line-height: 0;
    }
    video {
      width: 30vh;
      height: 54vh;
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
    .advertisement {
      position: unset;
      top: 60%;
      text-align: center;
    }
    .footer {
      /deep/.container {
        position: unset;
      }
    }
  }
}
</style>
