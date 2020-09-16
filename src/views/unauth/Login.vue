<template>
  <div class="container">
    <Header />
    <div class="content">
      <p class="title">{{ loginShow ? "登录" : "注册" }}</p>
      <!-- 登录 -->
      <transition name="el-zoom-in-center">
        <div v-show="loginShow" class="transition-box">
          <div class="login">
            <el-form
              :model="loginForm"
              ref="loginForm"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item
                label="邮箱"
                prop="email"
                :rules="[
                  {
                    required: true,
                    message: '请输入邮箱地址',
                    trigger: 'blur',
                  },
                  {
                    type: 'email',
                    message: '请输入正确的邮箱地址',
                    trigger: ['blur', 'change'],
                  },
                ]"
              >
                <el-input
                  v-model="loginForm.email"
                  style="width: 3rem;"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="密码"
                prop="password"
                :rules="[{ required: true, message: '密码不能为空' }]"
              >
                <el-input
                  style="width: 3rem;"
                  v-model="loginForm.password"
                  type="password"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="success" @click="submitLoginForm('loginForm')">
                  登 录
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </transition>

      <!-- 注册 -->
      <transition name="el-zoom-in-center">
        <div v-show="!loginShow" class="transition-box">
          <div class="register">
            <el-form
              :rules="registerRules"
              :model="registerForm"
              ref="registerForm"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="邮箱" prop="email">
                <el-input
                  v-model="registerForm.email"
                  style="width: 3rem;"
                ></el-input>
              </el-form-item>
              <el-form-item label="验证码" prop="code">
                <el-input
                  style="width: 1rem;"
                  v-model="registerForm.code"
                  autocomplete="off"
                ></el-input>
                <el-button
                  plain
                  style="margin-left: .2rem"
                  :loading="loading"
                  @click="sendCode()"
                  >发送验证码</el-button
                >
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  type="password"
                  v-model="registerForm.password"
                  autocomplete="off"
                  style="width: 3rem;"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="确认密码"
                prop="checkPassword"
              >
                <el-input
                  type="password"
                  v-model="registerForm.checkPassword"
                  autocomplete="off"
                  style="width: 3rem;"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="success"
                  @click="submitRegisterForm('registerForm')"
                >
                  注 册
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </transition>
      <div class="click-login-register">
        <a @click="loginShow = !loginShow">{{
          loginShow ? "点击注册" : "点击登录"
        }}</a>
      </div>
    </div>
    <Footer class="footer" />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "Login",
  components: {
    Header,
    Footer,
  },
  data() {
    // var validatePass = (rule, value, callback) => {
    //   if (value === "") {
    //     callback(new Error("请输入密码"));
    //   } else {
    //     if (this.registerRules.checkPassword !== "") {
    //       this.$refs.ruleForm.validateField("checkPassword");
    //     }
    //     callback();
    //   }
    // };
    var validatePass2 = (rule, value, callback) => {
      console.log("value",value)
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      loginShow: true,
      loading: false,
      registerForm: {
        email: "",
        code: "",
        password: "",
        checkPassword: "",
      },
      loginForm: {
        email: "",
        password: "",
      },
      registerRules: {
        email: [
          {
            required: true,
            message: "邮箱不能为空",
            trigger: "blur",
          },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        code: [
          { required: true, message: "验证码不能为空" },
          {
            min: 4,
            max: 4,
            message: "长度4个字符",
            trigger: "blur",
          },
        ],
        password: [{
            required: true,
            message: "密码不能为空",
            trigger: "blur",
          }],
        checkPassword: [{ validator: validatePass2, trigger: "blur" }],
        code: [
          { required: true, message: "验证码不能为空" },
          {
            min: 4,
            max: 4,
            message: "长度4个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {},

  methods: {
    //发送验证码
    sendCode() {},
    //提交注册表单
    submitRegisterForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          return false;
        }
      });
    },

    //提交登录表单
    submitLoginForm() {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  /deep/.el-input__inner {
    background: unset;
  }
  .content {
    width: 6rem;
    height: 3.5rem;
    margin: 4% auto;
    padding: 3% 0 4%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    position: relative;
    .transition-box {
      position: absolute;
    }
    .title {
      font-size: 0.3rem;
      text-align: center;
      color: #7c96b1;
    }
    .click-login-register {
      font-size: 0.2rem;
      position: absolute;
      right: 0.2rem;
      bottom: 0.2rem;
      a {
        color: #7c96b1;
        cursor: pointer;
      }
    }
    .login,
    .register {
      width: 100%;
      margin-left: 0.5rem;
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
