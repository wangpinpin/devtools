<template>
  <div>
    <div class="container">
      <div class="left">
        <div class="item">
          <a href="/">首页</a>
        </div>
      </div>
      <div class="right">
        <div class="item">
          <a href="MessageBoard">留言板</a>
        </div>
        <!-- <div class="item">菜单2</div>
        <div class="item">菜单3</div>
        <div class="item">菜单4</div>
        <div class="item">菜单5</div>
        <div class="item">菜单6</div>-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: {
    msg: String
  }
};
</script>

<style scoped lang="less">
.container {
  width: 100%;
  height: 1.2rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #333;
  font-size: .18rem;
  .item:hover {
    color: #7c96b1;
  }
  .left {
    width: 10%;
    font-size: .2rem;
    font-weight: bold;
    .item {
      cursor: pointer;
      a {
        color: #333;
        text-decoration: none;
      }
    }
  }
  .right {
    width: 40%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    div {
      cursor: pointer;
    }
    .item {
      cursor: pointer;
      a {
        color: #333;
        text-decoration: none;
      }
    }
  }
}
// @media screen and (max-width: 900px) {
//   .container {
//     padding-top: 0.5rem;
//     font-size: 40px;
//   }
//   .container .left {
//     font-size: 40px;
//   }
//   .container .right {
//     width: 56%;
//   }
// }
</style>
