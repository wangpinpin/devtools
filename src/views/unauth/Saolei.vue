<template>
  <div v-if="isShowGame" class="container">
    <div v-if="status === 0" class="saolei-home">
      <Header />
      <div class="title">{{ title }}</div>
      <ul class="mode">
        <li
          v-for="(item, index) in mode"
          :key="index"
          :style="devBackgroundFamily[index]"
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
    <div v-else class="saolei-content" oncontextmenu="return(false)">
      <div class="game-header">
        <div class="timecount">
          <i class="iconfont">&#xe61c;</i
          ><span>{{ timeSeconds | formateTime }}</span>
        </div>
        <div class="minecount">
          <i class="iconfont">&#xe635;</i><span>{{ curMode.mine }}</span>
        </div>
        <div>
          <i class="iconfont">&#xe797;</i><span>{{ clearNum }}</span>
        </div>
      </div>
      <table class="game-board">
        <tr v-for="(row, i) in mineBoardArr" :key="i">
          <td
            v-for="(col, j) in row"
            :key="j"
            :data-row="i"
            :data-col="j"
            @click="clickArea"
            @mousedown="signMine"
            :class="[
              (status === 3) & col.isMine
                ? 'td-show'
                : col.isShow
                ? 'td-show'
                : col.isSign
                ? 'td-sign'
                : col.isUnknown
                ? 'td-unknown'
                : '',
              col.isDestroyed ? 'td-destroyed' : '',
            ]"
          >
            <template v-if="(status === 3) & col.isMine">
              <i class="iconfont icon-mine">&#xe635;</i>
            </template>
            <template v-else>
              <template v-if="col.isShow">
                <span class="emptyArea">{{ col.value }}</span>
              </template>
              <template v-else
                ><i class="iconfont icon-flag" v-if="col.isSign">&#xe60e;</i>
                <i class="iconfont icon-question" v-if="col.isUnknown"
                  >&#xe715;</i
                ></template
              >
            </template>
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
let time = null;
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
      status: 0, // 状态 0-未开始；1-游戏中；2-游戏成功；3-游戏失败
      mode: [
        {
          name: "easy",
          boardWidth: 9,
          boardHeight: 9,
          text: "简单",
          mine: 10, // 地雷数量
        },
        {
          name: "medium",
          boardWidth: 16,
          boardHeight: 16,
          text: "中等",
          mine: 40,
        },
        {
          name: "professional",
          boardWidth: 30,
          boardHeight: 16,
          text: "专家",
          mine: 99,
        },
      ],
      curMode: null,
      devBackgroundFamily: [],
      timeSeconds: "0", // 游戏计时-秒
      mineBoardArr: [], // 扫雷盘区域二维数组
      clearNum: 0,
    };
  },
  watch: {
    isShowGame(curVal) {
      let title = curVal ? this.title : "404";
      document.title = title;
    },
  },
  created() {
    this.devBackgroundFamily = this.$store.state.devBackgroundFamily.splice(
      0,
      this.mode.length
    );
    this.devBackgroundFamily.sort(function() {
      return Math.random() - 0.5;
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.fastKey();
    });
  },
  destroyed() {
    document.onkeyup = function() {};
  },
  filters: {
    formateTime(t) {
      let hours = Math.floor(t / 60 / 60);
      let secs = t % 60;
      let mins = (t - hours * 60 * 60 - secs) / 60;
      function fixedTwo(num) {
        return num < 10 ? "0" + num : num;
      }
      return `${fixedTwo(hours)}:${fixedTwo(mins)}:${fixedTwo(secs)}`;
    },
  },
  methods: {
    // 快捷键
    fastKey() {
      let that = this;
      let keyMap = ["escape", "", "r"];
      document.onkeyup = function(e) {
        let key = e.key.toLowerCase().replace(/ /g, "");
        if (keyMap.indexOf(key) > -1 && that.status !== 0) {
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
      this.curMode = this.mode[index];
      this.initGame();
    },
    /**
     * 游戏进行时
     */
    // 游戏初始化，分配地址
    initGame() {
      let row = this.curMode.boardHeight;
      let col = this.curMode.boardWidth;
      let minesArr = this.getRandomMines(row, col, this.curMode.mine);
      console.log(minesArr);
      // 初始化数据
      this.clearNum = 0;
      this.timeCount(2);
      this.status = 1;
      this.mineBoardArr = [];
      for (let i = 0; i < row; i++) {
        this.mineBoardArr[i] = [];
        for (let j = 0; j < col; j++) {
          this.mineBoardArr[i][j] = {
            value: "", // 九宫格内地雷数量
            isMine: false, // 是否是地雷
            isShow: false, // 是否显示
            isSign: false, // 是否标记旗
            isUnknown: false, // 是否标记问号
            isDestroyed: false, // 是否是点中雷
          };
          let isMine = minesArr.filter((mine) => {
            return mine[0] === i && mine[1] === j;
          });
          if (isMine && isMine.length > 0) {
            this.mineBoardArr[i][j].isMine = true;
            this.mineBoardArr[i][j].value = null;
          }
        }
      }
      this.mineBoardArr.forEach((rowArr, i) => {
        rowArr.forEach((area, j) => {
          if (!area.isMine) {
            area.value = this.getNineGridMine(i, j);
          }
        });
      });
    },
    // 计算九宫格区域内地雷数量
    getNineGridMine(row, col) {
      let num = 0;
      this.mineBoardArr.forEach((rowArr, i) => {
        rowArr.forEach((area, j) => {
          if (
            i >= row - 1 &&
            i <= row + 1 &&
            j >= col - 1 &&
            j <= col + 1 &&
            area.isMine
          )
            num++;
        });
      });
      return num === 0 ? "" : num;
    },
    // 随机分配地雷
    getRandomMines(row, col, num) {
      let minesArr = [];
      do {
        let mine = getUnique(minesArr);
        if (mine) minesArr.push(mine);
      } while (minesArr.length < num);
      function getUnique(arr) {
        let i = Math.floor(Math.random() * row);
        let j = Math.floor(Math.random() * col);
        let idx = arr.findIndex((item) => {
          return item[0] == i && item[1] == j;
        });
        if (idx === -1) {
          return [i, j];
        }
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
    clickArea(e) {
      let data = e.currentTarget.dataset;
      let area = this.mineBoardArr[data.row][data.col];
      if (this.clearNum == 0) {
        this.timeCount(1);
      }
      // 游戏已结束或者已标记或者已显示的区域点击无效
      if (this.status > 1 || area.isSign || area.isShow) {
        return;
      }
      // 中雷，游戏结束
      if (area.isMine) {
        area.isDestroyed = true;
        this.$forceUpdate();
        this.gameFail();
        return;
      }
      // 非雷区，显示
      this.showAround(data.row, data.col);
      // 清雷，游戏成功
      if (
        this.clearNum ==
        this.curMode.boardWidth * this.curMode.boardHeight - this.curMode.mine
      ) {
        this.gameSuccess();
      }
      this.$forceUpdate();
    },
    // 空白区域显示
    showAround(row, col) {
      row = row * 1;
      col = col * 1;
      let clickarea = this.mineBoardArr[row][col];
      if (clickarea.isShow) return;
      clickarea.isShow = true;
      this.clearNum++;
      if (clickarea.value == "") {
        for (let i = row - 1; i <= row + 1; i++) {
          for (let j = col - 1; j <= col + 1; j++) {
            if (
              i < 0 ||
              i >= this.curMode.boardHeight ||
              j < 0 ||
              j >= this.curMode.boardWidth ||
              (i == row && j == col)
            )
              continue;
            this.showAround(i, j);
          }
        }
      }
    },
    // 鼠标右击事件标记
    signMine(e) {
      let data = e.currentTarget.dataset;
      let area = this.mineBoardArr[data.row][data.col];
      if (e.button == 2 && this.status < 2 && !area.isShow) {
        let sign = !area.isSign && !area.isUnknown ? true : false;
        let unknown = area.isSign && !area.isUnknown ? true : false;
        area.isSign = sign;
        area.isUnknown = unknown;
        this.$forceUpdate();
      }
    },
    // 计时
    timeCount(flag) {
      if (flag === 1) {
        time = setInterval(() => {
          this.timeSeconds++;
        }, 1000);
      } else if (flag === 2) {
        if (time) clearInterval(time);
        this.timeSeconds = 0;
      } else {
        clearInterval(time);
      }
    },
    /**
     * 游戏结束
     */
    // 成功
    gameSuccess() {
      this.status = 2;
      this.timeCount(0);
      this.$message({
        message: "恭喜你，扫雷成功",
        type: "success",
      });
    },
    // 失败
    gameFail() {
      this.status = 3;
      this.timeCount(0);
      this.$message.error("游戏结束");
    },
  },
};
</script>
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
      flex-wrap: wrap;
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
        color: #7c96b1;
        font-weight: bold;
        .iconfont {
          font-size: 0.2rem;
          color: #222;
        }
        &:hover {
          opacity: 0.5;
        }
        i,
        span {
          cursor: default;
          -webkit-touch-callout: none; /*系统默认菜单被禁用*/
          -webkit-user-select: none; /*webkit浏览器*/
          -khtml-user-select: none; /*早期浏览器*/
          -moz-user-select: none; /*火狐*/
          -ms-user-select: none; /*IE10*/
          user-select: none;
        }
      }
      .td-show {
        background: none;
        box-shadow: none;
        &:hover {
          opacity: 0.8;
        }
      }
      .td-sign {
        background: #ffbda9;
        box-shadow: -2px -2px 2px #bd7b68 inset;
        .iconfont {
          color: red;
        }
      }
      .td-unknown {
        background: #2ba02b;
        box-shadow: -2px -2px 2px #1b751b inset;
        .iconfont {
          color: #0f6b0f;
        }
      }
      .td-destroyed {
        background-color: red;
      }
    }
  }
}
@media screen and (max-width: 900px) {
  .container .saolei-home .mode li {
    width: 80%;
    font-size: 0.3rem;
  }
}
</style>
