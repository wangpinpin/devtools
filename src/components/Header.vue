<template>
  <div>
    <div class="container">
      <div class="left">
        <div class="item home" id="home">
          <a href="/"><i class="iconfont">&#xe632;</i></a>
        </div>
      </div>
      <div class="right">
        <div class="item" :style="{ backgroundImage: `url(${img})` }">
          <a href="MessageBoard">留言板</a>
        </div>
        <div class="item" :style="{ backgroundImage: `url(${img})` }">
          <a href="Music">听一听</a>
        </div>
        <div class="item" :style="{ backgroundImage: `url(${img})` }">
          <a href="adarkroom" target="_blank">小黑屋</a>
        </div>
        <div class="item" :style="{ backgroundImage: `url(${img})` }">
          <a href="sponsor">赞助</a>
        </div>
        <!-- <div class="item" :style="{ backgroundImage: `url(${img})`}">
          <a href="v">看一看</a>
        </div> -->
        <!-- <div class="item" :style="{ backgroundImage: `url(${img})` }">
          <a href="GoddessLetter">女神日记</a>
        </div> -->
        <div
          class="item"
          :style="{ backgroundImage: `url(${img})` }"
          style="visibility: hidden;"
        >
          菜单6
        </div>
      </div>
      <!-- <div class="right-mobile">
        <i class="iconfont menu">&#xe605;</i>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: {
    msg: String,
  },
  data() {
    return {
      img: require("@/assets/imgs/cloud.png"),
    };
  },
  created() {
    this.open();
  },
  methods: {
    open() {
      if (window.location.host == "139.196.199.233") {
        this.$alert(
          "<strong>139.196.199.233 即将暂停使用, 请更换域名</strong><div>本站地址永久更新到<a href='https://wangpinpin.com'>https://wangpinpin.com</a></div>",
          "",
          {
            dangerouslyUseHTMLString: true,
            customClass: "width9",
          }
        );
      }
    },
  },
};
</script>

<style scoped lang="less">
.container {
  width: 100%;
  height: 1.2rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #333;
  font-size: 0.18rem;
  position: relative;
  z-index: 999;
  box-sizing: border-box;
  .item:hover {
    color: #7c96b1;
  }
  .left {
    width: 10%;
    font-size: 0.2rem;
    font-weight: bold;
    .home {
      i {
        font-size: 0.4rem;
        color: #74c0ef;
      }
    }
    .item {
      cursor: pointer;
      a {
        color: #333;
        text-decoration: none;
      }
    }
  }
  .right {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    height: 0.8rem;
    line-height: 0.9rem;
    text-align: center;
    color: #fff;
    div {
      cursor: pointer;
    }
    .item {
      cursor: pointer;
      background-size: 100% 100%;
      width: 1.3rem;
      a {
        color: #747879;
        text-decoration: none;
        display: inline-block;
        width: 100%;
        height: 100%;
      }
    }
  }
}
@media screen and (max-width: 900px) {
  .container {
    padding-left: 5%;
    .left {
      font-size: 0.22rem;
      .item {
        font-size: 0.6rem;
        margin-top: 0.1rem;
      }
      .home {
        i {
          font-size: 0.5rem;
        }
      }
    }
    .right {
      font-size: 0.22rem;
      width: 83%;
      flex-wrap: wrap;
      .item {
        width: 1.1rem;
        height: 0.9rem;
        line-height: 1rem;
      }
    }
  }
}
</style>
