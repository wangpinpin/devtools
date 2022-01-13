<template>
  <div v-if="isShowGame" class="container">
    <!-- <div class="title">{{ title }}</div> -->
    <div class="game-content" oncontextmenu="return(false)">
      <div class="game-header">
        <div class="score"><i class="iconfont">&#xe670;</i>{{ score }}</div>
      </div>
      <table
        class="game-board"
        @touchstart="handleTouchstart"
        @touchend="handleTouchend"
      >
        <tr v-for="(row, i) in boardArr" :key="i">
          <td v-for="(col, j) in row" :key="j">
            <span
              v-if="col !== 0"
              :style="
                `backgroundColor: ${colorArr[col - 1]}; color: ${
                  col < 3 ? '#666' : '#fff'
                }`
              "
              >{{ numArr[col - 1] }}</span
            >
          </td>
        </tr>
      </table>

      <GameTools
        :code="code"
        @initGame="initGame"
        @hideGame="hideGame"
        @exitGame="exitGame"
      />
    </div>
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import GameTools from "@/components/GameTools.vue";
let keyDirs = ["arrowup", "arrowdown", "arrowleft", "arrowright"];
export default {
  name: "A2048",
  components: {
    Header,
    Footer,
    GameTools,
  },
  data() {
    return {
      title: "2048",
      code: "e1fbaadb-5669-11ec-b098-5254000e620b",
      userid: "",
      isShowGame: true, // 是否显示游戏界面
      status: 1, // 状态 0-未开始；1-游戏中；2-游戏成功；3-游戏失败
      boardArr: [], // 区域二维数组
      numArr: [], // 填充内容 2/4/8...
      colorArr: [
        "#ffeee4",
        "#d6fff1",
        "#f5b352",
        "#d2b7e2",
        "#f17f43",
        "#8bd78f",
        "#67b3d0",
        "#e1df98",
        "#3f9337",
        "#1f9baa",
        "#800080",
        "#ff0000",
        "#eb4310",
      ],
      score: 0,
    };
  },
  watch: {
    isShowGame(curVal) {
      let title = curVal ? this.title : "404";
      document.title = title;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.fastKey();
    });
  },
  destroyed() {
    document.onkeyup = function() {};
  },
  created() {
    this.initData();
    this.initGame();
  },
  methods: {
    // 初始化数据
    initData() {
      let num = 1;
      let step = 2;
      for (let i = 1; i < 14; i++) {
        num *= step;
        this.numArr.push(num);
      }
    },
    // 快捷键
    fastKey() {
      let that = this;
      let keyMap = ["escape", "", "r"].concat(keyDirs);
      document.onkeyup = function(e) {
        let key = e.key.toLowerCase().replace(/ /g, "");
        if (that.status !== 0) {
          if (keyMap.indexOf(key) > -1) {
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
              case "arrowup":
                that.moveVertical();
                break;
              case "arrowdown":
                that.moveVertical(true);
                break;
              case "arrowleft":
                that.moveHorizontal();
                break;
              case "arrowright":
                that.moveHorizontal(true);
                break;
              default:
                break;
            }
          }
        }
      };
    },
    // 屏幕滑动
    // 手指按下屏幕
    handleTouchstart(e) {
      this.starttime = Date.now();
      this.startX = e.changedTouches[0].clientX;
      this.startY = e.changedTouches[0].clientY;
    },
    // 手指离开屏幕
    handleTouchend(e) {
      const endTime = Date.now();
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      // 判断按下的时长
      if (endTime - this.starttime > 2000) {
        return;
      }
      // 滑动的方向
      let direction = "";
      //先判断用户滑动的距离，是否合法，合法:判断滑动的方向 注意 距离要加上绝对值
      if (Math.abs(endX - this.startX) > 10) {
        //滑动方向
        if (Math.abs(endY - this.startY) > 30) {
          console.log("y方向偏移太多，不让你滑了")
          return;
        } else {
          direction = endX - this.startX > 0 ? "right" : "left";
        }
      } else {
        return;
      }
      //用户做了合法的滑动操作
      console.log('方向'+direction)
      if (direction === "left") {
        if (this.currents + 1 === this.list.length) {
          return;
        } else {
          this.currents++;
          //触发事件
          // this.$emit("getData");
        }
      }
      if (direction === "right") {
        if (this.currents === 0) {
          return;
        } else {
          this.currents--;
          //触发事件
          // this.$emit("getData");
        }
      }
    },
    /**
     * 游戏进行时
     */
    // 游戏初始化，分配地址
    initGame() {
      this.boardArr = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      this.score = 0;
      this.assignRandom();
      this.assignRandom();
    },
    // 空白位置随机分配数字
    assignRandom() {
      let _numArr = [1, 2];
      let _ri = Math.floor(Math.random() * 4);
      let _rj = Math.floor(Math.random() * 4);
      if (this.boardArr[_ri][_rj] !== 0) {
        this.assignRandom();
        return;
      }
      this.boardArr[_ri][_rj] =
        _numArr[Math.floor(Math.random() * _numArr.length)];
    },
    // 合并
    merge(arr, i) {
      arr[i]++;
      arr.splice(i + 1, 1);
      arr.push(0);
      this.score += this.numArr[arr[i] - 1];
      if (arr[i] > 10) {
        this.$confirm(
          "恭喜您已成功挑战" + this.numArr[arr[i]] + "，是否继续游戏？",
          "",
          {
            confirmButtonText: "结束游戏",
            cancelButtonText: "继续游戏",
            center: true,
          }
        ).then(() => {
          this.gameSuccess();
        });
      }
      return arr;
    },
    // 水平移动 左/右
    moveHorizontal(isReverse) {
      let moveable = false;
      for (let i = 0; i < 4; i++) {
        let arr = [0, 0, 0, 0];
        let index = 0;
        let contr_arr = this.boardArr[i];
        if (isReverse) contr_arr.reverse();
        // 每行数组重排
        contr_arr.forEach((num, idx) => {
          if (num !== 0) {
            // 重排后的数组和排列前数组位置不一样，当前可移动
            if (index !== idx) moveable = true;
            arr[index] = num;
            index++;
          }
        });
        // 重排后的数组相同元素合并，可移动
        for (let k = 0; k < 4; k++) {
          if (arr[k + 1] && arr[k] == arr[k + 1]) {
            moveable = true;
            arr = this.merge(arr, k);
          }
        }
        if (isReverse) arr.reverse();
        this.boardArr[i] = arr;
      }
      if (moveable) {
        this.assignRandom();
        this.$forceUpdate();
        this.judgeEnd();
      }
    },
    // 垂直移动 上/下
    moveVertical(isReverse) {
      let moveable = false;
      for (let i = 0; i < 4; i++) {
        let arr = [0, 0, 0, 0];
        let index = 0;
        // 每行数组重排
        if (isReverse) {
          for (let j = 3; j >= 0; j--) {
            let num = this.boardArr[j][i];
            if (num !== 0) {
              if (index + j !== 3) moveable = true;
              arr[index] = num;
              index++;
            }
          }
        } else {
          for (let j = 0; j < 4; j++) {
            let num = this.boardArr[j][i];
            if (num !== 0) {
              if (index !== j) moveable = true;
              arr[index] = num;
              index++;
            }
          }
        }
        for (let k = 0; k < 4; k++) {
          if (arr[k + 1] && arr[k] == arr[k + 1]) {
            moveable = true;
            arr = this.merge(arr, k);
          }
          if (isReverse) this.boardArr[3 - k][i] = arr[k];
          else this.boardArr[k][i] = arr[k];
        }
      }
      if (moveable) {
        this.assignRandom();
        this.$forceUpdate();
        this.judgeEnd();
      }
    },
    judgeEnd() {
      let flag = false;
      // 有空位继续
      for (let i = 0; i < 4; i++) {
        if (!flag && this.boardArr[i].indexOf(0) != -1) {
          flag = true;
        }
      }
      // 无空位，判断周围是否有相同号码
      if (!flag) {
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            if (
              (j < 3 && this.boardArr[i][j] == this.boardArr[i][j + 1]) ||
              (i < 3 && this.boardArr[i][j] == this.boardArr[i + 1][j])
            ) {
              flag = true;
            }
          }
        }
      }
      if (!flag) {
        this.gameFail();
      }
    },
    // 隐藏游戏
    hideGame() {
      this.isShowGame = !this.isShowGame;
    },
    // 退出游戏
    exitGame() {
      this.status = 0;
      this.$router.push("/");
    },
    /**
     * 游戏结束
     */
    // 成功
    gameSuccess() {
      this.status = 2;
      this.$http.post("game/gameEnd/" + this.userid).then((res) => {
        this.$message({
          message: "已为您保存记录" + this.score,
          type: "success",
        });
      });
    },
    // 失败
    gameFail() {
      this.status = 3;
      this.$message.error("游戏结束");
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .title {
    font-size: 0.4rem;
    color: #7c96b1;
    text-align: center;
    margin-bottom: 0.2rem;
  }
  .game-content {
    width: 100%;
    // height: 100%;
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
      margin: 0.2rem 0;
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
      background-color: #5c5c5c;
      border-spacing: 0.1rem;
      border-radius: 0.1rem;
      td {
        width: 1.2rem;
        height: 1.2rem;
        background-color: #2f2a26;
        border-radius: 0.1rem;
        text-align: center;
        padding: 0;
        overflow: hidden;
        span {
          display: block;
          cursor: default;
          font-size: 0.34rem;
          line-height: 1.2rem;
          height: 1.2rem;
          font-weight: bold;
          color: #fff;
          -webkit-touch-callout: none; /*系统默认菜单被禁用*/
          -webkit-user-select: none; /*webkit浏览器*/
          -khtml-user-select: none; /*早期浏览器*/
          -moz-user-select: none; /*火狐*/
          -ms-user-select: none; /*IE10*/
          user-select: none;
        }
      }
    }
  }
}
@media screen and (max-width: 900px) {
  .container {
    .game-content {
      .game-board {
        border-spacing: 1px;
        td {
          width: 0.15rem;
          height: 0.15rem;
          font-size: 0.1rem;
        }
      }
    }
  }
}
</style>
