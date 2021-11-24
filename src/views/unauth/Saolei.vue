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
    <div v-else class="saolei-content">
      <div class="game-header">
        <div class="timecount">
          <i class="iconfont">&#xe61c;</i><span>{{ timeSeconds }}</span>
        </div>
        <div class="minecount">
          <i class="iconfont">&#xe635;</i
          ><span>{{ mode[modeIndex].mine }}</span>
        </div>
      </div>
      <table class="game-board">
        <tr v-for="(row, rowIdx) in mode[modeIndex].boardHeight" :key="rowIdx">
          <td
            v-for="(col, colIdx) in mode[modeIndex].boardWidth"
            :key="colIdx"
            @click="clickArea(rowIdx, colIdx)"
          >
            <i v-if="mineBoardArr[rowIdx][colIdx] === '雷'" class="iconfont"
              >&#xe635;</i
            >
            <span v-else>{{ getNineGridMine(rowIdx, colIdx) }}</span>
          </td>
        </tr>
      </table>

      <div class="game-tools">
        <el-tooltip
          class="game-hide"
          effect="dark"
          content="重新再战（快捷键R/r切换）"
          placement="right-start"
          ><span class="tool-item" @click="initGame"
            ><i class="iconfont">&#xe65f;</i></span
          ></el-tooltip
        >
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
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
let that = "";
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
      status: 0, // 状态 0-未开始；1-游戏中
      mode: [
        {
          boardWidth: 9,
          boardHeight: 9,
          text: "简单",
          mine: 10, // 地雷数量
        },
        {
          boardWidth: 16,
          boardHeight: 16,
          text: "中等",
          mine: 40,
        },
        {
          boardWidth: 30,
          boardHeight: 16,
          text: "专家",
          mine: 99,
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
      timeSeconds: "0", // 游戏计时-秒
      mineBoardArr: [], // 扫雷盘区域二维数组
      result: null, // 游戏结果 true 成功
    };
  },
  watch: {
    isShowGame(curVal) {
      let title = curVal ? this.title : "404";
      document.title = title;
    },
  },
  created() {
    that = this;
  },
  mounted() {
    this.$nextTick(() => {
      this.fastKey();
    });
  },
  destroyed() {
    document.onkeyup = function () {};
  },
  filters: {
    // 计算雷区地雷数量
    getMineNum(location) {
      let row = location[0];
      let col = location[1];
      let num = 0;
      if (that.mineBoardArr[row][col] === 1) {
        return "雷";
      }
      that.mineBoardArr.forEach((rowArr, i) => {
        rowArr.forEach((mine, j) => {
          if (
            i >= row - 1 &&
            i <= row + 1 &&
            j >= col - 1 &&
            j <= col + 1 &&
            mine === "雷"
          ) {
            num++;
          }
        });
      });
      return num === 0 ? "" : num;
    },
  },
  methods: {
    // 快捷键
    fastKey() {
      let that = this;
      let keyMap = ["escape", "", "r"];
      document.onkeyup = function (e) {
        let key = e.key.toLowerCase().replace(/ /g, "");
        if (keyMap.indexOf(key) > -1 && that.status === 1) {
          switch (key) {
            case "escape":
              that.exitGame();
              break;
            case "":
              that.hideGame();
              break;
            case "r":
              that.initGame();
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
      this.initGame();
    },
    /**
     * 游戏进行时
     */
    // 游戏初始化，分配地址
    initGame() {
      let curMode = this.mode[this.modeIndex];
      let row = curMode.boardHeight;
      let col = curMode.boardWidth;
      let minesArr = this.getRandomMines(row, col, curMode.mine);
      this.mineBoardArr = [];
      for (let i = 0; i < row; i++) {
        this.mineBoardArr[i] = [];
        for (let j = 0; j < col; j++) {
          let isMine = minesArr.filter((mine) => {
            return mine[0] === i && mine[1] === j;
          });
          this.mineBoardArr[i][j] = isMine && isMine.length > 0 ? "雷" : "";
        }
      }
    },
    // 计算九宫格区域内地雷数量
    getNineGridMine(row, col) {
      let num = 0;
      if (this.mineBoardArr[row][col] === "雷") return "雷";
      this.mineBoardArr.forEach((rowArr, i) => {
        rowArr.forEach((mine, j) => {
          if (
            i >= row - 1 &&
            i <= row + 1 &&
            j >= col - 1 &&
            j <= col + 1 &&
            mine === "雷"
          )
            num++;
        });
      });
      return num === 0 ? "" : num;
    },
    // 随机分配地雷
    getRandomMines(row, col, num) {
      let minesArr = [];
      for (let i = 0; i < num; i++) {
        minesArr[i] = getUnique(minesArr);
      }
      function getUnique(arr) {
        let location = [
          Math.floor(Math.random() * row),
          Math.floor(Math.random() * col),
        ];
        if (location.indexOf(arr) > -1) {
          getUnique(arr);
          return;
        }
        return location;
      }
      return minesArr;
    },
    // 隐藏游戏
    hideGame() {
      this.isShowGame = !this.isShowGame;
    },
    // 退出游戏
    exitGame() {
      this.status = 0;
    },
    // 扫雷区域点击
    clickArea(row, col) {
      if (this.mineBoardArr[row][col] === "雷") {
        this.gameFail();
      }
    },
    /**
     * 游戏结束
     */
    // 成功
    // 失败
    gameFail() {},
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
      font-size: 0.4rem;
      .iconfont {
        display: inline-block;
        font-size: 0.4rem;
        margin-right: 0.2em;
      }
      & > div {
        margin: 0.2em 1em;
      }
    }
    .game-board {
      display: block;
      margin: 0 auto;
      background-color: #f8f8f8;
      td {
        font-size: 0.2rem;
        width: 0.4rem;
        height: 0.4rem;
        background-color: #74c0ef;
        opacity: 0.8;
        border-radius: 1px;
        box-shadow: -2px -2px 2px #4b86ab inset;
        text-align: center;
        .iconfont {
          font-size: 0.2rem;
        }
        &:hover {
          opacity: 0.5;
        }
      }
    }
  }
}
</style>
