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
      <div class="game-tools">
        <el-tooltip
          class="game-hide"
          effect="dark"
          content="重新再战（快捷键R/r切换）"
          placement="right-start"
          ><span class="tool-item" @click="initGame(true)"
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
        <el-tooltip
          class="game-rank"
          effect="dark"
          content="排行榜"
          placement="right-start"
          ><span class="tool-item" @click="showRank"
            ><i class="iconfont">&#xe634;</i></span
          ></el-tooltip
        >
      </div>
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
              @click="movePic"
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
    <div class="pop-rank" v-if="isShowRank" ref="popRank">
      <div class="mask" @click="hideRank"></div>
      <el-tabs
        class="rank-content"
        tab-position="left"
        type="border-card"
        v-model="activeRank"
      >
        <el-tab-pane
          v-for="(item, index) in mode"
          :key="index"
          :label="item.text"
          :name="item.name"
        >
          <el-table :data="rankData[index].data" stripe style="width: 100%">
            <el-table-column prop="name" label="用户名"></el-table-column>
            <el-table-column prop="score" label="记录"></el-table-column>
            <el-table-column prop="time" label="时间"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
let time = null;
export default {
  name: "Jigsaws",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      title: "拼图",
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
      isShowRank: false, // 是否显示排行榜
      rankData: [],
      activeRank: "first",
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
        if (keyMap.indexOf(key) > -1 && that.status !== 0) {
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
    // 移动碎片
    movePic() {
      if (this.status !== 1) return;
    },
    // 隐藏游戏
    hideGame() {
      this.isShowGame = !this.isShowGame;
    },
    // 退出游戏
    exitGame() {
      this.status = 0;
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
        message: "恭喜你，挑战成功",
        type: "success",
      });
    },
    // 失败
    gameFail() {
      this.status = 3;
      this.timeCount(0);
      this.$message.error("游戏结束");
    },
    /**
     * 排行榜
     */
    // 获取排行榜
    getRank() {
      this.rankData = [
        {
          name: "first",
          data: [
            {
              name: "zs",
              score: "00:00:13",
              time: "2021/12/12",
            },
            {
              name: "ls",
              score: "00:00:16",
              time: "2021/11/12",
            },
            {
              name: "we",
              score: "00:00:44",
              time: "2021/10/12",
            },
          ],
        },
        {
          name: "second",
          data: [
            {
              name: "zs2",
              score: "00:00:13",
              time: "2021/12/12",
            },
            {
              name: "ls2",
              score: "00:00:16",
              time: "2021/11/12",
            },
          ],
        },
        {
          name: "third",
          data: [
            {
              name: "ls3",
              score: "00:00:16",
              time: "2021/11/12",
            },
          ],
        },
      ];
    },
    showRank() {
      this.getRank();
      this.isShowRank = true;
    },
    hideRank() {
      this.isShowRank = false;
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
.pop-rank {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  .mask {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .rank-content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 75%;
    height: 75vh;
  }
}
@media screen and (max-width: 900px) {
}
</style>
