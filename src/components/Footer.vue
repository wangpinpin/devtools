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
  bottom: 20px;
  left: 0;
  right: 0;
  color: #efeaea;

  a {
    color: #efeaea !important;
  }
}
</style>
