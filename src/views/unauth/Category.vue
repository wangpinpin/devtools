<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>
    <div class="content">
      <ul class="card">
        <li
          class="card-item"
          v-for="(item, index) in categoryData"
          :key="index"
        >
          <a :href="item.path">
            <img :src="item.poster" alt="" />
            <span>{{ item.name }}</span>
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
      title: "",
      categoryData: [
        {
          poster: require("@/assets/imgs/games/adarkhome.jpeg"),
          name: "小黑屋",
          path: "/adarkroom",
        },
        {
          poster: require("@/assets/imgs/games/saolei.jpeg"),
          name: "扫雷",
          path: "/saolei",
        },
      ],
    };
  },
  created() {},
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
  ul.card {
    padding: 0;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    list-style: none;
    .card-item {
      margin: 0.1rem 2%;
      width: 15%;
      text-align: center;
      img {
        width: 100%;
        border-radius: 0.2rem;
        transition: all 0.3s;
      }
      a {
        display: block;
        font-size: 0.24rem;
        line-height: 1.8;
        color: #7c96b1;
      }
      &:hover {
        img {
          transform: translateY(-0.05rem);
        }
        a {
          font-weight: bolder;
        }
      }
    }
  }
}
</style>
