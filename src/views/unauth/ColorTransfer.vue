<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>
    <div class="content">
      <div class="colorInput">
        <el-popover
          placement="top-start"
          width="120"
          trigger="manual"
          :value="Boolean(prpoverCon)"
          :content="prpoverCon"
        >
          <el-input
            v-model="inputColor"
            type="input"
            slot="reference"
            placeholder="请输入或选择颜色值进行转换，如#abcdef、abcdef、255,100,10、255,100,10,0.5"
            :class="prpoverCon ? 'invalid' : ''"
            @keyup.enter.native="handleTransfer()"
          ></el-input>
        </el-popover>
        <el-color-picker
          v-model="color"
          show-alpha
          @change="inputColor = color ? color.replace(/rgba\(|\)/g, '') : null"
        ></el-color-picker>
        <el-button class="btn-trans" @click="handleTransfer()" id="transformation-color">转换</el-button>
      </div>
      <el-table
        class="resultTable"
        :data="tableData"
        :span-method="objectSpanMethod"
        border
        stripe
      >
        <el-table-column prop="type" label="颜色格式"> </el-table-column>
        <el-table-column prop="color" label="转换结果"> </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              :plain="true"
              @click="handleCopy(scope.$index, scope.row)"
              >复制</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="颜色预览">
          <span class="colorBlock" :style="`background-color: ${color}`"></span>
        </el-table-column>
      </el-table>
    </div>
    <Footer />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "ColorTransfer",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      title: "颜色代码转换",
      color: "",
      inputColor: "",
      tableData: [
        {
          type: "16进制",
          color: " ",
        },
        {
          type: "RGB",
          color: " ",
        },
      ],
      prpoverCon: "",
    };
  },
  created() {},
  methods: {
    // 16进制转rgb
    colorToRGB(val) {
      if (val) {
        let arr = [];
        for (let i = 0; i < 3; i++) {
          arr.push(parseInt(val.substr(1 + i * 2, 2), 16));
        }
        return `rgb(${arr.join(", ")})`;
      }
    },
    // rgb转16进制
    colorHex(val) {
      if (val) {
        let values = val
          .replace(/rgba?\(|\)/, "")
          .replace(/[\s+]/g, "")
          .split(",");
        let arr = [];
        let a = parseFloat(values[3] || 1);
        for (let i = 0; i < 3; i++) {
          let c = Math.floor(a * parseInt(values[i]) + (1 - a) * 255);
          arr.push(("0" + c.toString(16)).toUpperCase().slice(-2));
        }
        return `#${arr.join("")}`;
      }
    },
    // 颜色代码转换
    handleTransfer() {
      if (!this.inputColor) {
        this.prpoverCon = "请输入颜色代码";
      } else {
        let inputcolor = this.inputColor.replace(/\s+/g, "");
        let re1 = /^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/; // 16进制颜色码正则验证
        let re2 = /^((2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),){2}(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)(,(0\.\d{1,2}|1|0))?$/; // RGB颜色码正则验证
        if (!re1.test(inputcolor) && !re2.test(inputcolor)) {
          this.prpoverCon = "请输入正确的颜色代码";
        } else {
          // 输入值为16进制
          this.prpoverCon = "";
          if (re1.test(inputcolor)) {
            inputcolor = inputcolor.replace("#", "").toUpperCase();
            let num = inputcolor.length;
            this.tableData[0].color =
              num == 6
                ? `#${inputcolor}`
                : `#${inputcolor.substr(0, 1) +
                    inputcolor.substr(0, 1) +
                    inputcolor.substr(1, 1) +
                    inputcolor.substr(1, 1) +
                    inputcolor.substr(2, 1) +
                    inputcolor.substr(2, 1)}`;
            this.tableData[1].color = this.colorToRGB(this.tableData[0].color);
          } else {
            // 输入值为rgb格式
            inputcolor = inputcolor.replace(/,/g, ", ");
            let num = inputcolor.match(/,/g).length;
            this.tableData[1].color =
              num == 2 ? `rgb(${inputcolor})` : `rgba(${inputcolor})`;
            this.tableData[0].color = this.colorHex(this.tableData[1].color);
          }
          this.color = this.tableData[1].color;
        }
      }
    },
    // 颜色预览列合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3 && rowIndex === 0) {
        return [2, 1];
      }
    },
    // 复制颜色码
    handleCopy(index, row) {
      this.$copyText(this.tableData[index].color).then(() => {
        this.$message({
          message: "复制成功",
          type: "success",
        });
      });
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;

  .title {
    font-size: 0.4rem;
    text-align: center;
    color: #7c96b1;
  }
  .content {
    width: 70%;
    margin: 3% auto;
    .colorInput {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0.2rem 0;
      .btn-trans {
        width: 1.2rem;
        letter-spacing: 2px;
        margin-left: 0.3rem;
        margin-top: 0.6rem;
      }
      /deep/.el-input__inner {
        font-size: 0.2rem;
        border: 1px dashed transparent;
      }
      .el-input {
        &.invalid {
          /deep/.el-input__inner {
            border-color: red;
          }
        }
      }
      & > span {
        display: inline-block;
        width: 86%;
      }
    }
    .resultTable {
      /deep/.el-table--enable-row-transition .el-table__body td {
        position: relative;
      }
      .colorBlock {
        position: absolute;
        display: inline-block;
        width: 60%;
        height: 75%;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
      }
    }
  }
}
/deep/.el-color-picker {
  position: relative;
}
/deep/.el-color-picker__trigger {
  position: absolute;
  top: 0.3rem;
  left: -0.08rem;
}
@media screen and (max-width: 900px) {
  .container {
    .content {
      .colorInput {
        span {
          width: 55%;
        }
      }
    }
  }
}
</style>
