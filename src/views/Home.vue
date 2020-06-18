<template>
  <div class="home">
    <Header />

    <div class="container">
      <el-button>默认按钮</el-button>
    </div>

    <Footer />
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "Home",
  components: {
    Header,
    Footer
  }
};
</script>
