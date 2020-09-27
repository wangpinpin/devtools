<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>
    <div class="author">作者: {{ author }}</div>

    <div class="content" v-html="content">
      <p></p>
    </div>
    <Footer class="footer" />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "EveryDayText",
  components: {
    Header,
    Footer
  },
  data() {
    return {
      title: "每日一文",
      author: "",
      content: ""
    };
  },
  created() {
    this.getEveryDayText();
  },

  methods: {
    //获取文章
    getEveryDayText() {
      this.$http.get("unAuth/getEveryDayText").then(res => {
        this.title = res.title;
        this.author = res.author;
        this.content = res.content;
      });
    }
  }
};
</script>
<style lang="less">
.container {
  .content {
    p {
      text-indent: 2em;
    }
  }
}
</style>
<style lang="less" scoped>
.container {
  width: 100%;
  min-height: 100%;
  text-align: center;
  background-image: linear-gradient(
    to top,
    #f3e7e9 0%,
    #e3eeff 99%,
    #e3eeff 100%
  );
  padding-bottom: 1%;
  box-sizing: border-box;
  .title {
    font-size: 0.4rem;
    color: #7c96b1;
    margin-top: 0.2rem;
  }
  .author {
    margin: 0.1rem 0;
    font-size: 0.2rem;
    color: black;
  }
  .scroll-content {
    width: 100%;
    height: 70vh;
    padding-bottom: 0.2rem;
    box-sizing: border-box;
    over /deep/.happy-scroll-container {
      width: 100% !important;
      height: 100% !important;
    }
  }
  .content {
    font-size: 0.2rem;
    color: #3a3a3a;
    width: 62%;
    margin: 0 auto;
    line-height: 0.4rem;
    text-align: left;
    p {
      text-indent: 2em !important;
    }
  }
  .footer {
    /deep/.container {
      position: unset;
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
