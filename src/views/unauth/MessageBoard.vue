<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>

    <div class="content">
      <div class="cr">
        <div
          class="infinite-list-wrapper record"
          style="overflow-y:auto;overflow-x: hidden;"
        >
          <happy-scroll
            color="rgba(0,0,0,0.2)"
            size="3"
            :hide-horizontal="true"
            resize
          >
            <ul
              class="list"
              v-infinite-scroll="load"
              infinite-scroll-disabled="disabled"
            >
              <li
                v-for="(item, index) in list"
                class="list-item"
                v-bind:key="item.id"
                ref="{{item.id}}"
              >
                <div class="name">
                  <img :src="
                      require('../../assets/imgs/head/' +
                        getHeadImgIndex(index) +
                        '.png')
                    " />
                </div>
                <div
                  class="text"
                  v-html="item.content"
                ></div>

                <!-- 操作 -->
                <div class="operation">
                  <div
                    class="reply"
                    id="reply"
                    @click="dialogForm(item.id)"
                  >
                    回复
                  </div>
                  <div
                    class="praise"
                    :class="{ red1: item.praise }"
                    id="praise"
                    @click="praise(item)"
                  >
                    <i class="iconfont">&#xe60c;</i>
                    ({{ item.praiseCount }})
                  </div>
                  <div class="time">
                    {{ item.createTime | formatDate("YYYY-MM-DD") }}
                  </div>
                </div>
                <!-- 回复 -->
                <div
                  class="reply-list"
                  v-if="item.reply"
                >
                  <div
                    class="reply-item"
                    v-for="(replyIitem, replyIndex) in item.reply"
                    v-bind:key="replyIitem.id"
                    ref="{{replyIitem.id}}"
                  >
                    <div class="name">
                      <img :src="
                          require('../../assets/imgs/head/' +
                            getHeadImgIndex(replyIndex) +
                            '.png')
                        " />
                    </div>
                    <div class="reply">{{ replyIitem.content }}</div>
                    <div class="operation">
                      <div
                        class="praise"
                        :class="{ red1: replyIitem.praise }"
                        id="praise"
                        @click="praise(replyIitem)"
                      >
                        <i class="iconfont">&#xe60c;</i>
                        ({{ replyIitem.praiseCount }})
                      </div>
                      <div class="time">
                        {{ replyIitem.createTime | formatDate("YYYY-MM-DD") }}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <p
              v-if="loading"
              class="loading"
            >加载中...</p>
            <p
              v-if="noMore"
              class="no-more"
            >没有更多了</p>
          </happy-scroll>
        </div>
      </div>
      <div class="message">
        <el-button
          type="primary"
          @click="dialogForm(null)"
        >点击留言</el-button>
      </div>
      <el-dialog
        title="请输入留言"
        :visible.sync="dialogFormVisible"
      >
        <el-form>
          <el-form-item label>
            <!-- 回复框 -->
            <el-input
              v-if="this.msgId"
              type="textarea"
              v-model="text"
              autocomplete="off"
            ></el-input>
            <!-- 留言框 -->
            <vue-tinymce
              v-else
              v-model="text"
              :setting="setting"
            />
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="addMsg"
            id="add-message"
          >确 定</el-button>
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
    Footer,
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
      pageSize: 10,
      msgId: "",
      setting: {
        menubar: false,
        toolbar:
          "undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontselect fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | removeformat |",
        toolbar_drawer: "sliding",
        quickbars_selection_toolbar:
          "removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor",
        plugins: "link image media table lists fullscreen quickbars",
        language: "zh_CN", //本地化设置
        height: 350,
      },
    };
  },
  created() {

  },
  computed: {
    disabled() {
      return this.loading || this.noMore;
    },
  },

  methods: {
    //显示输入框
    dialogForm(id) {
      this.msgId = id;
      this.dialogFormVisible = true;
    },
    //下滑加載數據
    load() {
      this.loading = true;
      this.pageNo++;
      this.initTextList();
    },
    //獲取頭像
    getHeadImgIndex(val) {
      if (val > 34) {
        return val % 34;
      }
      return val;
    },
    //添加留言
    addMsg() {
      if (this.text) {
        var formData = new FormData();
        formData.append("msg", this.text);
        formData.append("msgId", this.msgId);
        this.$http.post("unAuth/addMsgBoard", formData).then((res) => {
          this.dialogFormVisible = false;
          this.text = "";
          //刷新列表
          this.list = [];
          this.pageNo = 0;
          this.initTextList();
        });
      } else {
        this.$message({
          message: "内容不能为空",
          type: "warning",
        });
      }
    },
    //留言列表
    initTextList() {
      let param = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      this.$http.get("unAuth/findMsgBoard", param).then((res) => {
        this.loading = false;
        if (res.length < this.pageSize) {
          this.noMore = true;
        }
        this.list.push(...res);
      });
    },
    //点赞
    praise(item) {
      if (item.praise == 0) {
        var formData = new FormData();
        formData.append("msgId", item.id);
        this.$http.post("unAuth/msgBoardPraise", formData).then((res) => {
          item.praise = 1;
          item.praiseCount++;
        });
      }
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
    text-align: center;
    color: #7c96b1;
    margin-top: 0.2rem;
  }

  .content {
    width: 45%;
    height: 62%;
    margin: 0 auto;
    .cr {
      width: 100%;
      height: 100%;
      .record {
        margin-top: 0.2rem;
        height: 100%;
        width: 100%;
        /deep/infinite-list-wrapper {
          height: 100%;
        }
        /deep/.happy-scroll-content {
          width: 100%;
        }
        .loading {
          text-align: center;
          font-size: 0.16rem;
        }
        .no-more {
          text-align: center;
          font-size: 0.16rem;
          line-height: 0.49rem;
        }
        .list {
          width: 88%;
          margin: 0;
          padding: 0;
          padding-left: 0.45rem;
          .list-item {
            position: relative;
            margin-top: 0.45rem;
            padding-bottom: 0.1rem;
            padding-left: 0.06rem;
            margin-right: 0.2rem;
            width: 100%;
            list-style-type: none;
            &:first-of-type {
              margin-top: 0.2rem;
            }
            .name {
              font-size: 0.2rem;
              img {
                width: 0.4rem;
                position: absolute;
                left: -0.42rem;
                top: -0.1rem;
              }
            }
            .text {
              color: #333333;
              line-height: 0.24rem;
              text-align: justify;
              word-break: break-all;
              font-size: 0.16rem;
            }
            .operation {
              display: flex;
              flex-direction: row;
              text-align: right;
              font-size: 0.12rem;
              justify-content: flex-end;
              align-items: baseline;
              margin-top: 0.1rem;
              color: #000;
              cursor: pointer;
              .reply {
                margin-right: 0.2rem;
              }
              .praise {
                text-align: left;
                margin-right: 0.2rem;
              }
            }
            .reply-list {
              padding: 0% 0.2rem 0% 0.65rem;
              margin-top: 0.1rem;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),
                0 0 6px rgba(0, 0, 0, 0.04);
              padding-top: 0.2rem;
              .reply-item {
                padding: 0.05rem 0;
                position: relative;
                .operation {
                  color: #6b6b6b;
                }
                .name {
                  position: absolute;
                  left: -0.1rem;
                }
                .reply {
                  font-size: 0.14rem;
                  color: #808080;
                }
              }
            }
          }
        }
      }
    }
    .message {
      margin: 0 auto;
      text-align: center;
      margin-top: 0.3rem;
      line-height: 0;
      button {
        width: 2rem;
        height: 0.5rem;
        line-height: 0;
      }
    }
    /deep/.el-textarea__inner {
      height: 1rem;
    }
    /deep/.el-dialog {
      line-height: 0;
    }
  }
}

@media screen and (max-width: 900px) {
  .container {
    .content {
      width: 90%;
      // height: 65%;
      .cr {
        .record {
          .list {
            .list-item {
              width: 88%;
            }
          }
        }
      }

      .message {
        /deep/.el-button {
          width: 2rem !important;
          height: 0.7rem !important;
          border-radius: 0.7rem !important;
        }
      }
    }
  }
  /deep/.el-dialog {
    width: 95%;
  }
}
</style>
