<template>
  <div class="container">
    <Header class="header" />
    <div class="content">
      <transition name="el-fade-in-linear">
        <img
          ref="img transition-box"
          v-if="url"
          v-show="show"
          :src="url"
          @load="load"
        />
      </transition>
      <div class="show">
        <div class="time">{{ nowTime }}</div>
        <div class="title" ref="title">
          {{ copyright }}
        </div>
        <div class="loading" ref="loading">
          <i class="el-icon-loading"></i>
        </div>
      </div>
    </div>
    <div class="operation">
      <div class="random" id="wallpaper-random" @click="random">
        <i class="iconfont">&#xe8e3;</i>
      </div>
      <div class="pre" id="wallpaper-pre" @click="preNext(+1)">
        <i class="iconfont" ref="pre">&#xe629;</i>
      </div>
      <div class="next" id="wallpaper-next" @click="preNext(-1)">
        <i class="iconfont" ref="next">&#xe629;</i>
      </div>
    </div>
    <Footer />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "Wallpaper",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      title: "必应壁纸",
      images: [],
      index: 0,
      nowTime: "",
      url: "",
      copyright: "",
      show: true,
    };
  },
  created() {
    this.init();
    this.nowTimes();
  },
  watch: {
    url(newValue) {
      this.$refs.loading.style.visibility = "visible";
    },
    copyright(newValue) {
      if (newValue) {
        this.$refs.title.style.visibility = "visible";
      } else {
        this.$refs.title.style.visibility = "hidden";
      }
    },
  },
  methods: {
    init() {
      this.$http
        .get("unAuth/crossDomain", {
          url:
            "http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8&mkt=zh-CN",
        })
        .then((res) => {
          this.images = res.images;
          this.url = "https://www.bing.com/" + res.images[0].url;
          this.copyright = this.images[0].copyright;
        });
    },
    // 图片加载完成
    load() {
      let _this = this;
      this.show = false;
      this.$refs.loading.style.visibility = "hidden";
      setTimeout(function() {
        _this.show = true;
      }, 100);
    },
    //上下张壁纸
    preNext(count) {
      let index = this.index + count;
      if (index < 0 || index >= this.images.length) {
        return;
      }
      if (index == 0) {
        this.$refs.next.style.color = "#a9a9a9";
        this.$refs.next.style.cursor = "unset";
      } else {
        this.$refs.next.style.color = "#fff";
        this.$refs.next.style.cursor = "pointer";
      }
      if (index == this.images.length - 1) {
        this.$refs.pre.style.color = "#a9a9a9";
        this.$refs.pre.style.cursor = "unset";
      } else {
        this.$refs.pre.style.color = "#fff";
        this.$refs.pre.style.cursor = "pointer";
      }
      this.index = index;
      this.url = "https://www.bing.com/" + this.images[index].url;
      this.copyright = this.images[index].copyright;
    },
    //随机壁纸
    random() {
      this.url = "https://bing.ioliu.cn/v1/rand?" + Math.random();
      this.copyright = "";
    },
    //显示当前时间（年月日时分秒）
    timeFormate(timeStamp) {
      let year = new Date(timeStamp).getFullYear();
      let month =
        new Date(timeStamp).getMonth() + 1 < 10
          ? "0" + (new Date(timeStamp).getMonth() + 1)
          : new Date(timeStamp).getMonth() + 1;
      let date =
        new Date(timeStamp).getDate() < 10
          ? "0" + new Date(timeStamp).getDate()
          : new Date(timeStamp).getDate();
      let hh =
        new Date(timeStamp).getHours() < 10
          ? "0" + new Date(timeStamp).getHours()
          : new Date(timeStamp).getHours();
      let mm =
        new Date(timeStamp).getMinutes() < 10
          ? "0" + new Date(timeStamp).getMinutes()
          : new Date(timeStamp).getMinutes();
      let ss =
        new Date(timeStamp).getSeconds() < 10
          ? "0" + new Date(timeStamp).getSeconds()
          : new Date(timeStamp).getSeconds();
      // this.nowTime = year + "年" + month + "月" + date +"日"+" "+hh+":"+mm+':'+ss ;
      this.nowTime = hh + ":" + mm;
    },
    //当前时间
    nowTimes() {
      this.timeFormate(new Date());
      setInterval(this.nowTimes, 1000);
      clearInterval(this.nowTimes);
      this.nowTimes = null;
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  .header {
    /deep/.container {
      position: absolute;
    }
  }
  .content {
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      position: absolute;
    }
    .show {
      text-align: center;
      font-size: 0.2rem;
      color: #fff;
      display: flex;
      flex-direction: column;
      height: 0;
      width: 0;
      align-items: center;
      justify-content: center;
      position: absolute;
      z-index: 2;
      left: 0;
      right: 0;
      margin: auto;
      top: 0;
      bottom: 0;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      .time {
        font-size: 2rem;
      }
      .title {
        white-space: nowrap;
        height: 0;
        margin-bottom: 0.2rem;
      }
      .loading {
        font-size: 0.5rem;
        visibility: hidden;
      }
    }
  }
  .operation {
    position: absolute;
    bottom: 1rem;
    right: 2rem;
    display: flex;
    flex-direction: row;
    line-height: 0;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    i {
      font-size: 0.5rem;
      color: #fff;
      cursor: pointer;
    }
    .pre {
      transform: rotateY(180deg);
      margin-left: 0.5rem;
    }
    .next {
      margin-left: 0.3rem;
      i {
        color: #a9a9a9;
        cursor: unset;
      }
    }
  }
}
@media screen and (max-width: 900px) {
}
</style>
