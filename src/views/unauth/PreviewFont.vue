<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>
    <div class="content">
      <div class="input-item">
        <el-input
          placeholder="请输入iconfont css文件路径"
          v-model="fontlink"
        ></el-input>
        <el-button type="primary" @click="handlePreview()"
          >预览iconfont</el-button
        >
      </div>
      <div class="preview-container">
        <ul>
          <li
            v-for="(font, index) in fontArray"
            :key="index"
            :value="font.value"
            :data-index="index"
          >
            <i :class="['iconfont', font.name]"></i>
            <p>{{ font.name }}</p>
            <p>{{ font.value }}</p>
            <div class="mask">
              <el-button @click="copyName($event)" :data-name="font.name"
                >复制name</el-button
              >
              <el-button @click="copyValue($event)" :data-value="font.value"
                >复制value</el-button
              >
            </div>
          </li>
        </ul>
      </div>
    </div>
    <Footer class="footer" />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import loadFile from "@/assets/js/loadFile";
export default {
  name: "PreviewFont",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      title: "字体预览",
      fontOldlink: "",
      fontlink: "//at.alicdn.com/t/font_1916117_6z5o7tcmv0f.css",
      fontArray: [],
    };
  },
  created() {},

  mounted() {
    this.handlePreview();
  },

  methods: {
    handlePreview() {
      if (this.fontlink === this.fontOldlink) return;

      let data = loadFile(this.fontlink);
      if (
        this.fontlink.indexOf(".css") == -1 ||
        data.indexOf(".iconfont") == -1
      ) {
        this.$message({
          message: "请输入正确的css路径",
          type: "warning",
        });
        return;
      }

      this.fontArray.length = 0;
      this.replaceCss(this.fontlink, this.fontOldlink);
      this.fontOldlink = this.fontlink;

      data = data
        .replace(/\ +/g, "")
        .replace(/[\r\n]/g, "")
        .split(".iconfont")[1]
        .split("}");

      if (data.length === 0) return;

      data.shift();
      data.forEach((item) => {
        if (!item) return;
        let name = item.split(":before")[0];
        let value = item.split("content:")[1];
        name = name.substring(1);
        value = value.substring(2, value.length - 2);
        let font = {
          name: name,
          value: `&#x${value};`,
        };
        this.fontArray.push(font);
      });
    },

    replaceCss(newUrl, oldUrl) {
      let fontCss = document.getElementsByTagName("link");
      let flag = false;
      fontCss.forEach((item) => {
        if (item.getAttribute("href") == oldUrl) {
          flag = true;
          item.setAttribute("href", newUrl);
        }
      });

      if (!flag) {
        let css = document.createElement("link");
        css.href = newUrl;
        css.rel = "stylesheet";
        css.type = "text/css";
        document.head.appendChild(css);
      }
    },

    // 复制icon name
    copyName(e) {
      let name = e.currentTarget.dataset.name;
      this.$copyText(name).then(() => {
        this.$message({
          message: `${name} 复制成功`,
          type: "success",
        });
      });
    },

    // 复制icon value
    copyValue(e) {
      let value = e.currentTarget.dataset.value;
      this.$copyText(value).then(() => {
        this.$message({
          message: `${value} 复制成功`,
          type: "success",
        });
      });
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  position: relative;
  width: 100%;
  min-height: 100%;
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
    text-align: center;
    color: #7c96b1;
    margin-top: 0.2rem;
  }
  .content {
    margin-top: 0.4rem;
    .input-item {
      width: 40%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-content: center;
      .el-input {
        display: inline-block;
        width: 70%;
        font-size: 0.2rem;
        /deep/.el-input__inner {
          line-height: 2em;
          height: 2em;
        }
      }
      .el-button {
        width: 20%;
        font-size: 0.2rem;
        padding: 0;
        line-height: 2;
      }
    }
    .preview-container {
      width: 80%;
      margin: 0.4rem auto;
      font-size: 0.16rem;
      ul {
        padding: 0;
      }
      li {
        display: inline-block;
        width: 10.5%;
        margin: 0.1rem 1%;
        padding: 0.15rem 0.05rem;
        text-align: center;
        box-sizing: border-box;
        position: relative;
        .iconfont {
          font-size: 0.3rem;
          line-height: 1;
        }
        p {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0;
          margin-top: 0.1rem;
        }
        .mask {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(116, 192, 239, 0.8);
          border-radius: 0.2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: all 0.3s;
          button {
            margin: 0.05rem auto;
            padding: 0;
            font-size: 0.16rem;
            line-height: 2;
            width: 70%;
          }
        }
        &:hover {
          .mask {
            opacity: 1;
          }
        }
      }
    }
  }
}
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
