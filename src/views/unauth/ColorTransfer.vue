<template>
  <div class="container">
    <Header />
    <div class="title">{{ title }}</div>
    <div class="content">
      <div class="colorInput">
        <el-input
          :value="color"
          type="input"
          placeholder="请输入或选择颜色值进行转换，如#abcdef、255,100,5"
        ></el-input>
        <el-color-picker v-model="color" show-alpha></el-color-picker>
        <el-button class="btn-trans" @click="handleTransfer()">转换</el-button>
      </div>
      <el-table
        class="resultTable"
        :data="tableData"
        :span-method="objectSpanMethod"
        border
        stripe
      >
        <el-table-column prop="type" label="颜色格式" width="180">
        </el-table-column>
        <el-table-column prop="color" label="转换结果" width="180">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleCopy(scope.$index, scope.row)"
              >复制</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="颜色预览">
          <span class="colorBlock" ></span>
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
    };
  },
  created() {},
  methods: {
    handleTransfer() {},
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3 && rowIndex === 0) {
        return [2, 1];
      }
    },
    handleCopy(index, row) {
      console.log(index, row);
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;

  .title {
    font-size: 40px;
    text-align: center;
    color: #fff;
  }
  .content {
    width: 70%;
    height: 70%;
    margin: 0 auto;
    .colorInput {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 10px 0;
      .btn-trans {
        width: 120px;
        letter-spacing: 2px;
        margin-left: 30px;
      }
      /deep/.el-input__inner {
        font-size: 20px;
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
</style>
