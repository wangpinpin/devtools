<template>
  <div>
    <div class="container">
      <div class="left">
        <div class="item">菜单</div>
      </div>
      <div class="right">
        <div class="item">菜单1</div>
        <div class="item">菜单2</div>
        <div class="item">菜单3</div>
        <div class="item">菜单4</div>
        <div class="item">菜单5</div>
        <div class="item">菜单6</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: {
    msg: String,
  },
};
</script>

<style scoped lang="less">
.container {
  width: 100%;
  height: 120px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #efefef;
  font-size: 18px;
  .item:hover {
    color: #fff;
  }
  .left {
    width: 10%;
    font-size: 20px;
    font-weight: bold;
    .item {
      cursor: pointer;
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
  }
}
@media screen and (max-width: 900px) {
  .container {
    padding-top: 0.5rem;
    font-size: 40px;
  }
  .container .left {
    font-size: 40px;
  }
  .container .right {
    width: 56%;
  }
}
</style>
