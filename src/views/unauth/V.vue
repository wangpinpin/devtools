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
      <div class="next" @click="getVideo" id="next">
        <el-button type="success">换一个</el-button>
      </div>
    </div>
    <Footer class="footer" />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "EveryDayText",
  components: {
    Header,
    Footer
  },
  data() {
    return {
      title: "看一看",
      src: "https://www.nihaowua.com/v/video.php"
    };
  },
  created() {
    this.getVideo();
  },

  methods: {
    getVideo() {
      this.src = "https://www.nihaowua.com/v/video.php?_t=" + Math.random();
    }
  }
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
    .content {
      video {
        // width: 80%;
      }
    }
  }
}
</style>
