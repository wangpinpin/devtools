<template>
  <div class="container">
    <Header />
    <div class="content">
      <div class="note-left" :style="` width: ${asideWidth}px `">
        <el-aside class="note-aside" width="100%">
          <div class="fixed-top">
            <div class="note-buttons">
              <el-button
                icon="el-icon-circle-plus-outline"
                type="text"
                @click="handleAdd"
                >新建笔记</el-button
              >
              <i class="el-icon-s-fold"></i>
            </div>
            <el-input
              placeholder="搜索"
              prefix-icon="el-icon-search"
              v-model="noteName"
            >
            </el-input>
          </div>
          <div class="note-scroll">
            <happy-scroll
              color="rgba(0,0,0,0.2)"
              size="3"
              :hide-horizontal="true"
              resize
            >
              <div class="" v-for="item in notes" :key="item.id">
                <el-card class="note-card" :data-id="item.id" @click="showNote">
                  <h3 class="note-name">{{ item.title }}</h3>
                  <p class="note-content">{{ item.content | toText }}</p>
                  <time class="note-time">{{ item.createTime }}</time>
                  <el-button type="text" class="button" @click="handleDelete"
                    ><i class="el-icon-delete"></i
                  ></el-button>
                </el-card>
              </div>
            </happy-scroll>
          </div>
        </el-aside>
      </div>
      <div id="resize"></div>
      <div class="note-right">
        <el-main class="note-main">
          <div class="note-top">
            <el-input class="note-title" v-model="note.title"></el-input>
            <el-button class="save" @click="handleSave">保存</el-button>
          </div>
          <vue-tinymce v-model="note.content" :setting="setting" />
        </el-main>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
export default {
  name: "Note",
  components: {
    Header,
  },
  data: function () {
    return {
      currentDate: new Date(),
      noteName: "",
      asideWidth: 250,
      notes: [],
      note: {
        title: "标题",
        content: "",
      },
      setting: {
        menubar: false,
        statusbar: false,
        resize: false,
        toolbar:
          "undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontselect fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | removeformat |",
        toolbar_drawer: "sliding",
        quickbars_selection_toolbar:
          "removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor",
        plugins: "link image media table lists fullscreen quickbars",
        language: "zh_CN", //本地化设置
        height: "100%",
      },
    };
  },
  filters: {
    toText(html) {
      return html
        .replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, "")
        .replace(/<[^>]+?>/g, "")
        .replace(/\s+/g, " ")
        .replace(/ /g, " ")
        .replace(/>/g, " ");
    },
  },
  methods: {
    // 侧边栏拉伸
    dragControllerDiv: function () {
      // 保留this引用
      let data = this;
      let resize = document.getElementById("resize");
      resize.onmousedown = function (e) {
        // 颜色改变提醒
        resize.style.background = "#ccc";
        let startX = e.clientX;
        resize.left = resize.offsetLeft;
        document.onmousemove = function (e) {
          // 计算并应用位移量
          let endX = e.clientX;
          let moveLen = endX - startX;
          startX = endX;
          data.asideWidth += moveLen;
        };
        document.onmouseup = function () {
          // 颜色恢复
          resize.style.background = "";
          document.onmousemove = null;
          document.onmouseup = null;
        };
        return false;
      };
    },
    // 获取用户笔记
    getNote() {
      this.$http.get("user/findNotebookList").then((res) => {
        this.notes = res;
      });
    },
    // 新建笔记
    handleAdd() {},
    // 保存笔记
    handleSave() {
      this.$http.post("user/saveNotebook", this.note).then((res) => {
        this.$message({
          message: "保存成功",
          type: "success",
        });
      });
    },
    // 删除笔记
    handleDelete() {
      this.$http.post("user/delNotebook", { id: "" }).then((res) => {
        this.$message({
          message: "删除成功",
          type: "success",
        });
      });
    },
    // 显示笔记内容
    showNote(e) {},
  },
  mounted() {
    this.dragControllerDiv();
  },
  created() {
    this.getNote();
  },
};
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: calc(100vh - 1.3rem);
  position: relative;
  overflow: hidden;
  display: flex;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.note-left {
  min-width: 250px;
  height: 100%;
  padding: 0.1rem;
  box-shadow: 0 0px 4px rgba(0, 0, 0, 0.12);
}

#resize {
  width: 5px;
  height: 100%;
  cursor: w-resize;
}

.note-right {
  height: 100%;
  flex: 1;
}

.note-aside {
  position: relative;

  .fixed-top {
    display: flex;
    flex-direction: column;
  }

  .note-buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.1rem;
    .el-button {
      font-size: 0.24rem;
      color: #74c0ef;
      &:hover {
        opacity: 0.8;
      }
    }
    i {
      font-size: 0.4rem;
      color: #74c0ef;
      cursor: pointer;
    }
  }

  /deep/.note-scroll {
    height: 7rem;
    margin-top: 0.1rem;
    .happy-scroll-container,
    .happy-scroll-content {
      width: 100% !important;
    }
  }
  .note-card {
    font-size: 0;
    position: relative;
    /deep/.el-card__body {
      padding: 0.05rem 0.15rem;
    }
    .note-name {
      margin: 0.5em 0;
      font-size: 0.2rem;
    }
    .note-content {
      margin: 0.5em 0;
      font-size: 0.16rem;
      color: #828282;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .note-time {
      font-size: 0.14rem;
      line-height: 2;
      color: #999;
    }
    .button {
      display: none;
      position: absolute;
      right: 0.15rem;
      top: 0.1rem;
      font-size: 0.2rem;
    }
    &:hover {
      transform: translateY(-0.02rem);
      transition: all 0.3s;
      .button {
        display: block;
      }
    }
  }
}

.note-main {
  padding: 0;
  height: 100%;
  position: relative;
  .note-title {
    /deep/.el-input__inner {
      padding: 0;
      background: none;
      border: none;
      font-size: 0.3rem;
    }
  }
  .note-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.2rem;
  }
}

/deep/.tox-tinymce {
  border: 0;
  .tox-edit-area__iframe {
    background-color: transparent;
  }
}
</style>
