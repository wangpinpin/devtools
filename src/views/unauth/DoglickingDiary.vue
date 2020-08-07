<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>
    <div class="content">
      <div class="condition">
        <div class="date">
          <el-date-picker v-model="date" type="date" placeholder="选择日期">
          </el-date-picker>
        </div>
        <div class="search" @click="search">
          <el-button type="success">开舔</el-button>
        </div>
      </div>
      <div class="text">
        <div class="copy" @click="copy">复制</div>
        {{ text }}
      </div>
    </div>
    <Footer />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "ColorTransfer",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      title: "舔狗日记",
      date: new Date(),
      text: "",
    };
  },
  created() {},
  methods: {
    search() {
      this.$http.get("unAuth/getDoglickingDiary").then((res) => {
        const date = this.$options.filters["formatDate"](
          this.date,
          "yyyy年MM月dd日"
        );
        this.text = date + " "+ res;
      });
    },
    copy() {
      this.$copyText(this.text).then(() => {
        this.$message({
          message: "复制成功",
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
    font-size: 40px;
    text-align: center;
    color: #fff;
  }

  .content {
    margin: 10% auto;
    width: 27%;

    .condition {
      display: flex;
      flex-direction: row;
      margin: 0 auto;
      justify-content: space-between;
    }
    .text {
      background: #fff;
      height: 1.5625rem;
      margin: 5% auto;
      padding: 11% 5% 5% 5%;
      font-size: 17px;
      color: #616161;
      position: relative;

      .copy {
        position: absolute;
        top: 10px;
        right: 24px;
        color: blue;
        cursor: pointer;
      }
    }
  }
}
@media screen and (max-width: 900px) {
  .container {
    .title {
      font-size: 100px;
      margin-top: 25%;
    }
    .content {
      margin: 22% auto;
      width: 90%;
      .condition {
        .search {
          height: 150px;
          width: 300px;
          font-size: 40px;

          button {
            width: 100%;
            height: 100%;
            font-size: 40px;
          }

          .date {
            visibility: hidden;
          }
        }
      }
      .text {
        display: flex;
        align-items: center;
        height: auto;
        font-size: 40px;
        padding: 6%;
        min-height: 400px;
      }
    }
  }
  /deep/.el-message {
    display: flex;
    justify-content: center;
    .el-message__icon,
    .el-message__content {
      font-size: 40px;
    }
  }
}
</style>
