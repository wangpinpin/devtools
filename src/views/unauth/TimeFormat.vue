<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>

    <div class="content">
      <el-form class="form" label-width="100px" :model="form">
        <el-form-item label="时间戳">
          <el-col :span="9">
            <el-input v-model="form.timestamp.value"></el-input>
          </el-col>
          <el-col :span="4">
            <el-select v-model="form.timestamp.type" @change="toDatetime">
              <el-option
                v-for="item in timeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >{{ item.label }}
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-button @click="toDatetime">转换</el-button>
          </el-col>
          <el-col :span="9">
            <el-input v-model="form.timestamp.result"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="时间">
          <el-col :span="9">
            <el-date-picker
              v-model="form.datetime.value"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-col>
          <el-col :span="2">
            <el-button @click="toTimestamp">转换</el-button>
          </el-col>
          <el-col :span="9"
            ><el-input v-model="form.datetime.result"></el-input
          ></el-col>
          <el-col :span="4">
            <el-select v-model="form.datetime.type" @change="toTimestamp">
              <el-option
                v-for="item in timeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >{{ item.label }}
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
    <Footer class="footer" />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { formatDate } from "@/util/date";
export default {
  name: "TimeFormat",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      title: "时间戳转换",
      timeOptions: [
        { value: "s", label: "秒(s)" },
        { value: "ms", label: "毫秒(ms)" },
      ],
      form: {
        timestamp: {
          value: "",
          type: "",
          result: "",
        },
        datetime: {
          value: "",
          type: "",
          result: "",
        },
      },
    };
  },
  created() {},
  mounted() {
    this.form.timestamp.type = this.timeOptions[0].value;
    this.form.datetime.type = this.timeOptions[1].value;
    this.form.timestamp.value = Math.round(new Date().getTime() / 1000);
    this.form.datetime.value =  new Date(Date.parse(new Date()));
  },
  methods: {
    toDatetime() {
      var timestamp = this.form.timestamp.value
        .toString()
        .replace(/^\s+|\s+$/, "");
      if (!/^-?\d+$/.test(timestamp)) {
        this.$message({
          message: "时间戳格式不正确",
          type: "warning",
        });
        return;
      }
      timestamp *= 1;
      if (this.form.timestamp.type === "s") {
        timestamp *= 1000;
      }
      this.form.timestamp.result = formatDate(
        new Date(timestamp),
        "yyyy-MM-dd hh:mm:ss"
      );
    },
    toTimestamp() {
      let datetimeObj = this.form.datetime;
      let timeunit = datetimeObj.type === "s" ? 1000 : 1;
      if (!datetimeObj.value) {
        this.$message({
          message: "请选择日期时间",
          type: "warning",
        });
        return;
      }
      datetimeObj.result = Math.round(datetimeObj.value.getTime() / timeunit);
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  text-align: center;

  .title {
    font-size: 0.4rem;
    color: #7c96b1;
    margin-top: 0.2rem;
  }
  .content {
    margin: 3%;
    margin-top: 7%;
    .form {
      width: 80%;
      margin: 0 auto;
      /deep/.el-col > * {
        width: calc(100% - 0.2rem);
        margin: 0 auto;
        padding-left: 0;
        padding-right: 0;
      }
    }
  }
}
@media screen and (max-width: 900px) {
  .container {
    position: relative;
    width: 100%;
    min-height: 100%;
    height: unset;
    text-align: center;
    background-image: linear-gradient(
      to top,
      #f3e7e9 0%,
      #e3eeff 99%,
      #e3eeff 100%
    );
    padding-bottom: 1%;
    /deep/.el-col {
      float: none;
      width: 100%;
    }
    .footer {
      /deep/.container {
        position: unset;
      }
    }
  }
}
</style>
