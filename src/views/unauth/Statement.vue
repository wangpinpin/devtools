<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>

    <div class="content">
      本网站所提供的信息，只供参考之用。
      本网站及其雇员一概毋须以任何方式就任何信息传递或传送的失误、不准确或错误对用户或任何其他人士负任何直接或间接的责任。
      在法律允许的范围内，本网站在此声明,不承担用户或任何人士就使用或未能使用本网站所提供的信息或任何链接或项目所引致的任何直接、间接、附带、从属、特殊、惩罚性或惩戒性的损害赔偿（包括但不限于收益、预期利润的损失或失去的业务、未实现预期的节省）。
      本网站所提供的信息，若在任何司法管辖地区供任何人士使用或分发给任何人士时会违反该司法管辖地区的法律或条例的规定或会导致本网站或其第三方代理人受限于该司法管辖地区内的任何监管规定时，则该等信息不宜在该司法管辖地区供该等任何人士使用或分发给该等任何人士。用户须自行保证不会受限于任何限制或禁止用户使用或分发本网站所提供信息的当地的规定。
      本网站图片，文字，接口信息之类版权申明，皆来自于互联网，如果侵犯，请及时通知我们，本网站将在第一时间及时删除。
      凡以任何方式登陆本网站或直接、间接使用本网站资料者，视为自愿接受本网站声明的约束。
    </div>
    <Footer class="footer" />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "Statement",
  components: {
    Header,
    Footer
  },
  data() {
    return {
      title: "免责声明"
    };
  },
  created() {},

  methods: {}
};
</script>
<style lang="less">
.container {
  .content {
    text-indent: 2em;
  }
}
</style>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;

  .title {
    font-size: 0.4rem;
    color: #7c96b1;
    text-align: center;
  }
  .content {
    font-size: 0.2rem;
    color: #3a3a3a;
    width: 62%;
    margin: .4rem auto;
    line-height: 0.4rem;
    text-align: left;
    padding-bottom: 1%;
    p {
      text-indent: 2em !important;
    }
  }
}
@media screen and (max-width: 900px) {
  .container {
    .content {
      width: 90%;
      p {
        text-indent: 2em;
      }
    }
  }
}
</style>
