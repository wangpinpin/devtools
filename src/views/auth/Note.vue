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
              <!-- <i class="el-icon-s-fold"></i> -->
            </div>
            <el-input
              v-model="searchNoteStr"
              prefix-icon="el-icon-search"
              placeholder="搜索"
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
              <div>
                <draggable
                  v-model="searchNotes"
                  v-bind="dragOptions"
                  @end="onDrag"
                >
                  <transition-group type="transition" name="flip-list">
                    <div
                      class="note-item"
                      v-for="(item, index) in searchNotes"
                      :key="item.id"
                      :data-index="index"
                      :data-id="item.id"
                      :ref="`note${item.id}`"
                      @click="showNote(item.id)"
                    >
                      <h3 class="note-name">
                        {{ item.title }}
                      </h3>
                      <p class="note-content">{{ item.content | toText }}</p>
                      <time class="note-time">{{ item.updateTime }}</time>
                      <el-button
                        type="text"
                        class="button"
                        @click="handleDelete(item.id)"
                        ><i class="el-icon-delete"></i
                      ></el-button>
                    </div>
                  </transition-group>
                </draggable>
              </div>
            </happy-scroll>
          </div>
        </el-aside>
      </div>
      <div id="resize"></div>
      <div class="note-right">
        <div class="note-edit" v-if="note">
          <el-main class="note-main">
            <div class="note-top">
              <el-input
                class="note-title"
                v-model="note.title"
                id="title"
              ></el-input>
              <el-button class="save" @click="handleSave(true)">保存</el-button>
            </div>
            <vue-tinymce
              v-if="!isDestroy"
              v-model="note.content"
              :setting="setting"
            />
          </el-main>
        </div>
        <h2 v-else class="note-desc" @click="handleAdd">
          {{ noteDesc }}
        </h2>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import draggable from "vuedraggable";
import { formatDate } from "@/util/date";
export default {
  name: "Note",
  components: {
    Header,
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        disabled: false,
      };
    },
  },
  data: function() {
    return {
      asideWidth: 250,
      noteDesc: "记录您的舔狗笔记...",
      searchNoteStr: "",
      searchNotes: [],
      notes: [],
      note: null,
      setting: {
        menubar: false,
        statusbar: false,
        resize: false,
        toolbar:
          "undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontselect fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat |",
        toolbar_drawer: "sliding",
        quickbars_selection_toolbar:
          "removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor",
        plugins: "image media table lists fullscreen quickbars",
        language: "zh_CN", //本地化设置
        height: "100%",
      },
      isDestroy: false, // 销毁编辑器
    };
  },
  watch: {
    searchNoteStr(curVal, oldVal) {
      let timeout;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.searchNote(curVal);
      }, 500);
    },
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
    dragControllerDiv: function() {
      // 保留this引用
      let data = this;
      let resize = document.getElementById("resize");
      resize.onmousedown = function(e) {
        // 颜色改变提醒
        resize.style.background = "#ccc";
        let startX = e.clientX;
        resize.left = resize.offsetLeft;
        document.onmousemove = function(e) {
          // 计算并应用位移量
          let endX = e.clientX;
          let moveLen = endX - startX;
          startX = endX;
          data.asideWidth += moveLen;
        };
        document.onmouseup = function() {
          // 颜色恢复
          resize.style.background = "";
          document.onmousemove = null;
          document.onmouseup = null;
        };
        return false;
      };
    },
    searchNote(queryString) {
      if (queryString)
        this.searchNotes = this.notes.filter((note) => {
          return (
            note.title.toLowerCase().indexOf(queryString.toLowerCase()) >= 0
          );
        });
      else this.searchNotes = this.notes;
    },
    /**
     * 获取用户笔记（除更新所有笔记外，其他场景不影响未保存笔记）
     * @param {Int} type 操作场景--1:修改笔记; 2：新增笔记; default: 更新所有笔记
     */
    getNote(type) {
      this.$http.get("user/findNotebookList").then((res) => {
        res.reverse();
        switch (type) {
          case 1:
            let { title, content, updateTime } = res.filter((item) => {
              return item.id === this.note.id;
            })[0];
            this.note.title = title;
            this.note.content = content;
            this.note.updateTime = updateTime;
            break;
          case 2:
            this.note = res[0];
            this.searchNotes.unshift(this.note);
            break;
          default:
            this.notes = res;
            this.searchNotes = this.notes;
            this.note = this.notes[0] || null;
            break;
        }
      });
    },
    // 新建笔记
    handleAdd() {
      this.note = {
        title: "标题",
        content: "",
        sort: this.notes.length,
      };
      this.handleSave();
    },
    // 保存笔记
    handleSave(isSave) {
      this.$http.post("user/saveNotebook", this.note).then((res) => {
        if (isSave) {
          this.$message({
            message: "保存成功",
            type: "success",
          });
        }
        let type = isSave ? 1 : 2;
        this.getNote(type);
      });
    },
    // 删除笔记
    handleDelete(id) {
      if (id) {
        var formData = new FormData();
        formData.append("id", id);
        this.$http.post("user/delNotebook", formData).then((res) => {
          this.searchNotes.splice(
            this.searchNotes.findIndex((item) => {
              return item.id === id;
            }),
            1
          );
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.note = this.searchNotes[0] || null;
        });
      }
    },
    // 显示笔记内容
    showNote(noteid) {
      if (noteid) {
        this.isDestroy = true;
        this.note = this.searchNotes.filter((item) => {
          return item.id === noteid;
        })[0];
        this.$nextTick(() => {
          this.isDestroy = false;
        });
      }
    },
    // 拖拽笔记
    onDrag(e) {
      var sizeIndex = this.searchNotes.length - 1;
      var formData = new FormData();
      formData.append("id", e.item.dataset.id);
      formData.append("oldIndex", sizeIndex - e.oldIndex);
      formData.append("newIndex ", sizeIndex - e.item.dataset.index);
      this.$http.post("/user/updateNotebookIndex", formData).then((res) => {});
    },
  },
  mounted() {
    this.dragControllerDiv();
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
  position: relative;
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
  .note-item {
    padding: 0.05rem 0.15rem;
    margin-bottom: 1px;
    font-size: 0;
    line-height: 1.5;
    background-color: #fff;
    position: relative;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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
  height: calc(100% - 1rem) !important;
  .tox-edit-area__iframe {
    background-color: transparent;
  }
}
.note-edit {
  width: 100%;
  height: 100%;
}
.note-desc {
  font-size: 0.5rem;
  text-align: center;
  color: #74c0ef;
  position: relative;
  top: 40%;
  transform: translateY(-50%);
  cursor: pointer;
}
.ghost {
  border: 1px solid #74c0ef;
}
</style>
