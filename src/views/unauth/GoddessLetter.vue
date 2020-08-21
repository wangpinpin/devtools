<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>

    <div class="content">
      <div class="notice">
        <h4>即将上线给女神订阅日记功能</h4>
        每天自动给女神发一篇日记, 打败女神其他99%舔狗, 让你赢在起跑线。 奥利给！
      </div>
    </div>
    <Footer />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "GoddessLetter",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      title: "给女神的信",
    };
  },
  created() {},

  methods: {},
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
  }

  .content {
    margin: 10% auto;
    text-align: center;
    .notice {
      font-size: .20rem;
    }
  }
}
@media screen and (max-width: 900px) {
}
</style>
