<template>
  <div class="container">
    <div id="large-header" class="large-header" @mousemove.prevent="mouseMove">
      <canvas
        id="demo-canvas"
        :width="clientWidth"
        :height="clientHeight"
      ></canvas>
      <h1 class="main-title">{{ title }}</h1>
    </div>
    <ul class="menu">
      <li v-for="(item, index) in devText" :key="index">
        <a :href="item.path">{{ item.text }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import TweenLite from "gsap";
let ctx = null;
function Circle(pos, rad, color) {
  var _this = this;
  _this.pos = pos || null;
  _this.radius = rad || null;
  _this.color = color || null;
  this.draw = function() {
    if (!_this.active) return;
    ctx.beginPath();
    ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "rgba(156,217,249," + _this.active + ")";
    ctx.fill();
  };
}

export default {
  name: "Home",
  components: {
    Header,
    Footer,
    "remote-js": {
      render(createElement) {
        return createElement("script", {
          attrs: { type: "text/javascript", src: this.src },
        });
      },
      props: {
        src: { type: String, required: true },
      },
    },
  },
  data() {
    return {
      title: "小破站",
      clientWidth: window.innerWidth,
      clientHeight: window.innerHeight,
      target: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      points: [],
      inputText: "",
      devBackgroundFamily: [],
      devText: [
        { path: "/DoglickingDiary", text: "舔狗日记" },
        { path: "/MessageBoard", text: "留言板" },
        { path: "/Note", text: "舔狗笔记" },
        {
          path: "/category",
          text: "影音图文",
          children: [
            { path: "/v", text: "看一看" },
            { path: "/Music", text: "听一听" },
            { path: "/wallpaper", text: "必应壁纸" },
            { path: "/EveryDayText", text: "每日一文" },
            { path: "/Wyy", text: "网易云音乐API" },
          ],
        },
        {
          path: "/category",
          text: "摸鱼游戏",
          children: [
            {
              poster: require("@/assets/imgs/games/adarkhome.jpeg"),
              text: "小黑屋",
              path: "/adarkroom",
            },
            {
              poster: require("@/assets/imgs/games/saolei.jpeg"),
              text: "扫雷",
              path: "/saolei",
            },
            {
              poster: require("@/assets/imgs/games/jigsaws.jpg"),
              text: "拼图",
              path: "/jigsaws",
            },
          ],
        },
        {
          path: "/category",
          text: "工具合集",
          children: [
            { path: "/Filetransfer", text: "小破传" },
            { path: "/QRcodeCreate", text: "二维码生成" },
            { path: "/ImageToTxt", text: "图片文字提取" },
            { path: "/JsonFormat", text: "JSON格式化" },
            { path: "/TimeFormat", text: "时间戳转换" },
            { path: "/Base64", text: "图片转Base64" },
            { path: "/ColorTransfer", text: "颜色代码转换" },
            { path: "/PreviewFont", text: "字体预览" },
          ],
        },
        // { path: "/", text: "正在开发" },
      ],
    };
  },
  mounted() {
    window.onresize = this.resize;
  },
  created() {
    // Main
    this.$nextTick(() => {
      this.initHeader();
      this.initAnimation();
    });
  },
  methods: {
    initHeader() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const canvas = document.getElementById("demo-canvas");
      ctx = canvas.getContext("2d");

      // create points
      this.points = [];
      for (var x = 0; x < width; x = x + width / 20) {
        for (var y = 0; y < height; y = y + height / 20) {
          var px = x + (Math.random() * width) / 20;
          var py = y + (Math.random() * height) / 20;
          var p = { x: px, originX: px, y: py, originY: py };
          this.points.push(p);
        }
      }

      // for each point find the 5 closest points
      for (var i = 0; i < this.points.length; i++) {
        var closest = [];
        var p1 = this.points[i];
        for (var j = 0; j < this.points.length; j++) {
          var p2 = this.points[j];
          if (!(p1 == p2)) {
            var placed = false;
            for (var k = 0; k < 5; k++) {
              if (!placed) {
                if (closest[k] == undefined) {
                  closest[k] = p2;
                  placed = true;
                }
              }
            }

            for (var k = 0; k < 5; k++) {
              if (!placed) {
                if (
                  this.getDistance(p1, p2) < this.getDistance(p1, closest[k])
                ) {
                  closest[k] = p2;
                  placed = true;
                }
              }
            }
          }
        }
        p1.closest = closest;
      }

      // assign a circle to each point
      for (var i in this.points) {
        var c = new Circle(
          this.points[i],
          2 + Math.random() * 2,
          "rgba(255,255,255,0.3)"
        );
        this.points[i].circle = c;
      }
    },

    mouseMove(e) {
      if ("ontouchstart" in window) return;
      let posx = 0;
      let posy = 0;
      if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
      } else if (e.clientX || e.clientY) {
        posx =
          e.clientX +
          document.body.scrollLeft +
          document.documentElement.scrollLeft;
        posy =
          e.clientY +
          document.body.scrollTop +
          document.documentElement.scrollTop;
      }
      this.target.x = posx;
      this.target.y = posy;
    },

    resize() {
      this.clientWidth = window.innerWidth;
      this.clientHeight = window.innerHeight;
    },

    // animation
    initAnimation() {
      this.animate();
      for (var i in this.points) {
        this.shiftPoint(this.points[i]);
      }
    },

    animate() {
      ctx.clearRect(0, 0, this.clientWidth, this.clientHeight);
      for (var i in this.points) {
        // detect points in range
        if (Math.abs(this.getDistance(this.target, this.points[i])) < 4000) {
          this.points[i].active = 0.3;
          this.points[i].circle.active = 0.6;
        } else if (
          Math.abs(this.getDistance(this.target, this.points[i])) < 20000
        ) {
          this.points[i].active = 0.1;
          this.points[i].circle.active = 0.3;
        } else if (
          Math.abs(this.getDistance(this.target, this.points[i])) < 40000
        ) {
          this.points[i].active = 0.02;
          this.points[i].circle.active = 0.1;
        } else {
          this.points[i].active = 0;
          this.points[i].circle.active = 0;
        }

        this.drawLines(this.points[i]);
        this.points[i].circle.draw();
      }
      requestAnimationFrame(this.animate);
    },

    shiftPoint(p) {
      let _this = this;
      TweenLite.to(p, 1 + 1 * Math.random(), {
        x: p.originX - 50 + Math.random() * 100,
        y: p.originY - 50 + Math.random() * 100,
        // ease: Circ.easeInOut,
        onComplete: function() {
          _this.shiftPoint(p);
        },
      });
    },

    // Canvas manipulation
    drawLines(p) {
      if (!p.active) return;
      for (var i in p.closest) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.closest[i].x, p.closest[i].y);
        ctx.strokeStyle = "rgba(156,217,249," + p.active + ")";
        ctx.stroke();
      }
    },

    // Util
    getDistance(p1, p2) {
      return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    },
  },
};
</script>

<style scoped lang="less">
.container {
  height: 100%;
  font-size: 20px;
  .menu {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 2%;
    z-index: 1;
    list-style: none;
    padding: 0;
    li {
      margin: 0.2rem 0;
      font-size: 0.26rem;
      line-height: 2;
    }
    a {
      display: block;
      color: #fff;
      width: 6em;
      text-align: center;
      background-color: rgba(255, 255, 255, 0.27);
      transition: all 0.5s ease;
      position: relative;
      &::before,
      &::after {
        content: "";
        display: block;
        position: absolute;
        transition: all 0.2s ease-in-out;
        width: 0;
        height: 1px;
        background-color: #fff;
      }
      &::before {
        top: 0;
        left: 0;
      }
      &::after {
        bottom: 0;
        right: 0;
      }
      &:hover {
        text-shadow: 0 0 0.1rem rgba(255, 255, 255, 1),
          0 0 0.5rem rgba(255, 255, 255, 0.8),
          0 0 0.75rem rgba(255, 255, 255, 0.6),
          0 0 0.76rem rgba(255, 255, 255, 0.4),
          0 0 0.77rem rgba(255, 255, 255, 0.5),
          0 0 0.78rem rgba(255, 255, 255, 0.4),
          0 0 0.79rem rgba(255, 255, 255, 0.3),
          0 0 0.8rem rgba(255, 255, 255, 0.2),
          0 0 0.85rem rgba(255, 255, 255, 0.1);
        &::before,
        &::after {
          width: 100%;
        }
      }
    }
  }
}
/* Header */
.large-header {
  position: relative;
  width: 100%;
  height: 100%;
  background: #333;
  overflow: hidden;
  background-size: cover;
  background-position: center center;
  z-index: 1;
  background-image: url("../assets/imgs/home-bg.jpg");
}

.main-title {
  position: absolute;
  margin: 0;
  padding: 0;
  color: #f9f1e9;
  text-align: center;
  top: 25%;
  left: 0;
  right: 0;
  text-transform: uppercase;
  font-size: 4.2em;
  letter-spacing: 0.1em;
}

@media only screen and (max-width: 768px) {
  .main-title {
    font-size: 3em;
  }
}
</style>
