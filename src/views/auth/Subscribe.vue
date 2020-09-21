<template>
  <div class="container">
    <Header />
    <div class="content">
      <ul class="list">
        <li @click="handleAdd"><i class="iconfont iconAdd">&#xe62e;</i></li>
      </ul>
    </div>
    <div v-show="showPopAdd" class="pop">
      <i class="iconfont iconClose" @click="showPopAdd = false">&#xe607;</i>
      <el-form
        :model="addForm"
        label-width="1.2rem"
        ref="addForm"
        class="demo-ruleForm"
      >
        <el-form-item label="女神昵称" prop="goddessName">
          <el-input
            style="width: 4rem;"
            v-model="addForm.goddessName"
            autocomplete="off"
            prefix-icon="el-icon-goddess"
          ></el-input>
        </el-form-item>
        <el-form-item label="你的昵称" prop="myName">
          <el-input
            style="width: 4rem;"
            v-model="addForm.myName"
            autocomplete="off"
            prefix-icon="el-icon-dog"
          ></el-input>
          <el-checkbox v-model="addForm.isAnonymous">匿名</el-checkbox>
        </el-form-item>
        <el-form-item label="订阅内容" prop="subscribeList">
          <el-checkbox-group v-model="addForm.subscribeList">
            <el-checkbox label="日记"></el-checkbox>
            <el-checkbox label="天气"></el-checkbox>
            <el-checkbox label="星座运势"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="发送时间" prop="sendTime">
          <el-time-select
            v-model="addForm.sendTime"
            style="width: 4rem;"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '23:30',
            }"
            placeholder="选择时间"
          >
          </el-time-select>
        </el-form-item>
        <el-form-item
          label="女神邮箱"
          prop="email"
          :rules="[
            {
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
            v-model="addForm.email"
            @keyup.enter.native="submitAddForm('addForm')"
            style="width: 4rem;"
            prefix-icon="el-icon-email"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="submitBtn"
            type="success"
            @click="submitaddForm('addForm')"
          >
            新 增
          </el-button>
        </el-form-item>
      </el-form>
    </div>
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
      title: "我的订阅",
      showPopAdd: false,
      addForm: {
        email: "",
        goddessName: "",
        myName: "",
        isAnonymous: true,
        subscribeList: ["天气"],
        sendTime: "",
      },
    };
  },
  created() {},
  computed: {},
  methods: {
    handleAdd() {
      this.showPopAdd = true;
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
  }
  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80%;
    width: 100%;
    .list {
      list-style: none;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;
      padding: 0;
      width: 80%;
      flex-wrap: wrap;
      li {
        background-color: #fff;
        width: 3rem;
        height: 3rem;
        border-radius: 0.2rem;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0.2rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
        &:hover {
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
  .pop {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 0.2rem;
    padding: 0.4rem 0.2rem;
    transition: all 0.3s ease;
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
  }
}
</style>
