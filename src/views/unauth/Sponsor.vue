<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>
    <div class="sub-tilte">
      <p>如果您也对本站有兴趣, 可为本站投食</p>
      <p>本站所有赞助将用于服务建设</p>
      <p>赞助时请留下邮箱手机号或姓名便于登记反馈</p>
    </div>
    <div class="content">
      <div class="ali">
        <img src="@/assets/imgs/ali.jpg" />
      </div>
      <div class="wx"><img src="@/assets/imgs/wx.jpg" /></div>
    </div>
    <Footer class="footer" />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "Sponsor",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      title: "赞助本站",
    };
  },
  created() {},

  methods: {},
};
</script>
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

  .title {
    font-size: 0.4rem;
    color: #7c96b1;
    text-align: center;
  }
  .sub-tilte {
    margin-top: 0.1rem;
    font-size: 0.2rem;
    text-align: center;
    color: #7c96b1;
  }
  .content {
    width: 800px;
    height: 500px;
    margin: 3% auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .ali {
      width: 45%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .wx {
      width: 45%;
      img {
        width: 100%;
        height: 100%;
      }
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
    min-height: 100%;
    .sub-tilte {
      margin-top: 0.1rem;
      font-size: 0.2rem;
      color: #7c96b1;
      padding: 0.2rem;
    }
    .content {
      flex-direction: column;
      width: 100%;
      height: unset;
      .ali {
        width: 80%;
        margin: 0 auto;
      }
      .wx {
        margin-top: 0.2rem;
        width: 80%;
        margin: 0 auto;
      }
    }
  }
}
</style>
