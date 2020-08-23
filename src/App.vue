<template>
  <div id="app">
    <div id="nav">
      <router-link to="/"></router-link>
    </div>
    <!-- <router-view v-wechat-title="$route.meta.title"></router-view> -->
    <router-view />
  </div>
</template>

<style lang="less">
@import "./assets/fonts/PingFangR/PingFangR.css";
@import "./assets/css/global.css";
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  #app {
    width: 100%;
    height: 100%;
    font-family: "PingFangSC-Regular", "Helvetica Neue", Helvetica,
      "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial,
      sans-serif;
    background-image: linear-gradient(
      to top,
      #f3e7e9 0%,
      #e3eeff 99%,
      #e3eeff 100%
    );
  }
}
</style>
