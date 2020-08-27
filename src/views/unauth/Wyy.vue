<template>
  <div class="container">
    <Header />
    <iframe
      src="https://wyy.wangpinpin.com"
      frameborder="0"
      width="100%"
      height="100%"
      class="iframe"
      ref="iframe"
    ></iframe>

    <Footer />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "Wyy",
  components: {
    Header,
    Footer,
  },
  data() {
    return {};
  },
  created() {},
  mounted() {
  },
  methods: {
  },
};
</script>
<style lang="less" scoped>
  .container {
    height: 100%;
    width: 100%;
    .iframe {
      height: 70%;
    }
  }

</style>
