<template>
  <div>
    <div class="container">
      <div>
        <a href="mailto:wppwangpinpin@qq.com">联系我们</a>
      </div>
      <div class="gang">|</div>
      <div>
        © 2020
        <a href="https://beian.miit.gov.cn">皖ICP备19011468号</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Footer",
  props: {
    msg: String
  }
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
  display: flex;
  flex-direction: row;
  text-align: center;
  justify-content: center;
  div {
    margin: 0 0.1rem;
  }
  a {
    color: #333 !important;
  }
}
</style>
