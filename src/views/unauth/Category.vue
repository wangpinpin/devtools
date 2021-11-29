<template>
  <div class="container">
    <Header />
    <div class="title">{{ $route.query.title }}</div>
    <div class="content">
      <ul class="card">
        <li class="card-item" v-for="(item, index) in category" :key="index">
          <a
            :class="item.poster ? 'poster-item' : 'bgcolor-item'"
            :href="item.path"
            :style="item.poster ? '' : devBackgroundFamily[index]"
          >
            <img v-if="item.poster" :src="item.poster" alt="" />
            <span>{{ item.text }}</span>
          </a>
        </li>
      </ul>
    </div>
    <Footer />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "Category",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      devBackgroundFamily: [],
      category: JSON.parse(localStorage.getItem("category")) || [],
    };
  },
  created() {
    document.title = this.$route.query.title;
    this.devBackgroundFamily = this.$store.state.devBackgroundFamily.splice(
      0,
      this.category.length
    );
    this.devBackgroundFamily.sort(function() {
      return Math.random() - 0.5;
    });
  },
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
    width: 80%;
    margin: 0 auto;
  }
  ul.card {
    padding: 0;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    list-style: none;
    .card-item {
      margin: 0.2rem 2%;
      width: 15%;
      text-align: center;
    }
    .poster-item {
      display: block;
      font-size: 0.24rem;
      line-height: 1.8;
      color: #7c96b1;
      img {
        width: 100%;
        border-radius: 0.2rem;
        transition: all 0.3s;
      }
      &:hover {
        font-weight: bolder;
        img {
          transform: translateY(-0.05rem);
        }
      }
    }
    .bgcolor-item {
      display: block;
      font-size: 0.24rem;
      color: #fff;
      border-radius: 0.2rem;
      line-height: 1.5rem;
      &:hover {
        box-sizing: border-box;
        border: 0.04rem solid #fff;
        line-height: 1.42rem;
      }
    }
  }
}
</style>
