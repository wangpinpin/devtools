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

        <div class="tips">音乐渲染中...</div>
      </div>
      <div class="loading">
        <img src="@/assets/imgs/loading.gif" />
      </div>
      <i class="iconfont btnMore" @click="popMore">&#xe648;</i>
      <div class="choice">
        <div class="preAndNext">
          <i @click="voice" class="iconfont">&#xe6e8;</i>
          <i @click="prevSong" class="iconfont">&#xe606;</i>
          <i @click="playAndPause" v-show="!isPlaying" class="iconfont"
            >&#xe612;</i
          >
          <i @click="playAndPause" v-show="isPlaying" class="iconfont"
            >&#xe62d;</i
          >
          <i @click="nextSong" class="iconfont">&#xe601;</i>
          <i @click="history" class="btnHistory iconfont">&#xe625;</i>
        </div>
      </div>
      <div
        :class="showHistory ? 'popHistory show' : 'popHistory'"
        ref="popHistory"
      >
        <i class="popClose iconfont" @click.stop="showHistory = false"
          >&#xe607;</i
        >
        <h3 class="popTitle">
          播放列表<span>（共{{ songsHistory.length }}首）</span>
        </h3>
        <div class="listContainer">
          <happy-scroll
            color="rgba(0,0,0,0.2)"
            size="3"
            :hide-horizontal="true"
            resize
          >
            <ul class="hisList">
              <li
                v-for="(song, index) in songsHistory"
                :key="song.id"
                :value="song.id"
                @click="onchange(song.id)"
                @mouseenter="palyHistory($event, index)"
                @mouseleave="pauseHistory($event, index)"
                :class="hisListClass(index)"
              >
                <span class="listNo iconfont" v-html="listIcon(index)"></span>
                <span class="listSongName">{{ song.name }}</span>
                <span class="listSongAuthor">{{ song.artists[0].name }}</span>
              </li>
            </ul>
          </happy-scroll>
        </div>
      </div>
      <div :class="showMore ? 'popMore show' : 'popMore'" ref="popMore">
        <i class="popClose iconfont" @click.stop="showMore = false">&#xe607;</i>
        <h3 class="popTitle">搜索歌曲</h3>
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
        <h3 class="popTitle">歌单推荐</h3>
        <div class="songMenu">
          <happy-scroll
            color="rgba(0,0,0,0.2)"
            size="3"
            :hide-horizontal="true"
            resize
          >
            <ul class="menuList"></ul>
          </happy-scroll>
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
      url: "",
      songList: [],
      songIndex: 0,
      isPlaying: false,
      isFirstPlay: true,
      showHistory: false,
      showMore: false,
      songsHistory: [],
      curSongIndex: 0,
    };
  },

  created() {},
  mounted() {
    // 弹窗区域外点击关闭
    document.addEventListener("click", (e) => {
      let popHistory = this.$refs.popHistory;
      let popMore = this.$refs.popMore;
      if (popHistory) {
        if (e.target.className.indexOf("btnHistory") !== -1) return;
        if (!popHistory.contains(e.target)) {
          this.showHistory = false;
        } else {
          this.showHistory = true;
        }
      }
      if (popMore) {
        if (e.target.className.indexOf("btnMore") !== -1) return;
        if (!popMore.contains(e.target)) {
          this.showMore = false;
        } else {
          this.showMore = true;
        }
      }
    });
  },
  computed: {
    // 历史记录当前播放歌曲换色
    hisListClass() {
      return (index) => {
        if (this.curSongIndex == index) {
          return "active";
        } else {
          return "";
        }
      };
    },
    listIcon() {
      return (index) => {
        if (this.curSongIndex == index) {
          return "&#xe604;";
        } else {
          return index + 1;
        }
      };
    },
  },
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
      if (this.songIndex < this.songList.length) {
        this.onchange(this.songList[this.songIndex].id);
        this.songsHistory.push(this.songList[this.songIndex]);
        this.songIndex++;
      } else {
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
      this.isPlaying = !this.isPlaying;
      if (!this.isFirstPlay) {
        playAndPause();
        return;
      }
      this.isFirstPlay = false;
      this.recommend();
    },
    //音量调节
    voice() {},
    //上一首
    prevSong() {
      let prevSong = this.songsHistory[this.curSongIndex - 1];
      if (prevSong) {
        this.curSongIndex--;
        this.onchange(prevSong.id);
      } else {
        this.$message({
          message: "没有上一首了",
          type: "warning",
        });
      }
    },
    //下一首
    nextSong() {
      let nextSong = this.songsHistory[this.curSongIndex + 1];
      if (nextSong) {
        this.curSongIndex++;
        this.onchange(nextSong.id);
      } else {
        this.curSongIndex++;
        this.musicEnd();
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
    //历史记录
    history() {
      this.showHistory = !this.showHistory;
    },
    //左侧弹窗
    popMore() {
      this.showMore = !this.showMore;
    },
    //悬停历史记录前序号显示播放图标
    palyHistory(e, index) {
      let text = index == this.curSongIndex ? "&#xe62d;" : "&#xe612;";
      e.target.children[0].innerHTML = text;
    },
    //悬停历史记录前序号显示暂停图标
    pauseHistory(e, index) {
      let text = index == this.curSongIndex ? "&#xe604;" : index + 1;
      e.target.children[0].innerHTML = text;
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
        margin-top: 1.4rem;
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
      bottom: 10%;
      z-index: 99;
      text-align: center;
      font-size: 0.24rem;

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
        i {
          font-size: 0.3rem;
          color: #7c96b1;
          cursor: pointer;
          display: inline-block;
          margin: 0 0.5em;
        }
      }
    }
    .popClose {
      cursor: pointer;
      position: absolute;
      top: 0.2rem;
      right: 0.3rem;
      font-size: 0.2rem;
      transition: all 0.3s ease;
      &:hover {
        transform: rotate(180deg);
      }
    }
    .popTitle {
      margin: 0;
      font-size: 0.28rem;
      span {
        font-weight: normal;
        font-size: 0.24rem;
      }
    }
    .popHistory {
      position: fixed;
      bottom: 15%;
      left: 55.5%;
      width: 32%;
      height: 0;
      background-color: #fff;
      padding: 0.1rem;
      color: #333;
      opacity: 0;
      transition: all 0.6s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      &.show {
        opacity: 1;
        height: 60%;
        z-index: 1000;
      }
      .listContainer {
        height: 88%;
        margin-top: 1%;
        /deep/.happy-scroll-container {
          width: 100% !important;
          height: 100% !important;
          .happy-scroll-content {
            width: 100%;
            vertical-align: top;
          }
        }
        .hisList {
          margin: 0;
          font-size: 0.22rem;
          width: 100%;
          padding-left: 0;
          list-style: none;
          li {
            cursor: pointer;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            &.active,
            &:hover {
              color: #7c96b1;
            }
          }
          .listNo {
            display: inline-block;
            width: 2em;
            text-align: center;
            font-size: 0.22rem;
          }
          .listSongName {
            display: inline-block;
            width: 60%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            margin-right: 0.5em;
          }
          .listSongAuthor {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
    .btnMore {
      position: absolute;
      font-size: 0.6rem;
      left: -0.23rem;
      top: 18%;
      color: #74c0ef;
      cursor: pointer;
      z-index: 100;
    }
    .popMore {
      position: fixed;
      top: 0;
      left: -30%;
      width: 30%;
      height: 100%;
      background-color: #fff;
      padding: 0.2rem;
      color: #333;
      z-index: 1000;
      opacity: 0;
      transition: all 0.6s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      box-sizing: border-box;
      &.show {
        opacity: 1;
        left: 0;
      }
      .select {
        margin: 2% 0;
        line-height: 0;
        /deep/.el-select {
          width: 100%;
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
