<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>

    <div class="content" id="content">
      <div class="operation">
        <div class="song-info">
          <div class="name">{{ name }}</div>
          <div class="author">{{ author }}</div>
        </div>

        <div class="tips">音乐渲染中</div>
      </div>
      <div class="loading">
        <img src="@/assets/imgs/loading.gif" />
      </div>
      <div class="choice">
        <div class="operation-title">搜索</div>
        <div class="select">
          <el-select
            v-model="value"
            filterable
            clearable
            remote
            reserve-keyword
            :remote-method="search"
            :loading="loading"
            placeholder="请输入歌名或歌手名"
            @change="onchange"
            id="musicSelect"
            ref="select"
          >
            <el-option
              v-for="item in songs"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.artists[0].name
              }}</span>
            </el-option>
          </el-select>
        </div>
        <div class="switch">
          <div class="switch-title">开启随心听</div>
          <div class="switch-btn">
            <el-switch v-model="switchValue" disabled id="musicSwitch"> </el-switch>
            <!-- active-color="#13ce66"
              inactive-color="#ff4949" -->
          </div>
        </div>
      </div>
    </div>
    <Footer class="footer" />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { setUrl, init } from "@/assets/js/music";
export default {
  name: "Music",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      title: "听一听",
      name: "",
      author: "",
      keyword: "",
      songs: [],
      value: "Lemon",
      loading: false,
      audio: {},
      bridge: {},
      switchValue: false,
    };
  },

  created() {},
  mounted() {
    this.search("Lemon");
    this.$refs.select.$el.click();
  },
  methods: {
    singSong(url) {
      this.showHide();

      setUrl(url);
      init();
    },
    //查询歌曲
    search(query) {
      if (query !== "") {
        this.loading = true;

        this.$http
          .get("http://www.hjmin.com/search?keywords=" + query)
          .then((res) => {
            if (res.code == 200) {
              this.songs = res.result.songs;
              this.loading = false;
            }
          });
      }
    },
    onchange(item) {
      this.$http
        .get("https://bird.ioliu.cn/netease/song?id=" + this.value)
        .then((res) => {
          if (res.status.code == 200) {
            if (res.data.mp3.url) {
              const obj = this.songs.find((d) => d.id === item);
              this.name = obj.name;
              this.author = obj.artists[0].name;
              this.singSong(res.data.mp3.url);
            } else {
              this.$message({
                message: "这首歌有点问题, 请换一首别人唱的。",
                type: "warning",
              });
            }
          }
        });
    },
    showHide() {
      document.querySelector(".loading").style.display = "block";
      document.querySelector(".tips").style.display = "block";
      document.querySelector(".song-info").style.display = "none";
    },
  },
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
      // display: none;
      .name {
        color: #7c96b1;
      }
      .author {
        color: #7c96b1;
      }
      .tips {
        display: none;
        margin-top: 0.1rem;
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
      display: none;
      img {
        width: 100%;
      }
    }
    .choice {
      display: flex;
      flex-direction: column;
      position: absolute;
      right: 0;
      left: 0;
      align-content: center;
      top: 75%;
      z-index: 99;
      text-align: center;
      font-size: 0.24rem;

      .select {
        line-height: 0;
      }
      .operation-title {
        font-size: 0.24rem;
        color: #7c96b1;
      }
      .switch {
        font-size: 0.24rem;
        color: #7c96b1;
        display: flex;
        flex-direction: row;
        text-align: center;
        margin: 0.2rem auto;
        height: 0.3rem;
        line-height: 0.3rem;
        .switch-title {
          margin-right: 0.2rem;
        }
      }
    }
  }
}
/deep/.el-select-dropdown__item {
  width: 30%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
@media screen and (max-width: 900px) {
  .container {
    .content {
      width: 90%;
    }
  }
  /deep/.el-popper {
    width: 100%;
  }
}
</style>
