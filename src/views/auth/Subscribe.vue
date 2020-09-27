<template>
  <div class="container">
    <Header />
    <!-- <h3 class="title">{{ title }}</h3> -->
    <div class="content">
      <el-popover placement="right" trigger="click">
        <div class="QAwrap">
          <h3 class="QAtitle">{{ title }}</h3>
          <h4>卡片状态解释说明</h4>
          <ul>
            <li>
              已启用：每天为女神投送日记，点击女神卡片右上角<span
                class="iconfont"
                >&#xe640;</span
              >可切换禁用状态；
            </li>
            <li>
              已禁用：女神日记暂停投送，点击女神卡片右上角<span class="iconfont"
                >&#xe6b0;</span
              >可切换启用状态；
            </li>
            <li>取消订阅：女神主动关闭了您的订阅，无法继续为女神投送日记。</li>
          </ul>
        </div>
        <i slot="reference" class="iconfont iconQA">&#xe630;</i>
      </el-popover>
      <div class="subscribeWrap">
        <happy-scroll
          color="rgba(0,0,0,0.2)"
          size="3"
          :hide-horizontal="true"
          resize
        >
          <ul class="list" v-show="!loading">
            <li v-for="(item, index) in subscribeList" :key="item.id">
              <div
                class="delete"
                @click.stop="
                  dialogVisible = true;
                  deleteId = item.id;
                "
              >
                <i class="iconfont">&#xe60a;</i>
              </div>
              <div class="goddessImg">
                <img class src="@/assets/imgs/goddess.jpg" alt />
              </div>
              <div class="cardInfo">
                <p class="godNickName">{{ item.godNickName }}</p>
                <p class="count">已送达{{ item.count }}封</p>
              </div>
              <div class="hovershow">
                <p>订阅内容：{{ item.activityName | transferName }}</p>
                <p>发送时间：每天{{ item.hour }}点</p>
              </div>
              <p
                class="edit"
                v-text="item.cancel ? '查 看' : '编 辑'"
                @click.stop="handleEdit($event)"
                :data-index="index"
              ></p>
              <div class="tagContainer">
                <p
                  :class="{
                    tag: true,
                    tagCancel: item.cancel,
                    tagEnabled: !item.cancel && item.enabled ? true : false,
                  }"
                >
                  {{ getStatus(index) }}
                </p>
                <ul class="statusTag" v-if="!item.cancel">
                  <li
                    class="enabledTag"
                    @click.stop="changeStatus(index, true)"
                    title="启用"
                  >
                    <span class="iconfont">&#xe6b0;</span>
                  </li>
                  <li
                    class="disaabledTag"
                    @click.stop="changeStatus(index, false)"
                    title="禁用"
                  >
                    <span class="iconfont">&#xe640;</span>
                  </li>
                </ul>
              </div>
            </li>
            <li @click="handleAdd" class="add">
              <i class="iconfont iconAdd" title="添加订阅">&#xe62e;</i>
            </li>
          </ul>
        </happy-scroll>
      </div>
      <div class="loading" v-show="loading">
        <img src="@/assets/imgs/loading.gif" />
      </div>
    </div>
    <div v-show="showPopAdd" class="pop">
      <i class="iconfont iconClose" @click="showPopAdd = false">&#xe607;</i>
      <el-form
        :model="popForm"
        label-width="1.4rem"
        ref="popForm"
        class="demo-ruleForm"
      >
        <el-form-item
          label="女神昵称"
          prop="godNickName"
          :rules="[
            {
              required: true,
              message: '请输入女神昵称',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            style="width: 4rem;"
            v-model="popForm.godNickName"
            autocomplete="off"
            prefix-icon="el-icon-goddess"
          ></el-input>
        </el-form-item>
        <el-form-item label="你的昵称" prop="nickName">
          <el-input
            style="width: 2.9rem;"
            v-model="popForm.nickName"
            autocomplete="off"
            prefix-icon="el-icon-dog"
            :disabled="popForm.isAnonymous"
          ></el-input>
          <el-checkbox v-model="popForm.isAnonymous" class="checkAnonymous"
            >匿名</el-checkbox
          >
        </el-form-item>
        <el-form-item
          label="订阅内容"
          prop="activityName"
          :rules="[
            {
              type: 'array',
              required: true,
              message: '请至少选择一个订阅内容',
              trigger: 'change',
            },
          ]"
        >
          <el-checkbox-group v-model="popForm.activityName">
            <el-checkbox
              v-for="item in activityList"
              :key="item.id"
              :label="item.name"
              :disabled="!item.enabled"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="发送时间"
          prop="sendTime"
          :rules="[{ required: true, message: '请选择日期', trigger: 'blur' }]"
        >
          <el-time-select
            v-model="popForm.sendTime"
            style="width: 4rem;"
            :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '23:00',
            }"
            placeholder="选择时间"
          ></el-time-select>
        </el-form-item>
        <el-form-item
          label="女神邮箱"
          prop="email"
          :rules="[
            {
              required: true,
              message: '请输入邮箱地址',
              trigger: 'blur',
            },
            {
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur', 'change'],
            },
          ]"
        >
          <el-input
            v-model="popForm.email"
            @keyup.enter.native="submitpopForm('popForm')"
            style="width: 4rem;"
            prefix-icon="el-icon-email"
          ></el-input>
        </el-form-item>
        <el-form-item class="formItemBtn">
          <el-button
            v-if="!popForm.cancel"
            class="submitBtn"
            type="success"
            @click="submitpopForm('popForm')"
            >{{ popForm.submitBtnText }}</el-button
          >
          <!-- <el-button
            v-if="!popForm.nowAdd"
            class="submitBtn"
            type="danger"
            @click="dialogVisible = true"
            >删 除</el-button
          > -->
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      class="popDialog"
    >
      <span>删除后无法恢复，是否确认删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delSubscribe">确 定</el-button>
      </span>
    </el-dialog>
    <Footer class="footer" />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

let that;
export default {
  name: "Subscribe",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      title: "做舔狗嘛 最重要的是陪伴",
      loading: true,
      showPopAdd: false,
      subscribeList: {},
      activityList: {},
      dialogVisible: false,
      deleteId: "",
      popForm: {
        id: "",
        email: "",
        godNickName: "",
        nickName: "",
        isAnonymous: true,
        activityName: [],
        sendTime: "",
        enabled: true,
        cancel: false,
        nowAdd: true,
      },
    };
  },
  created() {
    this.getSubscribe();
    this.getActivityName();
  },
  computed: {
    getStatus() {
      return (index) => {
        let cancel = this.subscribeList[index].cancel;
        let enabled = this.subscribeList[index].enabled;
        return cancel ? "取消订阅" : enabled ? "已启用" : "已禁用";
      };
    },
  },
  filters: {
    transferName(value) {
      let text = "";
      if (typeof value !== "object" || value.length == 0) return text;
      value.forEach((element, index) => {
        text =
          index == value.length - 1 ? text + element : text + element + "、";
      });
      return text;
    },
  },
  methods: {
    // 清空订阅信息表单
    clearForm() {
      this.popForm = {
        id: "",
        email: "",
        godNickName: "",
        nickName: "",
        isAnonymous: true,
        activityName: [],
        sendTime: "",
        submitBtnText: "新 增",
        enabled: true,
        cancel: false,
        nowAdd: true,
      };
    },
    // 获取订阅列表
    getSubscribe() {
      this.$http.get("user/findSubscribe").then((res) => {
        this.subscribeList = res;
        if (!this.showPopAdd) this.loading = false;
      });
    },
    handleEdit(e) {
      let index = e.currentTarget.dataset.index;
      let curObj = this.subscribeList[index];
      this.popForm = {
        id: curObj.id,
        email: curObj.email,
        godNickName: curObj.godNickName,
        nickName: curObj.nickName,
        isAnonymous: !Boolean(curObj.nickName),
        activityName: curObj.activityName,
        sendTime: this.hourToTime(curObj.hour),
        submitBtnText: "保 存",
        enabled: curObj.enabled,
        cancel: curObj.cancel,
        nowAdd: false,
      };
      this.showPopAdd = true;
    },
    handleAdd() {
      this.clearForm();
      this.showPopAdd = true;
    },
    // 切换启用/禁用状态
    changeStatus(index, status) {
      let curObj = this.subscribeList[index];
      let statusText = status ? "启用" : "禁用";
      if (curObj.enabled == status) {
        this.$message({
          message: "当前已是" + statusText + "状态",
          type: "warning",
        });
      } else {
        let params = new FormData();
        params.append("id", curObj.id);
        params.append("enabled", status);
        this.$http.post("user/enabledSubscribe", params).then((res) => {
          this.$message({
            message: statusText + "成功",
            type: "success",
          });
          this.subscribeList[index].enabled = status;
        });
      }
    },
    // 获取订阅内容：日记、天气、星座运势
    getActivityName() {
      this.$http.get("user/findActivityList").then((res) => {
        this.activityList = res;
        res.forEach((element) => {
          if (element.enabled) this.popForm.activityName.push(element.name);
        });
      });
    },
    // 时间转换为小时为单位
    timeToHour(time) {
      let hour = 0;
      if (time) {
        let preHour = time.split(":")[0];
        hour = preHour[0] == "0" ? preHour[1] : preHour;
      }
      return parseInt(hour);
    },
    // 小时转换为时间
    hourToTime(hour) {
      let time = "";
      if (hour >= 0) {
        time = hour < 10 ? "0" + hour + ":00" : hour + ":00";
      }
      return time;
    },
    //提交新增订阅表单
    submitpopForm(formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            activityName: this.popForm.activityName,
            email: this.popForm.email,
            enabled: true,
            godNickName: this.popForm.godNickName,
            hour: this.timeToHour(this.popForm.sendTime),
            nickName: this.popForm.isAnonymous ? "" : this.popForm.nickName,
            id: this.popForm.id,
          };
          that.$http.post("user/addSubscribe", params).then((res) => {
            if (this.popForm.submitBtnText == "保 存") {
              this.$message({
                message: "保存成功",
                type: "success",
              });
              this.getSubscribe();
            } else {
              this.$message({
                message: "订阅成功",
                type: "success",
              });
              this.clearForm();
              this.getSubscribe();
            }
            this.showPopAdd = false;
          });
        } else {
          return false;
        }
      });
    },
    // 删除订阅
    delSubscribe() {
      this.dialogVisible = true;
      var formData = new FormData();
      formData.append("id", this.deleteId);
      this.$http.post("user/delSubscribe", formData).then((res) => {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.dialogVisible = false;
        this.showPopAdd = false;
        this.getSubscribe();
      });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  /deep/.el-input__inner {
    background: unset;
    font-size: 0.2rem;
  }
  .title {
    font-size: 0.3rem;
    line-height: 2;
    text-align: center;
    margin: 0.5em 0;
    color: #7c96b1;
  }
  p {
    margin: 0;
  }
  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80%;
    width: 100%;
    .subscribeWrap {
      width: 100%;
      height: 100%;
      /deep/.happy-scroll-container {
        width: 100% !important;
        height: 100% !important;
        display: flex;
        align-items: center;
        justify-content: center;
        .happy-scroll-content {
          width: 80%;
        }
      }
    }
    .list {
      list-style: none;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 0;
      padding: 0;
      width: 100%;
      flex-wrap: wrap;
      margin: 0 auto;
      li {
        background-color: #fff;
        width: 3rem;
        height: 3rem;
        border-radius: 0.2rem;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        margin: 0.2rem 0.42rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
        color: #7c96b1;
        font-size: 0.24rem;
        position: relative;
        overflow: hidden;
        .delete {
          position: absolute;
          z-index: 9;
          left: 4%;
          top: 3%;
          i {
            font-size: 0.3rem;
          }
        }
        .goddessImg {
          width: 100%;
          height: 2rem;
          overflow: hidden;
          position: relative;
          margin-bottom: 0.2rem;
          transition: all 0.3s ease;
          img {
            width: 100%;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        .cardInfo {
          text-align: center;
          width: 100%;
          .godNickName {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .count {
            font-size: 0.8em;
            color: #929292;
          }
        }
        .edit {
          position: absolute;
          bottom: -2em;
          left: 0;
          right: 0;
          text-align: center;
          background-color: #7c96b1;
          color: #fff;
          line-height: 2em;
          transition: all 0.3s ease;
        }
        .tag {
          position: absolute;
          right: -0.5rem;
          top: -0.03rem;
          width: 1.5rem;
          height: 0.6rem;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          color: #fff;
          font-size: 0.18rem;
          line-height: 2em;
          transform: rotate(45deg);
          background-color: red;
          &.tagCancel {
            background-color: #9a9696;
          }
          &.tagEnabled {
            background-color: green;
          }
        }
        .statusTag {
          padding: 0;
          transform: rotate(-90deg);
          position: absolute;
          top: 0;
          right: 0;
          transition: 0.3s;
          li {
            margin: 0;
            position: absolute;
            top: 0;
            right: 0;
            display: inline-block;
            background-color: #7c96b1;
            border-radius: 0 0 0 1rem;
            width: 1rem;
            height: 1rem;
            box-sizing: border-box;
            transform-origin: 1rem 0;
            text-align: center;
            padding-right: 0.2rem;
            span {
              font-size: 0.26rem;
              color: #fff;
              display: inline-block;
            }
          }
          .enabledTag {
            span {
              margin-top: 0.1rem;
            }
            &:hover span {
              color: green;
            }
          }
          .disaabledTag {
            transform: rotate(-45deg);
            span {
              margin-top: 0.1rem;
              transform: rotate(45deg);
            }
            &:hover span {
              color: red;
            }
          }
        }
        .hovershow {
          opacity: 0;
          transition: all 0.3s ease;
          font-size: 0.8em;
          color: #929292;
          text-align: center;
          position: absolute;
          line-height: 1.5;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          bottom: -3em;
        }
        &.add {
          justify-content: center;
          transition: all 0.2s ease;
          &:hover {
            transform: translateY(-0.05rem);
          }
        }
        &:hover {
          .edit {
            bottom: 0;
          }
          .goddessImg {
            width: 50%;
            height: 1rem;
            border-radius: 0 0 50% 50%;
          }
          .hovershow {
            opacity: 1;
            bottom: 0.5rem;
          }
          .statusTag {
            transform: rotate(0deg);
          }
        }
        .iconAdd {
          font-size: 0.8rem;
          color: #7c96b1;
        }
      }
    }
  }
  /deep/.el-icon-goddess::before {
    font-family: "iconfont";
    content: "\e609";
  }
  /deep/.el-icon-dog::before {
    font-family: "iconfont";
    content: "\e751";
  }
  /deep/.el-icon-email::before {
    font-family: "iconfont";
    content: "\e662";
  }
  .iconQA {
    font-size: 0.4rem;
    color: #7c96b1;
    cursor: pointer;
    position: fixed;
    left: 0.2rem;
    top: 20%;
    z-index: 2;
    transform-origin: bottom;
    animation: scaleQA 1s infinite;
  }
  @keyframes scaleQA {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  }
  .loading {
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
    margin: 0 auto;
    width: 20%;
    top: 50%;
    transform: translateY(-50%);
    img {
      width: 100%;
    }
  }
  .pop {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 0.2rem;
    padding: 0.6rem 0.4rem 0.2rem 0.3rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    z-index: 10;
    .iconClose {
      position: absolute;
      right: 2em;
      top: 1em;
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover {
        transform: rotate(180deg);
      }
    }
    .checkAnonymous {
      margin-left: 0.2rem;
    }
    /deep/.el-form-item__label {
      font-size: 0.2rem;
      white-space: nowrap;
    }
    /deep/.el-checkbox__label,
    /deep/.el-button {
      font-size: 0.2rem;
    }
    /deep/.el-checkbox__input {
      &.is-checked .el-checkbox__inner,
      &.is-indeterminate .el-checkbox__inner {
        background-color: #7c96b1;
        border-color: #7c96b1;
      }
      &.is-checked + .el-checkbox__label {
        color: #7c96b1;
      }
    }
  }
  .popDialog {
    font-size: 0;
  }
}
.QAwrap {
  font-size: 0.18rem;
  padding: 1em 0.2em;
  box-sizing: border-box;
  h3 {
    text-align: center;
    font-size: 0.22rem;
    margin: 0;
  }
  ul {
    margin: 0;
    padding-left: 2em;
  }
}
@media screen and (max-width: 900px) {
  /deep/.el-dialog {
    width: 80% !important;
  }
  .container {
    .content {
      .subscribeWrap {
        /deep/.happy-scroll-container {
          .happy-scroll-content {
            width: 100%;
          }
        }
      }
      .list {
        li {
          width: 2.8rem;
          margin: 0.2rem;
        }
      }
    }
    .pop {
      form {
        overflow-y: scroll;
        max-height: 66vh;
      }
    }
  }
}
</style>
