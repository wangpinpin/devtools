<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>

    <div class="content" id="content">
      <div class="operation">
        <div class="name">{{ name }}</div>
        <div class="author">{{ author }}</div>
      </div>
      <div class="loading">
        <img src="@/assets/imgs/loading.gif" />
      </div>
      <div class="choice">
        <div class="select">
          <el-select
            v-model="value"
            filterable
            remote
            reserve-keyword
            :remote-method="search"
            :loading="loading"
            placeholder="请输入歌名或歌手名"
            @change="onchange"
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
      </div>
    </div>
    <Footer class="footer" />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import {setUrl, init} from "@/assets/js/music";
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
      value: "",
      loading: false,
      audio: {},
      bridge: {},
    };
  },

  created() {},
  mounted() {
  },
  methods: {
    singSong(url) {

      document.querySelector(".loading").style.display = "block";
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
    onchange() {
      this.$http
        .get("https://bird.ioliu.cn/netease/song?id=" + this.value)
        .then((res) => {
          if (res.status.code == 200) {
            if (res.data.mp3.url) {
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
      display: none;
      .name {
        color: #7c96b1;
      }
      .author {
        color: #7c96b1;
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
      .select {
        line-height: 0;
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
}
</style>
