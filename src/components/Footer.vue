<template>
  <div>
    <div class="container">
      <div>
        <a @click="subscription" id="subscription">公众号</a>
      </div>
      <div class="gang">|</div>
      <div>
        <a id="contactus" href="mailto:wppwangpinpin@qq.com">联系我们</a>
      </div>
      <div class="gang">|</div>
      <div><a id="Statement" href="Statement">免责声明</a></div>
      <div class="gang">|</div>
      <div><a id="sponsor" href="sponsor">赞助</a></div>
      <div class="gang">|</div>
      <div id="beian">
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
    msg: String,
  },
  methods: {
    //公众号二维码
    subscription() {
      this.$alert(
        "<strong>公众号二维码</strong><div style='text-align: center;'><img src='/subscription.jpg' /></div>",
        "",
        {
          dangerouslyUseHTMLString: true,
          customClass: "width9",
        }
      );
    },
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
  display: flex;
  flex-direction: row;
  text-align: center;
  justify-content: center;
  flex-wrap: wrap;
  div {
    margin: 0 0.1rem;
  }
  a {
    color: #333 !important;
    cursor: pointer;
  }
}
</style>
<style lang="less">
@media screen and (max-width: 900px) {
  /deep/.el-message-box {
    width: 95%;
  }
}
</style>
