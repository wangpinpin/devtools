<template>
  <div>
    <div class="container">
      <div class="left">
        <div
          class="item home"
          id="home"
        >
          <a href="/"><i class="iconfont">&#xe632;</i></a>
        </div>
      </div>
      <div class="right">
        <div
          class="item"
          :style="{ backgroundImage: `url(${img})` }"
        >
          <a href="MessageBoard">留言板</a>
        </div>
        <div
          class="item"
          :style="{ backgroundImage: `url(${img})` }"
        >
          <a href="subscribe">女神日记</a>
        </div>
        <div
          class="item"
          :style="{ backgroundImage: `url(${img})` }"
        >
          <a href="v">看一看</a>
        </div>
        <div
          class="item"
          :style="{ backgroundImage: `url(${img})` }"
        >
          <a
            href="adarkroom"
            target="_blank"
          >小黑屋</a>
        </div>
        <div
          class="item"
          :style="{ backgroundImage: `url(${img})` }"
          style="visibility: hidden;"
        >
          菜单6
        </div>
      </div>
      <div
        class="login"
        v-if="this.$store.state.user"
      >
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="iconfont">&#xe666;</i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><a href="/info">个人信息</a></el-dropdown-item>
            <el-dropdown-item disabled>记事本</el-dropdown-item>
            <el-dropdown-item><a href="/subscribe">我的订阅</a></el-dropdown-item>
            <a @click="signOut">
              <el-dropdown-item divided>退出</el-dropdown-item>
            </a>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div
        class="login un-login"
        v-if="!this.$store.state.user"
      >
        <a href="/login"><i class="iconfont">&#xe666;</i></a>
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
  .weather {
    position: absolute;
    top: 10px;
    left: 10px;
  }
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
  .login {
    height: 30px;
    position: absolute;
    right: 1rem;
    top: 0.5rem;
    cursor: pointer;
    i {
      font-size: 0.3rem;
      color: #74c0ef;
    }
  }
  .un-login {
    i {
      font-size: 0.3rem;
      color: #757575;
    }
  }
}
/deep/.el-dropdown-menu__item {
  a {
    color: #606266;
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
