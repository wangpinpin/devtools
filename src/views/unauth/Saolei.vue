<template>
  <div v-if="isShowGame" class="container">
    <div v-if="status === 0" class="saolei-home">
      <Header />
      <div class="title">{{ title }}</div>
      <ul class="mode">
        <li
          v-for="(item, index) in mode"
          :key="index"
          :style="
            devBackgroundFamily[
              Math.floor(Math.random() * devBackgroundFamily.length)
            ]
          "
          @click="selectMode(index)"
        >
          <span
            >{{ item.text }}<br />{{ item.boardWidth }}x{{
              item.boardHeight
            }}</span
          >
        </li>
      </ul>
      <Footer class="footer" />
    </div>
    <div v-else-if="status === 1" class="saolei-content">
      <div class="game-header">
        <div class="timecount">
          <i class="iconfont">&#xe61c;</i><span>{{ timecount }}</span>
        </div>
        <div class="minecount">
          <i class="iconfont">&#xe635;</i><span>{{ minecount }}</span>
        </div>
      </div>
      <table class="game-board">
        <tr v-for="(row, rowIdx) in mode[modeIndex].boardHeight" :key="rowIdx">
          <td
            v-for="(col, colIdx) in mode[modeIndex].boardWidth"
            :key="colIdx"
            @click="clickArea"
          ></td>
        </tr>
      </table>

      <div class="game-tools">
        <el-tooltip
          class="game-hide"
          effect="dark"
          content="一键隐藏（快捷键SPACE切换）"
          placement="right-start"
          ><span class="tool-item" @click="hideGame"
            ><i class="iconfont">&#xe6a3;</i></span
          ></el-tooltip
        >
        <el-tooltip
          class="game-exit"
          effect="dark"
          content="退出游戏（快捷键ESC）"
          placement="right-start"
          ><span class="tool-item" @click="exitGame"
            ><i class="iconfont">&#xe60b;</i></span
          ></el-tooltip
        >
      </div>
    </div>
    <div v-else class="saolei-ending"></div>
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
export default {
  name: "Saolei",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      title: "扫雷",
      isShowGame: true, // 是否显示游戏界面
      status: 0, // 状态 0-未开始；1-游戏中；2-游戏结束
      mode: [
        {
          boardWidth: 9,
          boardHeight: 9,
          text: "简单",
        },
        {
          boardWidth: 16,
          boardHeight: 16,
          text: "中等",
        },
        {
          boardWidth: 30,
          boardHeight: 16,
          text: "大师",
        },
      ],
      modeIndex: null,
      devBackgroundFamily: [
        "background-image: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);",
        "background-image: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);",
        "background-image: linear-gradient(to top, #fad0c4 0%, #fad0c4 1%, #ffd1ff 100%);",
        "background-image: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);",
        "background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);",
        "background-image: linear-gradient(to top, #fdcbf1 0%, #fdcbf1 1%, #e6dee9 100%);",
        "background-image: linear-gradient(to top, #a8edea 0%, #fed6e3 100%);",
        "background-image: linear-gradient(to top, #d299c2 0%, #fef9d7 100%);",
        "background-image: linear-gradient(to top, #9795f0 0%, #fbc8d4 100%);",
        "background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);",
        "background-image: linear-gradient(to right, #ffecd2 0%, #fcb69f 100%);",
      ],
      timecount: "00:00", // 游戏计时
      minecount: 0, // 地雷数量
    };
  },
  watch: {
    isShowGame(curVal) {
      let title = curVal ? this.title : "404";
      document.title = title;
    },
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.fastKey();
    });
  },
  destroyed() {
    document.onkeyup = function() {};
  },
  computed: {},
  methods: {
    // 快捷键
    fastKey() {
      let that = this;
      let keyMap = ["escape", ""];
      document.onkeyup = function(e) {
        let key = e.key.toLowerCase().replace(/ /g, "");
        if (keyMap.indexOf(key) > -1) {
          console.log(key);
          switch (key) {
            case "escape":
              that.exitGame();
              break;
            case "":
              that.hideGame();
              break;
            default:
              break;
          }
        }
      };
    },
    /**
     * 游戏首页
     */
    // 模式选择
    selectMode(index) {
      this.modeIndex = index;
      this.status = 1;
    },
    /**
     * 游戏进行时
     */
    // 隐藏游戏
    hideGame() {
      this.isShowGame = !this.isShowGame;
    },
    // 退出游戏
    exitGame() {
      this.status = 0;
    },
    // 扫雷区域点击
    clickArea() {},
    /**
     * 游戏结束
     */
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
  .game-tools {
    position: fixed;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    .tool-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 0.8rem;
      height: 0.8rem;
      margin: 0.2rem;
      border-radius: 50%;
      background-color: #7c96b16b;
      cursor: pointer;
      .iconfont {
        font-size: 0.4rem;
        color: #fff;
      }
      &:hover {
        background-color: #7c96b1;
      }
    }
  }
  .saolei-home {
    .mode {
      display: flex;
      align-content: center;
      justify-content: center;
      padding: 0;
      list-style: none;
      color: #fff;
      li {
        width: 20%;
        margin: 0.1rem 1%;
        border-radius: 0.3rem;
        text-align: center;
        transition: all 0.3s;
        cursor: pointer;
        font-size: 0.5rem;
        overflow: hidden;
        span {
          display: block;
          padding: 1em;
          border: 0.04rem solid transparent;
          border-radius: 0.3rem;
        }
        &:hover {
          border-color: #fff;
          span {
            border-color: #fff;
          }
        }
      }
    }
  }
  .saolei-content {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .game-header {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #7c96b1;
      font-size: 0.5rem;
      .iconfont {
        display: inline-block;
        font-size: 0.5rem;
        margin-right: 0.2rem;
      }
      & > div {
        margin: 0.2em 1em;
      }
    }
    .game-board {
      display: block;
      margin: 0 auto;
      td {
        width: 0.4rem;
        height: 0.4rem;
        background-color: #74c0ef;
        opacity: 0.8;
        border-radius: 1px;
      }
    }
  }
}
</style>
