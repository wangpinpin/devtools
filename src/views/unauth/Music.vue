<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>

    <div class="content" id="content">
      <div class="operation">
        <div class="name">{{name}}</div>
        <div class="author">{{author}}</div>
        <a href="javascript:;" class="play" id="play">PLAY</a>
      </div>
      <div class="loading">
        <img src="@/assets/imgs/loading.gif" />
      </div>
    </div>
    <Footer class="footer" />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { renderWebGL, AudioSystem } from "@/assets/js/music";

export default {
  name: "Music",
  components: {
    Header,
    Footer
  },
  data() {
    return {
      title: "听一听",
      name: "",
      author: ""
    };
  },
  created() {
    this.init();
  },

  methods: {
    init() {
      var formData = new FormData();
      formData.append("sort", "热歌榜");
      formData.append("format", "json");
      this.$http
        .post("https://api.uomg.com/api/rand.music", formData)
        .then(res => {
          this.name = res.name;
          this.author = res.artistsname;
          console.log(res.url);
          this.$http.get("/" + res.url).then(res => {
            this.singSong(url);
          });
        });
    },
    singSong(url) {
      var bridge = renderWebGL(document.getElementById("content"), {
        audioSrc: url
      });

      var audio = new AudioSystem();
      bridge.start(audio);

      var btn = document.getElementById("play");

      btn.onclick = function() {
        btn.style.display = "none";
        audio.play();
      };
    }
  }
};
</script>
<style lang="less">
canvas {
  position: absolute;
  top: 0;
}
</style>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;

  .title {
    font-size: 0.4rem;
    color: #7c96b1;
    text-align: center;
  }
  .content {
    .operation {
      position: absolute;
      left: 0;
      right: 0;
      text-align: center;
      z-index: 10;
      width: 17%;
      margin: 0 auto;
      top: 43%;
      font-size: 0.24rem;
      display: none;
      .name {
        color: #7c96b1;
      }
      .author {
        color: #7c96b1;
      }
      .play {
        background-color: #7c96b1;
        border-radius: 0.1rem;
        color: #fff;
        margin-top: 3%;
        margin: 0.8rem auto;
        width: 46%;
        height: 0.4rem;
        line-height: 0.4rem;
        display: block;
      }
    }
    .loading {
      position: absolute;
      left: 0;
      right: 0;
      text-align: center;
      margin: 0 auto;
      width: 20%;
      top: 50%;
      transform: translateY(-50%);
      img {
        width: 100%;
      }
    }
  }
}
@media screen and (max-width: 900px) {
  .container {
    .content {
      width: 90%;
    }
  }
}
</style>
