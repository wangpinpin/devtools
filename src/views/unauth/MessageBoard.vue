<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>

    <div class="content">
      <div class="record">
        <happy-scroll color="rgba(0,0,0,0.1)" hide-horizontal size="3">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="222.222.22.222" name="1">
              <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
              <div class="time">2020-20-20 08:01</div>
            </el-collapse-item>
            <el-collapse-item title="222.222.22.222" name="2">
              <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
            </el-collapse-item>
            <el-collapse-item title="222.222.22.222" name="3">
              <div>简化流程：设计简洁直观的操作流程；</div>
            </el-collapse-item>
            <el-collapse-item title="222.222.22.222" name="4">
              <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
            </el-collapse-item>
            <el-collapse-item title="222.222.22.222" name="5">
              <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
            </el-collapse-item>
            <el-collapse-item title="222.222.22.222" name="6">
              <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
            </el-collapse-item>
            <el-collapse-item title="222.222.22.222" name="7">
              <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
            </el-collapse-item>
            <el-collapse-item title="222.222.22.222" name="8">
              <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
            </el-collapse-item>
            <el-collapse-item title="222.222.22.222" name="9">
              <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
            </el-collapse-item>
            <el-collapse-item title="222.222.22.222" name="10">
              <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
            </el-collapse-item>
          </el-collapse>
        </happy-scroll>
      </div>
      <div class="message">
        <el-button type="primary" @click="dialogFormVisible = true">点击留言</el-button>
      </div>
      <el-dialog title="请输入留言" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="活动名称" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="form.text" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
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
      activeNames: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      dialogFormVisible: false,
      formLabelWidth: "120px",
      form: {
        text: ""
      }
    };
  },
  created() {},
  methods: {}
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
    height: 60%;
    margin: 0 auto;
    .record {
      margin-top: 20px;
      height: 100%;
      width: 100%;

      /deep/.el-collapse-item__header {
        background: unset;
        font-size: 22px !important;
      }
      /deep/.el-collapse-item__wrap {
        background: unset;
        border-bottom: 1px solid #d4e2e8;
      }
      /deep/.happy-scroll-content {
        padding-right: 20px;
        display: block;
      }
      /deep/.el-collapse-item__content {
        color: #6b6b6b;
      }
      .time {
        font-size: 12px;
        text-align: right;
        // margin-right: 40px;
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
  }
}
</style>
