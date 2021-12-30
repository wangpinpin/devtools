<template>
  <div class="container">
    <Header />
    <div id="large-header" class="large-header" @mousemove.prevent="mouseMove">
      <canvas
        id="demo-canvas"
        :width="clientWidth"
        :height="clientHeight"
      ></canvas>
      <div class="slogan">
        <!-- title -->
        <h1 class="main-title">
          {{ title }}<span class="inputText">{{ inputText }}</span>
        </h1>
        <div class="sub-title">网站每周更新功能, 欢迎收藏关注转发</div>
        <div class="sub-title">
          代码已在github开源
          <a
            href="https://github.com/wangpinpin/devtools-server"
            target="_blank"
            >点击这里</a
          >
        </div>
      </div>
    </div>
    <Footer />
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
      title: "本站已上线",
      clientWidth: window.innerWidth,
      clientHeight: window.innerHeight,
      target: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      points: [],
      inputText: "",
    };
  },
  mounted() {
    window.onresize = this.resize;
  },
  created() {
    this.title = this.title + this.getDay() + "天";
    this.inputAnimation();
    // Main
    this.$nextTick(() => {
      this.initHeader();
      this.initAnimation();
    });
  },
  methods: {
    //获取天数
    getDay() {
      let s1 = "2020-08-01";
      s1 = new Date(s1.replace(/-/g, "/"));
      const s2 = new Date();
      const days = s2.getTime() - s1.getTime();
      return parseInt(days / (1000 * 60 * 60 * 24));
    },
    //模拟鼠标光标动画
    inputAnimation() {
      const _this = this;
      setInterval(function() {
        const inputText = "|";
        if (_this.inputText == inputText) {
          _this.inputText = "";
        } else {
          _this.inputText += inputText;
        }
      }, 800);
    },
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

.slogan {
  position: absolute;
  margin: 0;
  padding: 0;
  color: #f9f1e9;
  text-align: center;
  top: 25%;
  left: 0;
  right: 0;
  a {
    color: #74c0ef;
  }
  .main-title {
    display: inline-block;
    font-size: 0.48rem;
    letter-spacing: 0.1em;
    margin: 0;
    position: relative;
    .inputText {
      position: absolute;
      right: -0.2rem;
      top: -0.03rem;
    }
  }
  .sub-title {
    margin-top: 0.2rem;
    font-size: 0.16rem;
    line-height: 0.3rem;
  }
}
/deep/.header-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}

@media only screen and (max-width: 768px) {
  .main-title {
    font-size: 3em;
  }
}
</style>
