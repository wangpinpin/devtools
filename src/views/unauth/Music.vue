<template>
  <div class="container">
    <Header />
    <!-- <div class="title">{{ title }}</div> -->
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
            v-model="songId"
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
            <el-switch
              v-model="switchValue"
              id="musicSwitch"
              @change="switchChange"
            ></el-switch>
          </div>
        </div>
        <div class="preAndNext">
            <el-button type="primary" @click="playAndPause"
              >暂停/播放</el-button
            >
            <el-button type="primary" @click="nextSong">下一首</el-button>
        </div>
      </div>
    </div>
    <Footer class="footer" />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { init, playAndPause } from "@/assets/js/music";
export default {
  name: "Music",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      title: "听一听",
      songId: "",
      name: "",
      author: "",
      keyword: "",
      songs: [],
      loading: false,
      audio: {},
      bridge: {},
      switchValue: false,
      url: "",
      songList: [],
      songIndex: 0,
    };
  },

  created() {},
  mounted() {},
  methods: {
    singSong() {
      init(this);
    },
    //查询歌曲
    search(query) {
      if (query !== "") {
        this.loading = true;

        this.$http
          .get("unAuth/crossDomain", {
            url: "https://wyy.wangpinpin.com/search?keywords=" + query,
          })
          .then((res) => {
            if (res.code == 200) {
              this.songs = res.result.songs;
              this.loading = false;
            }
          });
      }
    },
    onchange(id) {
      this.$http
        .get("unAuth/crossDomain", {
          url: "https://wyy.wangpinpin.com/song/url?id=" + id,
        })
        .then((res) => {
          if (res.code == 200) {
            let url = res.data[0].url;
            if (url) {
              this.songDetail(id);
              if (url.indexOf("https") < 0) {
                url = url.replace("http:", "https:");
              }
              this.url = url;
              this.singSong();
            } else {
              this.$message({
                message: "木有资源",
                type: "warning",
              });
              this.musicEnd();
            }
          } else {
            this.$message({
              message: res.message,
              type: "warning",
            });
          }
        });
    },

    //获取歌曲详情
    songDetail(id) {
      this.$http
        .get("unAuth/crossDomain", {
          url: "https://wyy.wangpinpin.com/song/detail?ids=" + id,
        })
        .then((res) => {
          if (res.code == 200) {
            this.name = res.songs[0].name;
            this.author = res.songs[0].ar[0].name;
          }
        });
    },
    //音乐结束
    musicEnd() {
      debugger
      if (this.switchValue) {
        if (this.songIndex < this.songList.length) {
          this.onchange(this.songList[this.songIndex].id);
          this.songIndex++;
        } else {
          this.recommend();
        }
      }
    },
    // 开启随心听
    switchChange() {
      if (this.switchValue) {
        this.recommend();
      }
    },
    //私人FM歌单
    recommend() {
      this.$http
        .get("unAuth/crossDomain", {
          url: "https://wyy.wangpinpin.com/personal_fm?" + Math.random(),
        })
        .then((res) => {
          if (res.code == 200) {
            this.songIndex = 0;
            this.songList = res.data;
            this.musicEnd();
          }
        });
    },
    //播放暂停
    playAndPause() {
      playAndPause();
    },
    //下一首
    nextSong() {
      if (this.switchValue) {
        this.musicEnd();
      } else {
        this.$message({
          message: "没有下一首了",
          type: "warning",
        });
      }
    },
    showHide(show) {
      if (show) {
        document.querySelector(".loading").style.display = "block";
        document.querySelector(".tips").style.display = "block";
        document.querySelector(".song-info").style.display = "none";
      } else {
        document.querySelector(".loading").style.display = "none";
        document.querySelector(".tips").style.display = "none";
        document.querySelector(".song-info").style.display = "block";
      }
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
      .preAndNext {
        /deep/.el-button--primary {
          color: #7c96b1;
          background-color: #95d6fe;
          border-color: #ffffff;
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
