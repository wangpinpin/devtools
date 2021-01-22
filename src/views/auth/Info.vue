<template>
  <div class="container">
    <Header />
    <div class="content">
      <div class="image">

        <el-upload
          action="#"
          list-type="picture-card"
          ref="upload"
          :auto-upload="false"
          :on-change="onChange"
        >
          <i
            v-if="!form.headImg"
            slot="default"
            class="el-icon-plus"
          ></i>
          <img
            class="head-img"
            :src="form.headImg"
            alt=""
          />
          <!-- <div
            slot="file"
            slot-scope="{ file }"
          >
            <img
              class="el-upload-list__item-thumbnail"
              :src="form.headImg"
              alt=""
            />
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
            </span>
          </div> -->
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img
            width="100%"
            :src="dialogImageUrl"
            alt=""
          />
        </el-dialog>
      </div>
      <!-- <div class="image">
        <img :src="form.headImg" />
      </div> -->
      <div class="nick-name">
        <el-input
          v-model="form.nickName"
          placeholder="昵称"
          @change="changeNickName"
        ></el-input>
      </div>

      <div class="gender">
        <div
          class="gender-div"
          :class="{'gender-border-style' : form.gender == 1}"
          @click="changeGender(1)"
        >
          <img
            src="@/assets/imgs/man.png"
            alt="男生"
          >
        </div>
        <div
          class="gender-div"
          :class="{'gender-border-style' : form.gender == 2}"
          @click="changeGender(2)"
        >
          <img
            src="@/assets/imgs/woman.png"
            alt="女生"
          >
        </div>
      </div>
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
      this.saveUserInfo();
    },
    //改变昵称
    changeNickName() {
      this.saveUserInfo();
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
        this.saveUserInfo();
      };
      reader.onerror = function (error) {
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
    display: flex;
    flex-direction: column;
    width: 4rem;
    margin: 1rem auto;
    text-align: center;
    .image {
      width: 2rem;
      height: 2rem;
      margin: 0 auto;
      div {
        width: 100%;
        height: 100%;
        /deep/.el-upload {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
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
    .nick-name {
      width: 60%;
      margin: 0 auto;
    }
    .gender {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      margin-top: 0.5rem;
      .gender-div {
        width: 1rem;
        height: 1.1rem;
        cursor: pointer;
        border: 3px solid transparent;

        img {
          height: 1rem;
        }
      }
      .gender-div:hover {
        border: 3px solid #fff;
      }
      .gender-border-style {
        border: 3px solid #fff;
      }
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
