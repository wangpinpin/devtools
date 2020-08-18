<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>

    <div class="content">
      <div class="cr">
        <div class="infinite-list-wrapper record" style="overflow-y:auto;overflow-x: hidden;">
          <happy-scroll color="rgba(0,0,0,0.2)" size="3" :hide-horizontal="true" resize>
            <ul class="list" v-infinite-scroll="load" infinite-scroll-disabled="disabled">
              <li v-for="(item,index) in list" class="list-item" v-bind:key="index">
                <div class="name">
                  <img :src="require('../../assets/imgs/head/'+ getHeadImgIndex(index + 1)+'.png')" />
                </div>
                <div class="text">{{item.content}}</div>
                <div class="time">{{item.createTime}}</div>
              </li>
            </ul>
            <p v-if="loading" class="loading">加载中...</p>
            <p v-if="noMore" class="no-more">没有更多了</p>
          </happy-scroll>
        </div>
      </div>

      <div class="message">
        <el-button type="primary" @click="dialogFormVisible = true">点击留言</el-button>
      </div>
      <el-dialog title="请输入留言" :visible.sync="dialogFormVisible">
        <el-form>
          <el-form-item label="">
            <el-input type="textarea" v-model="text" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addMsg">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <Footer />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "MessageBoard",
  components: {
    Header,
    Footer
  },
  data() {
    return {
      title: "留言板",
      list: [],
      loading: false,
      noMore: false,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      text: "",
      pageNo: -1,
      pageSize: 10
    };
  },
  created() {
    // this.initTextList();
  },
  computed: {
    disabled() {
      return this.loading || this.noMore;
    }
  },
  methods: {
    //下滑加載數據
    load() {
      this.loading = true;
      this.pageNo++;
      this.initTextList();
    },
    //獲取頭像
    getHeadImgIndex(val) {
      if (val > 35) {
        return val % 35;
      }
      return val;
    },
    //添加留言
    addMsg() {
      if (this.text) {
        var formData = new FormData();
        formData.append("msg", this.text);
        this.$http.post("unAuth/addMsgBoard", formData).then(res => {
          this.dialogFormVisible = false;
          this.text = "";
          //刷新列表
          this.list = [];
          this.pageNo = 0;
          this.initTextList();
        });
      } else {
        this.$message({
          message: "留言内容不能为空",
          type: "warning"
        });
      }
    },
    //留言列表
    initTextList() {
      let param = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      this.$http.get("unAuth/findMsgBoard", param).then(res => {
        this.loading = false;
        if (res.length < this.pageSize) {
          this.noMore = true;
        }
        this.list.push(...res);
      });
    }
  }
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;

  .title {
    font-size: 40px;
    text-align: center;
    color: #7c96b1;
  }

  .content {
    width: 45%;
    height: 62%;
    margin: 0 auto;
    .cr {
      width: 100%;
      height: 100%;
      .record {
        margin-top: 20px;
        height: 100%;
        width: 100%;
        /deep/infinite-list-wrapper {
          height: 100%;
        }
        .loading {
          text-align: center;
        }
        .no-more {
          text-align: center;
          line-height: 49px;
        }
        .list {
          width: 88%;
          .list-item {
            position: relative;
            margin-top: 45px;
            padding-bottom: 10px;
            padding-left: 6px;
            margin-right: 20px;
            width: 100%;
            list-style-type: none;
            .name {
              font-size: 20px;
              img {
                width: 40px;
                position: absolute;
                left: -42px;
              }
            }
            .text {
              color: #565656;
              line-height: 24px;
              text-align: justify;
              word-break: break-all;
              font-size: 16px;
            }
            .time {
              font-size: 12px;
              text-align: right;
              color: #6b6b6b;
              margin-right: 2%;
            }
          }
        }
      }
    }
    .message {
      margin: 0 auto;
      text-align: center;
      margin-top: 30px;
      button {
        width: 200px;
        height: 50px;
      }
    }
    /deep/.el-textarea__inner {
      height: 100px;
    }
  }
}
@media screen and (max-width: 900px) {
  .container {
    .title {
      font-size: 100px;
      margin-top: 10%;
      margin-bottom: 5%;
    }
    .content {
      width: 95%;
      .cr {
        .record {
          .loading,
          .no-more {
            font-size: 20px;
            margin-bottom: 1rem;
          }
          .list {
            .list-item {
              .name {
                img {
                  width: 12%;
                  position: absolute;
                  left: -13%;
                }
              }
              .text {
                line-height: 100px;
              }
            }
          }
        }
      }
    }
  }
  /deep/.el-button--primary {
    width: 3rem !important;
    height: 1rem !important;
    border-radius: 1rem !important;
  }
}
</style>
