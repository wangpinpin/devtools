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
      <i class="iconfont btnMore" @click="showMore = !showMore">&#xe62f;</i>
      <div class="choice">
        <div class="preAndNext">
          <div class="volumeWrap">
            <div class="volumeSlider" ref="volumeSlider">
              <el-slider
                v-model="volume"
                :min="0"
                :max="1"
                :step="0.1"
                :show-tooltip="false"
                vertical
                height="1rem"
                @change="changeVolume"
              >
              </el-slider>
            </div>
            <i class="btnVolume iconfont">&#xe6e8;</i>
          </div>
          <i @click="prevSong" class="iconfont">&#xe606;</i>
          <i @click="playAndPause" v-show="!isPlaying" class="iconfont"
            >&#xe612;</i
          >
          <i @click="playAndPause" v-show="isPlaying" class="iconfont"
            >&#xe62d;</i
          >
          <i @click="nextSong" class="iconfont">&#xe601;</i>
          <i @click="showHistory = !showHistory" class="btnHistory iconfont"
            >&#xe625;</i
          >
        </div>
      </div>
      <div
        :class="showHistory ? 'popHistory show' : 'popHistory'"
        ref="popHistory"
      >
        <i class="clearHistory iconfont" @click.stop="clearHistory">&#xe797;</i>
        <h3 class="popTitle">
          播放列表<span>（共{{ songsHistory.length }}首）</span>
        </h3>
        <p class="popMenuName">{{ curMenu || "随心听" }}</p>
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
                :data-index="index"
                @click="clickHistory(song.id, index)"
                @mouseenter="enterHistory($event)"
                @mouseleave="leaveHistory($event)"
                :class="hisListClass(index)"
              >
                <span class="listNo iconfont" v-html="listIcon(index)"></span>
                <span class="listSongName">{{ song.name }}</span>
                <span class="listSongAuthor">{{ song.author }}</span>
                <i class="delHistory iconfont" @click.stop="delHistory(index)"
                  >&#xe66a;</i
                >
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
            @change="searchSelect"
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
            <ul class="menuList">
              <li
                v-for="item in songMenu"
                :key="item.id"
                :value="item.id"
                @click="playMenu($event)"
              >
                <div class="menuPost">
                  <img :src="item.picUrl" alt="" />
                  <i class="iconPlay iconfont">&#xe60d;</i>
                </div>
                <p class="menuName">
                  <span>{{ item.name }}</span>
                </p>
              </li>
            </ul>
          </happy-scroll>
        </div>
      </div>
    </div>
    <i class="iconFly iconfont" ref="fly">&#xe61b;</i>
    <Footer class="footer" />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { init, playAndPause, setVolume } from "@/assets/js/music";
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
      showHistory: false,
      showMore: false,
      songsHistory: [],
      curSongIndex: -1,
      volume: 0.4,
      songMenu: [],
      delIndex: -1, // 删除歌曲暂存索引
      curMenu: "",
    };
  },

  created() {
    // 歌单
    this.getSongMenu();
  },
  mounted() {
    // 弹窗区域外点击关闭
    document.addEventListener("click", (e) => {
      let popHistory = this.$refs.popHistory;
      let popMore = this.$refs.popMore;
      if (popHistory) {
        if (e.target.className.indexOf("btnHistory") !== -1) return;
        if (!popHistory.contains(e.target)) {
          this.showHistory = false;
        }
      }
      if (popMore) {
        if (e.target.className.indexOf("btnMore") !== -1) return;
        if (!popMore.contains(e.target)) {
          this.showMore = false;
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
          return this.isPlaying ? "&#xe604;" : "&#xe612;";
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
              // this.songDetail(id);
              if (url.indexOf("https") < 0) {
                url = url.replace("http:", "https:");
              }
              this.url = url;
              this.singSong();
              this.isPlaying = true;
              this.matchMusic(id);
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
    searchSelect(id) {
      this.onchange(id);
      this.curMenu = "";
    },
    //获取歌单
    getSongMenu() {
      this.$http
        .get("unAuth/crossDomain", {
          url: "https://wyy.wangpinpin.com/personalized",
        })
        .then((res) => {
          if (res.code == 200) {
            this.songMenu = res.result;
          }
        });
    },
    //点击歌单播放
    playMenu(e) {
      let id = e.currentTarget.getAttribute("value");
      this.$http
        .get("unAuth/crossDomain", {
          url: "https://wyy.wangpinpin.com/playlist/detail?id=" + id,
        })
        .then((res) => {
          if (res.code == 200) {
            this.curMenu = res.playlist.name;
            this.clearHistory();
            res.playlist.tracks.forEach((item, index) => {
              this.songsHistory.push({
                id: item.id,
                name: item.name,
                author: item.ar[0].name,
              });
            });
            this.musicEnd();
            this.$refs.fly.style.bottom =
              window.screen.height - e.screenY + "px";
            this.$refs.fly.style.left = e.screenX + "px";
            this.$refs.fly.classList.add("active");
            setTimeout(() => {
              this.showMore = false;
              this.$refs.fly.classList.remove("active");
            }, 1000);
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
            this.songsHistory.push({
              id: id,
              name: this.name,
              author: this.author,
            });
          }
        });
    },
    //判断歌曲是否在历史记录中
    matchMusic(id) {
      let flag = false;
      this.songsHistory.forEach((item, index) => {
        if (item.id == id) {
          this.curSongIndex = index;
          this.name = item.name;
          this.author = item.author;
          flag = true;
          return;
        }
      });
      if (!flag) {
        this.curSongIndex = this.songsHistory.length;
        this.songDetail(id);
      }
    },
    //音乐结束
    musicEnd() {
      if (
        this.songsHistory.length > 0 &&
        this.curSongIndex < this.songsHistory.length - 1
      ) {
        this.onchange(this.songsHistory[this.curSongIndex + 1].id);
        this.curSongIndex++;
      } else {
        if (this.songIndex < this.songList.length) {
          this.onchange(this.songList[this.songIndex].id);
          this.songIndex++;
        } else {
          this.recommend();
        }
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
            this.curMenu = "";
            this.musicEnd();
          }
        });
    },
    //播放暂停
    playAndPause() {
      this.isPlaying = !this.isPlaying;
      if (this.songsHistory.length > 0) {
        playAndPause();
        return;
      }
      this.recommend();
    },
    //音量调节
    changeVolume() {
      setVolume(this.volume);
    },
    //上一首
    prevSong() {
      if (this.delIndex >= 0) {
        this.curSongIndex = this.delIndex - 1;
        this.delIndex = -1;
      }
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
      if (this.delIndex >= 0) {
        this.curSongIndex = this.delIndex - 1;
        this.delIndex = -1;
      }
      let nextSong = this.songsHistory[this.curSongIndex + 1];
      if (nextSong) {
        this.onchange(nextSong.id);
      } else {
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
    //点击历史记录
    clickHistory(id, index) {
      if (this.curSongIndex == index) {
        this.playAndPause();
      } else {
        this.onchange(id);
      }
    },
    //鼠标悬停历史记录时序号显示
    enterHistory(e) {
      let index = e.target.dataset.index * 1;
      let text = index == this.curSongIndex ? "&#xe62d;" : "&#xe612;";
      e.target.children[0].innerHTML = text;
    },
    //鼠标离开历史记录后序号显示
    leaveHistory(e) {
      let index = e.target.dataset.index * 1;
      let text =
        index == this.curSongIndex
          ? this.isPlaying
            ? "&#xe604;"
            : "&#xe612;"
          : index + 1;
      e.target.children[0].innerHTML = text;
    },
    //清空历史记录
    clearHistory() {
      this.songsHistory.length = 0;
      this.curSongIndex = -1;
    },
    //删除单条播放记录
    delHistory(index) {
      this.songIndex = 0;
      this.songList.splice(index, 1);
      this.songsHistory.splice(index, 1);
      if (index == this.curSongIndex) {
        this.delIndex = index;
        this.curSongIndex = -1;
      } else if (index < this.curSongIndex) {
        this.curSongIndex--;
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
  .iconFly {
    color: #7c96b1;
    position: absolute;
    font-size: 0;
    z-index: 1001;
    &.active {
      animation: fly 1s ease;
    }
  }
  .content {
    /deep/.happy-scroll-container {
      width: 100% !important;
      height: 100% !important;
      .happy-scroll-content {
        width: 100%;
        vertical-align: top;
      }
    }
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
    .clearHistory {
      cursor: pointer;
      position: absolute;
      top: 0.2rem;
      right: 0.3rem;
      font-size: 0.26rem;
      &:hover {
        animation: shake 0.3s ease;
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
      padding-left: 0.3em;
      span {
        font-weight: normal;
        font-size: 0.24rem;
      }
    }
    .popMenuName {
      font-size: 0.2rem;
      margin: 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      padding: 0 2em 0 0.4em;
      color: #d6d0d0;
    }
    .popHistory {
      position: fixed;
      bottom: 15%;
      left: 55.5%;
      width: 32%;
      height: 0;
      box-sizing: border-box;
      border-radius: 0.2rem;
      background-color: rgba(11, 11, 11, 0.5);
      color: #fff;
      padding: 0.1rem;
      opacity: 0;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      &.show {
        opacity: 1;
        height: 60%;
        z-index: 1000;
      }
      .listContainer {
        height: 88%;
        margin-top: 1%;
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
            position: relative;
            &.active,
            &:hover {
              color: #ffbdb9;
            }
            &:hover {
              .delHistory {
                display: block;
              }
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
            width: 58%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            margin-right: 2%;
          }
          .listSongAuthor {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 22%;
          }
          .delHistory {
            position: absolute;
            right: 4%;
            top: 0.06rem;
            font-size: 0.2rem;
            display: none;
          }
        }
      }
    }
    .btnMore {
      position: absolute;
      font-size: 0.6rem;
      left: 0.2rem;
      top: 18%;
      color: #74c0ef;
      cursor: pointer;
      z-index: 100;
      animation: shine 1s ease-in-out infinite;
      &:hover {
        animation: none;
      }
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
      transition: all 0.2s ease;
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
    .volumeWrap {
      display: inline-block;
      position: relative;
      &:hover {
        .volumeSlider {
          display: block;
        }
      }
    }
    .volumeSlider {
      display: none;
      /deep/.el-slider.is-vertical {
        .el-slider__runway {
          background-color: #fff;
          margin: 0 auto;
        }
        .el-slider__bar {
          background-color: #7c96b1;
        }
        .el-slider__runway,
        .el-slider__bar {
          width: 0.08rem;
        }
        .el-slider__button-wrapper {
          left: -0.06rem;
          height: 0.2rem;
          width: 0.2rem;
        }
        .el-slider__button {
          width: 0.2rem;
          height: 0.2rem;
          border: 0;
          background-color: #7c96b1;
          vertical-align: top;
        }
      }
    }
    .songMenu {
      height: 80%;
      margin-top: 2%;
      * {
        margin: 0;
        padding: 0;
      }
      img {
        width: 100%;
        vertical-align: top;
      }
      .menuList {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        li {
          display: inline-block;
          list-style: none;
          width: 46%;
          margin-bottom: 2%;
          margin-right: 4%;
          border: 1px solid #7c96b1;
          border-radius: 0.1rem;
          box-sizing: border-box;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
          position: relative;
          cursor: pointer;
          .menuPost {
            height: 2.44rem;
            overflow: hidden;
            position: relative;
            img {
              transition: all 1s ease;
            }
            .iconPlay {
              position: absolute;
              font-size: 0;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              transition: all 0.6s ease;
              color: #fff;
            }
          }
          &:hover {
            .menuPost {
              img {
                transform: scale(1.2);
              }
              .iconPlay {
                font-size: 0.6rem;
              }
            }
          }
          .menuName {
            font-size: 0.2rem;
            padding: 0.2em 0.5em;
            line-height: 1.5;
            height: 0.68rem;
            box-sizing: border-box;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 2;
            background-color: rgba(11, 11, 11, 0.5);
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            span {
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
            }
          }
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
@keyframes fly {
  0% {
    opacity: 0;
    font-size: 0;
  }
  30% {
    opacity: 1;
    transform: rotate(70deg);
  }
  50% {
    opacity: 1;
    font-size: 0.3rem;
    transform: rotate(70deg);
  }
  70% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    font-size: 0;
    bottom: 10%;
    left: 56%;
    transform: rotate(70deg);
  }
}
@keyframes shake {
  0%,
  50%,
  100% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(-45deg);
  }
  75% {
    transform: rotate(45deg);
  }
}
@keyframes shine {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
@media screen and (max-width: 900px) {
  .container {
    .content {
      width: 90%;
      .operation {
        width: 50%;
      }
      .popHistory {
        width: 90%;
        left: 5%;
      }
      .popMore {
        width: 100%;
        left: -100%;
      }
    }
  }
  /deep/.el-popper {
    width: 100%;
  }
}
</style>
