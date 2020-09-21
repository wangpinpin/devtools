<template>
  <div class="container">
    <Header />
    <div class="content"></div>
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
    return {};
  },
  created() {},

  methods: {},
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
