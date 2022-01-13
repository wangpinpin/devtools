<template>
  <div>
    <div class="header-container">
      <div class="left">
        <div class="item home" id="home">
          <a href="/"><i class="iconfont">&#xe7b9;</i></a>
        </div>
      </div>
      <div class="center">
        <ul class="menu">
          <li
            :class="item.children ? 'multinav' : ''"
            v-for="(item, index) in devText"
            :key="index"
          >
            <a v-if="item.path" :href="item.path">{{ item.text }}</a>
            <a v-else>
              {{ item.text }}
              <ul class="nav-list">
                <li v-for="(nav, i) in item.children" :key="i">
                  <a :href="nav.path">{{ nav.text }}</a>
                </li>
              </ul>
            </a>
          </li>
        </ul>
      </div>
      <div class="right">
        <div class="login un-login" v-if="!this.$store.state.user">
          <a href="/login"><i class="iconfont">&#xe60f;</i></a>
        </div>
        <div class="login" v-if="this.$store.state.user">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="iconfont">&#xe60f;</i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><a href="/info">个人信息</a></el-dropdown-item>
              <el-dropdown-item disabled>记事本</el-dropdown-item>
              <el-dropdown-item
                ><a href="/subscribe">我的订阅</a></el-dropdown-item
              >
              <a @click="signOut">
                <el-dropdown-item divided>退出</el-dropdown-item>
              </a>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
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
      login: this.$store.state.user,
      devText: [
        { path: "/DoglickingDiary", text: "舔狗日记" },
        { path: "/MessageBoard", text: "留言板" },
        { path: "/Note", text: "舔狗笔记" },
        {
          text: "摸鱼游戏",
          children: [
            {
              poster: require("@/assets/imgs/games/adarkhome.jpeg"),
              text: "小黑屋",
              path: "/adarkroom",
            },
            {
              poster: require("@/assets/imgs/games/saolei.jpeg"),
              text: "扫雷",
              path: "/saolei",
            },
            {
              poster: require("@/assets/imgs/games/jigsaws.jpg"),
              text: "拼图",
              path: "/jigsaws",
            },
            {
              poster: require("@/assets/imgs/games/jigsaws.jpg"),
              text: "2048",
              path: "/2048",
            },
          ],
        },
        {
          text: "影音图文",
          children: [
            { path: "/v", text: "看一看" },
            { path: "/Music", text: "听一听" },
            { path: "/wallpaper", text: "必应壁纸" },
            { path: "/EveryDayText", text: "每日一文" },
            { path: "/Wyy", text: "网易云音乐API" },
          ],
        },
        {
          text: "工具合集",
          children: [
            { path: "/Filetransfer", text: "小破传" },
            { path: "/QRcodeCreate", text: "二维码生成" },
            { path: "/ImageToTxt", text: "图片文字提取" },
            { path: "/JsonFormat", text: "JSON格式化" },
            { path: "/TimeFormat", text: "时间戳转换" },
            { path: "/Base64", text: "图片转Base64" },
            { path: "/ColorTransfer", text: "颜色代码转换" },
            { path: "/PreviewFont", text: "字体预览" },
          ],
        },
        // { path: "/", text: "正在开发" },
      ],
    };
  },
  created() {},
  methods: {
    //退出
    signOut() {
      this.$store.commit("setUser", "");
    },
  },
};
</script>
<style scoped lang="less">
.header-container {
  width: 80%;
  height: 1.2rem;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #333;
  font-size: 0.18rem;
  position: relative;
  z-index: 999;
  box-sizing: border-box;
  .weather {
    position: absolute;
    top: 10px;
    left: 10px;
  }
  .item:hover {
    color: #7c96b1;
  }
  .left {
    font-size: 0.2rem;
    font-weight: bold;
    .home {
      i {
        font-size: 0.4rem;
        color: #74c0ef;
        display: block;
        animation: spin 1.5s infinite linear;
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
  .center {
    .menu {
      padding: 0;
      list-style: none;
      & > li {
        display: inline-block;
        font-size: 0.22rem;
        line-height: 2;
        margin: 0 1em;
        position: relative;
        &::after {
          content: "";
          display: block;
          width: 0;
          height: 1px;
          opacity: 0;
          margin: 0 auto;
          background-color: #74c0ef;
          transition: all 0.1s;
        }
        &::before {
          content: "";
          display: block;
          position: absolute;
          top: 2em;
          left: 50%;
          width: 1px;
          height: 0;
          background-color: #74c0ef;
        }
        a {
          color: #fff;
          transition: all 0.1s;
          cursor: pointer;
        }
        .nav-list {
          position: absolute;
          font-size: 0.2rem;
          width: 100%;
          list-style: none;
          padding-left: 100%;
          padding-top: 0.3rem;
          box-sizing: border-box;
          opacity: 0;
          transform: scaleY(0);
          &::before {
            content: "";
            display: block;
            position: absolute;
            top: 0.5rem;
            left: 50%;
            width: 0;
            height: 1px;
            background-color: #74c0ef;
          }
          li {
            width: 10em;
            padding-left: 0.5em;
            position: relative;
            z-index: 2;
            a {
              &:hover {
                text-shadow: 0 0 0.1rem rgba(255, 255, 255, 1),
                  0 0 0.5rem rgba(255, 255, 255, 0.8);
              }
            }
          }
        }
        &:hover {
          a {
            color: #74c0ef;
          }
          &::after {
            opacity: 1;
            width: 100%;
          }
        }
        &.multinav {
          &:hover {
            &::before {
              height: 0.5rem;
              transition: height 0.1s linear 0.1s;
            }
            .nav-list {
              opacity: 1;
              transform: scaleY(1);
              transition: opacity 0.1s linear 0.2s;
              &::before {
                width: 50%;
                transition: width 0.1s linear 0.2s;
              }
            }
          }
        }
      }
    }
  }
  .right {
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
  .login {
    i {
      font-size: 0.32rem;
      color: #74c0ef;
    }
  }
  .un-login {
    i {
      font-size: 0.32rem;
      color: #757575;
    }
  }
}
@-webkit-keyframes spin {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
/deep/.el-dropdown-menu__item {
  a {
    color: #606266;
  }
}
@media screen and (max-width: 900px) {
  .header-container {
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
    .login {
      margin-right: 0.2rem;
      margin-top: 0.2rem;
      position: relative;
      top: 0;
      right: 0;
      height: auto;
    }
  }
}
</style>
