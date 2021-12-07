<template>
  <div v-if="isShowGame" class="container">
    <div v-if="status === 0" class="game-home">
      <Header />
      <div class="title">{{ title }}</div>
      <ul class="pics">
        <li
          v-for="(pic, index) in pics"
          :key="index"
          title="点击进入拼图"
          @click="selectPic(index)"
        >
          <img :src="pic" alt="" />
        </li>
      </ul>
      <Footer class="footer" />
    </div>
    <div v-else class="game-content" oncontextmenu="return(false)">
      <GameTools
        :mode="mode"
        :activeRank="activeRank"
        :code="code"
        @initGame="initGame"
        @hideGame="hideGame"
        @exitGame="exitGame"
      />
      <div class="game-field">
        <div class="field-left">
          <div class="referPic">
            <img :src="pics[selPicIndex]" alt="" />
            <p>参考图</p>
          </div>
          <div class="timecount">
            <i class="iconfont">&#xe61c;</i>
            <span>{{ timeSeconds | formateTime }}</span>
          </div>
        </div>
        <div class="field-center">
          <ul class="jigsaws-grid">
            <li
              v-for="(item, index) in gridData"
              :key="index"
              :style="item.style"
              @click="movePic(index)"
            ></li>
          </ul>
        </div>
        <div class="field-right">
          <ul class="mode">
            <li
              v-for="(item, index) in mode"
              :key="index"
              :class="selModeIndex == index ? 'cur' : ''"
              @click="selectMode(index)"
            >
              {{ item.text }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import GameTools from "@/components/GameTools.vue";
let time = null;
let keyDirs = ["arrowup", "arrowdown", "arrowleft", "arrowright"];
export default {
  name: "Jigsaws",
  components: {
    Header,
    Footer,
    GameTools,
  },
  data() {
    return {
      title: "拼图",
      code: "14f5ea6a-566a-11ec-b098-5254000e620b",
      userid: "",
      isShowGame: true, // 是否显示游戏界面
      status: 0, // 状态 0-未开始；1-游戏中；2-游戏成功；3-游戏失败
      pics: [
        require("@/assets/imgs/games/jigsaws/0.jpg"),
        require("@/assets/imgs/games/jigsaws/1.jpg"),
      ],
      selPicIndex: 0,
      mode: [
        {
          name: "first",
          size: 3,
          text: "初级",
        },
        {
          name: "second",
          size: 4,
          text: "中级",
        },
        {
          name: "third",
          size: 6,
          text: "高级",
        },
      ],
      selModeIndex: 0,
      timeSeconds: "0", // 游戏计时-秒
      gridData: [], // 拼图分割数组
      activeRank: "first",
    };
  },
  watch: {
    isShowGame(curVal) {
      let title = curVal ? this.title : "404";
      document.title = title;
    },
    gridData(curVal) {
      // id和索完全匹配，游戏成功
      let checkOk = curVal.every((item, index) => {
        return item.id == index;
      });
      if (checkOk) this.gameSuccess();
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
    randomNum() {
      return 0.5 - Math.random();
    },
    // 快捷键
    fastKey() {
      let that = this;
      let keyMap = ["escape", "", "r"];
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
                that.initGame(true);
                break;
              default:
                break;
            }
          } else if (keyDirs.indexOf(key) > -1) {
            that.moveByKey(key);
          }
        }
      };
    },
    /**
     * 游戏首页
     */
    // 图片选择
    selectPic(index) {
      this.selPicIndex = index;
      this.initGame();
    },
    /**
     * 游戏进行时
     */
    // 游戏初始化 初始化时isRefresh是否仅刷新，未改变模式可直接打乱顺序
    initGame(isRefresh) {
      let size = this.mode[this.selModeIndex].size;
      let num = size * size;
      let posItem = 100 / (size - 1); //背景图position间隔
      // 初始化数据
      if (!isRefresh) {
        this.gridData = [];
        for (let i = 0; i < num; i++) {
          let _width = 100 / size + "%";
          let _posX = (i % size) * posItem + "%";
          let _posY = Math.floor(i / size) * posItem + "%";
          let picItem = {
            id: i,
            style: `width: ${_width}; padding-top: ${_width}; ${
              i !== num - 1
                ? `background-image: url(${
                    this.pics[this.selPicIndex]
                  }); background-size: ${100 *
                    size}%; background-position: ${_posX} ${_posY};`
                : ""
            }`,
          };
          this.gridData.push(picItem);
        }
      }
      // 乱序
      this.gridData.sort(this.randomNum);
      this.timeCount(2);
      this.status = 1;
    },
    // 选择模式
    selectMode(index) {
      this.selModeIndex = index;
      this.activeRank = this.mode[index].name;
      this.initGame();
    },
    // 碎片数组元素交换
    swapArray(index1, index2) {
      let size = this.mode[this.selModeIndex].size;
      if (this.gridData[index2].id == size * size - 1) {
        if (!time) this.beginGame();
        this.gridData[index1] = this.gridData.splice(
          index2,
          1,
          this.gridData[index1]
        )[0];
      }
    },
    // 不同方向移动
    moveForDirs(dir, index, isKey) {
      let size = this.mode[this.selModeIndex].size;
      if (dir === keyDirs[0]) {
        // 上移
        if (index + size < size * size) {
          if (isKey) this.swapArray(index + size, index);
          else this.swapArray(index, index + size);
        }
      } else if (dir === keyDirs[1]) {
        // 下移
        if (index - size >= 0) {
          if (isKey) this.swapArray(index - size, index);
          else this.swapArray(index, index - size);
        }
      } else if (dir === keyDirs[2]) {
        // 左移
        if (index % size < size - 1) {
          if (isKey) this.swapArray(index + 1, index);
          else this.swapArray(index, index + 1);
        }
      } else {
        // 右移
        if (index % size > 0) {
          if (isKey) this.swapArray(index - 1, index);
          else this.swapArray(index, index - 1);
        }
      }
    },
    // 移动碎片
    movePic(index) {
      if (this.status !== 1) return;
      keyDirs.forEach((dir) => {
        this.moveForDirs(dir, index);
      });
    },
    // 键盘控制碎片移动
    moveByKey(dir) {
      let size = this.mode[this.selModeIndex].size;
      let emptyIdx = null;
      this.gridData.some((item, index) => {
        if (item.id == size * size - 1) {
          emptyIdx = index;
        }
      });
      this.moveForDirs(dir, emptyIdx, true);
    },
    // 隐藏游戏
    hideGame() {
      this.isShowGame = !this.isShowGame;
    },
    // 退出游戏
    exitGame() {
      this.status = 0;
    },
    // 开始游戏
    beginGame() {
      this.timeCount(1);
      this.$http.post("game/playGame", { playGameBo: "test" }).then((res) => {
        this.userid = res;
      });
    },
    // 计时
    timeCount(flag) {
      if (flag === 1) {
        time = setInterval(() => {
          this.timeSeconds++;
        }, 1000);
      } else if (flag === 2) {
        if (time) clearInterval(time);
        time = null;
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
      this.$http.post("game/gameEnd/" + this.userid).then((res) => {
        this.$message({
          message: "恭喜你，挑战成功",
          type: "success",
        });
      });
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
  .game-home {
    .pics {
      list-style: none;
      display: flex;
      justify-content: center;
      li {
        width: 20%;
        margin: 0.1rem;
        border-radius: 0.2rem;
        overflow: hidden;
        font-size: 0;
        cursor: pointer;
        img {
          width: 100%;
          transition: all 0.5s;
        }
        &:hover {
          img {
            transform: scale(1.1);
          }
        }
      }
    }
  }
  .game-content {
    height: 100%;
  }
  .game-field {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #7c96b1;
    img {
      width: 100%;
    }
    .field-left {
      width: 15%;
      font-size: 0.2rem;
      text-align: center;
      p {
        margin: 0;
        margin-top: 0.1rem;
      }
      .timecount {
        font-size: 0.3rem;
        margin-top: 0.3rem;
        .iconfont {
          font-size: 0.3rem;
          margin-right: 0.1rem;
        }
      }
    }
    .field-center {
      width: 32%;
      margin: 0 4%;
      background-color: #fff;
      padding: 1px;
      font-size: 0;
    }
    .field-right {
      width: 10%;
    }
    .jigsaws-grid {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      padding: 0;
      li {
        border: 1px solid #fff;
        box-sizing: border-box;
      }
    }
    .mode {
      padding: 0;
      list-style: none;
      li {
        margin: 0.2rem 0;
        font-size: 0.3rem;
        line-height: 2;
        text-align: center;
        border-radius: 0.2rem;
        cursor: pointer;
        position: relative;
        &::before,
        &::after {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          border: 0.04rem solid transparent;
          box-sizing: border-box;
        }
        &::before {
          top: 0;
          left: 0;
        }
        &::after {
          bottom: 0;
          right: 0;
        }
        &:hover,
        &.cur {
          &::before {
            width: 100%;
            height: 100%;
            border-top-color: #7c96b1;
            border-right-color: #7c96b1;
            transition: width 0.2s ease-out, height 0.2s ease-out 0.2s;
          }
          &::after {
            width: 100%;
            height: 100%;
            border-bottom-color: #7c96b1;
            border-left-color: #7c96b1;
            transition: border-color 0.2s ease-out 0.4s,
              width 0.2s ease-out 0.4s, height 0.2s ease-out 0.6s;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 900px) {
}
</style>
