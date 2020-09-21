<template>
  <div class="container">
    <Header />
    <div class="content"><img src="@/assets/logo.png" /></div>
    <Footer class="footer" />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

let that;
export default {
  name: "Cancel",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      id: "",
      cancel: false,
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.open();
  },

  methods: {
    open() {
      const that = this;
      let cancel = false;
      this.$confirm("您是否要取消别人为你订阅的每日日记", "确认信息", {
        closeOnPressEscape: false,
        closeOnClickModal: false,
        showClose: false,
        customClass: 'width9',
        confirmButtonText: "继续订阅",
        cancelButtonText: "取消订阅",
      })
        .then(() => {
          that.cancel = false;
          that.cancelSubscribe();
        })
        .catch((action) => {
          that.cancel = true;
          that.cancelSubscribe();
        });
    },
    //继续or取消订阅
    cancelSubscribe() {
      var formData = new FormData();
      formData.append("id", this.id);
      formData.append("cancel", this.cancel);
      this.$http.post("unAuth/cancelSubscribe", formData).then((res) => {});
      this.$message({
        type: "success",
        message: this.cancel ? "取消订阅成功" : "订阅成功",
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
  }
  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80%;
    width: 100%;
  }
}
</style>
