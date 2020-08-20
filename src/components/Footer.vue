<template>
  <div>
    <div class="container">
      © 2020 某某品 <a href="http://www.miitbeian.gov.cn/">皖ICP备19011468号</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "Footer",
  props: {
    msg: String,
  },
};
</script>

<style scoped lang="less">
.container {
  margin: 0 auto;
  text-align: center;
  position: absolute;
  bottom: 0.2rem;
  left: 0;
  right: 0;
  color: #333;
  font-size: 0.1rem;
  a {
    color: #333 !important;
  }
}
</style>
