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
        <div class="gang">|</div>
        <div class="item">
          <a href="Music">听一听</a>
        </div>
        <!-- <div class="gang">|</div>
        <div class="item">
          <a href="v">看一看</a>
        </div> -->
        <div class="gang">|</div>
        <div class="item">
          <a href="GoddessLetter">给女神订阅日记</a>
        </div>
        <div class="gang">|</div>
        <div class="item">
          <a id="goOtherWeb" @click="goOtherWeb">随机沙雕网站</a>
        </div>
        <div class="item" style="visibility: hidden;">菜单6</div>
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
  data() {
    return {
      sitesList: [
        "http://heeeeeeeey.com/",
        "http://corndog.io/",
        "https://alwaysjudgeabookbyitscover.com",
        "http://thatsthefinger.com/",
        "http://cant-not-tweet-this.com/",
        "http://weirdorconfusing.com/",
        "http://eelslap.com/",
        "http://www.staggeringbeauty.com/",
        "http://burymewithmymoney.com/",
        "https://smashthewalls.com/",
        "http://endless.horse/",
        "http://www.trypap.com/",
        "http://www.republiquedesmangues.fr/",
        "http://www.movenowthinklater.com/",
        "http://www.partridgegetslucky.com/",
        "http://www.rrrgggbbb.com/",
        "http://beesbeesbees.com/",
        "http://www.koalastothemax.com/",
        "http://www.everydayim.com/",
        "http://randomcolour.com/",
        "http://cat-bounce.com/",
        "http://chrismckenzie.com/",
        "https://thezen.zone/",
        "http://hasthelargehadroncolliderdestroyedtheworldyet.com/",
        "http://ninjaflex.com/",
        "http://ihasabucket.com/",
        "http://corndogoncorndog.com/",
        "http://www.hackertyper.com/",
        "https://pointerpointer.com",
        "http://imaninja.com/",
        "http://drawing.garden/",
        "http://www.ismycomputeron.com/",
        "http://www.nullingthevoid.com/",
        "http://www.muchbetterthanthis.com/",
        "http://www.yesnoif.com/",
        "http://lacquerlacquer.com",
        "http://potatoortomato.com/",
        "http://iamawesome.com/",
        "https://strobe.cool/",
        "http://www.pleaselike.com/",
        "http://crouton.net/",
        "http://corgiorgy.com/",
        "http://www.wutdafuk.com/",
        "http://unicodesnowmanforyou.com/",
        "http://www.crossdivisions.com/",
        "http://tencents.info/",
        "http://www.patience-is-a-virtue.org/",
        "http://pixelsfighting.com/",
        "http://isitwhite.com/",
        "https://existentialcrisis.com/",
        "http://onemillionlols.com/",
        "http://www.omfgdogs.com/",
        "http://oct82.com/",
        "http://chihuahuaspin.com/",
        "http://www.blankwindows.com/",
        "http://dogs.are.the.most.moe/",
        "http://tunnelsnakes.com/",
        "http://www.trashloop.com/",
        "http://www.ascii-middle-finger.com/",
        "http://spaceis.cool/",
        "http://www.donothingfor2minutes.com/",
        "http://buildshruggie.com/",
        "http://buzzybuzz.biz/",
        "http://yeahlemons.com/",
        "http://wowenwilsonquiz.com",
        "https://thepigeon.org/",
        "http://notdayoftheweek.com/",
        "http://www.amialright.com/",
        "http://nooooooooooooooo.com/",
        "https://greatbignothing.com/",
        "https://zoomquilt.org/",
        "https://dadlaughbutton.com/",
        "https://www.bouncingdvdlogo.com/",
      ],
    };
  },
  created() {
    this.open();
  },
  methods: {
    open() {
      if (window.location.host == "139.196.199.233") {
        this.$alert(
          "<strong>139.196.199.233 即将暂停使用, 请更换域名</strong><div>本站地址永久更新到<a href='https://wangpinpin.com'>https://wangpinpin.com</a></div>",
          "",
          {
            dangerouslyUseHTMLString: true,
            customClass: "width9",
          }
        );
      }
    },
    goOtherWeb() {
      const random = Math.ceil(Math.random() * (this.sitesList.length + 1)) - 1;
      window.open(this.sitesList[random], "_blank");
    },
  },
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
  font-size: 0.18rem;
  position: relative;
  z-index: 999;
  .item:hover {
    color: #7c96b1;
  }
  .left {
    width: 10%;
    font-size: 0.2rem;
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
@media screen and (max-width: 900px) {
  .container {
    .left {
      font-size: 0.22rem;
    }
    .right {
      font-size: 0.22rem;
      width: 60%;
      margin-top: 5%;
      flex-wrap: wrap;
    }
  }
}
</style>
