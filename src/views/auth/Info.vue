<template>
  <div class="container">
    <Header />
    <div class="content">
      <div class="form">
        <div class="image">
          <el-upload
            action="#"
            list-type="picture-card"
            ref="upload"
            :auto-upload="false"
            :on-change="onChange"
          >
            <i v-if="!form.headImg" slot="default" class="el-icon-plus"></i>
            <img class="head-img" :src="form.headImg" alt="" />
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </div>
        <div class="right">
          <img class="element" src="@/assets/imgs/info.png" alt="宇航员" />
          <div class="nick-name">
            <span class="label-name">昵称</span>
            <el-input v-model="form.nickName" placeholder="昵称"></el-input>
          </div>
          <div class="gender">
            <span class="label-name">性别</span>
            <div
              class="gender-div"
              :class="{ 'gender-border-style': form.gender == 1 }"
              @click="changeGender(1)"
            >
              <img src="@/assets/imgs/man.png" alt="男生" />
            </div>
            <div
              class="gender-div"
              :class="{ 'gender-border-style': form.gender == 2 }"
              @click="changeGender(2)"
            >
              <img src="@/assets/imgs/woman.png" alt="女生" />
            </div>
          </div>
        </div>
      </div>
      <span class="submitBtn" @click="saveUserInfo">保存</span>
    </div>
    <Footer />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { compressImage } from "@/util/compressImage"; // 图片压缩方法

export default {
  name: "Info",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      form: {
        headImg: "",
        nickName: "",
        gender: 0,
      },
    };
  },
  created() {
    this.initUserInfo();
  },
  methods: {
    //初始化用户信息
    initUserInfo() {
      this.$http.post("user/findUserInfo").then((res) => {
        this.$store.commit("setUserInfo", res);

        this.form.headImg = res.headImg;
        this.form.nickName = res.nickName;
        this.form.gender = res.gender;
      });
    },

    //保存用户信息
    saveUserInfo() {
      this.$http.post("user/saveUserInfo", this.form).then((res) => {
        this.initUserInfo();

        this.$message({
          message: "保存成功",
          type: "success",
        });
      });
    },
    //切换性别
    changeGender(val) {
      if (val == this.form.gender) {
        return;
      }
      this.form.gender = val;
    },
    onChange(file) {
      if (file.raw) {
        document.getElementsByClassName("el-upload")[0].style.display = "none";
        document.getElementsByClassName("el-upload-list")[0].style.display =
          "unset";

        //压缩图片
        let config = {
          width: 100, // 压缩后图片的宽
          height: 100, // 压缩后图片的高
          quality: 1, // 压缩后图片的清晰度，取值0-1，值越小，所绘制出的图像越模糊
        };
        compressImage(file.raw, config).then((result) => {
          // result 为压缩后二进制文件
          this.imgToBase64(result);
        });
      }
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    imgToBase64(file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.headImg = reader.result;
      };
      reader.onerror = function(error) {
        this.$message({
          message: error,
          type: "error",
        });
      };
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;

  .title {
    font-size: 0.3rem;
    text-align: center;
    color: #7c96b1;
  }
  .content {
    height: calc(100vh - 1.9rem);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .form {
    width: 80%;
    display: flex;
    .image {
      width: 3rem;
      height: 3rem;
      div {
        width: 100%;
        height: 100%;
        /deep/.el-upload {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        /deep/.el-upload-list__item {
          width: 100%;
          height: 100%;
          i {
            font-size: 0.4rem;
          }
        }
        /deep/ .el-upload--picture-card i {
          position: absolute;
        }
      }
      .head-img {
        width: 100%;
        height: 100%;
      }
    }
    .right {
      background: rgba(0, 0, 0, 20%);
      margin-left: 1%;
      border-radius: 6px;
      flex: 1;
      padding: 0.2rem 0.5rem;
      position: relative;
      .element {
        position: absolute;
        width: 20%;
        top: -44%;
        right: -8%;
      }
    }
    .label-name {
      font-size: 0.22rem;
      line-height: 1.5;
      width: 3em;
    }
    .nick-name {
      display: flex;
      align-items: center;
      line-height: 0;
      /deep/.el-input {
        width: 50%;
        input {
          color: #fff;
          background: transparent;
        }
      }
    }
    .gender {
      display: flex;
      align-items: center;
      margin-top: 0.5rem;
      .gender-div {
        width: 1rem;
        height: 1.1rem;
        cursor: pointer;
        border: 1px solid transparent;
        text-align: center;
        margin-right: 0.2rem;
        border-radius: 6px;
        img {
          height: 1rem;
        }
      }
      .gender-div:hover {
        border: 1px solid #fff;
      }
      .gender-border-style {
        border: 1px solid #fff;
      }
    }
  }
  .submitBtn {
    display: inline-block;
    margin-top: 0.5rem;
    font-size: 0.28rem;
    background: rgba(0, 0, 0, 0.2);
    padding: 0 1.8em;
    text-align: center;
    line-height: 2;
    border-radius: 0.4em;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    &:hover {
      color: #7c96b1;
      border-color: #7c96b1;
    }
  }
}

@media screen and (max-width: 900px) {
  .container {
    .content {
    }
  }
}
</style>
