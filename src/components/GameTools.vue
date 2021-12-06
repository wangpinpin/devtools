<template>
  <div>
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
    <div class="pop-rank" v-if="isShowRank" ref="popRank">
      <div class="mask" @click="hideRank"></div>
      <el-tabs
        class="rank-content"
        tab-position="left"
        type="border-card"
        v-model="activeRankName"
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
export default {
  name: "GameTools",
  props: {
    mode: {
      type: Array,
    },
    activeRank: {
      type: String,
    }
  },
  data() {
    return {
      isShowRank: false, // 是否显示排行榜
      rankData: [],
      activeRankName: this.activeRank,
    };
  },
  methods: {
    // 重新开始游戏
    initGame() {
      this.$emit("initGame");
    },
    // 隐藏游戏
    hideGame() {
      this.$emit("hideGame");
    },
    // 退出游戏
    exitGame() {
      this.$emit("exitGame");
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
.pop-rank {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
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
</style>
