<template>
  <div class="index_wrap">
    <div class="index_table">
      <div class="table_header">
        <div class="header_left">
          <img src="../assets/images/star-white.png" class="star-icon" />通知公告
        </div>
        <div class="header_right addList" @click="addList">
          <div class="addIcon">+</div>新增
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="title"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleView(scope.$index, scope.row)">查看</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      activeNames: ['1'],
      tableData: [{
        title: '关于《中铁一局国际业务营销项目立项管理办法》中 “特殊项目”解释的通知'
      }, {
        title: '关于再次重申禁止企图参与或者参与亚行项目投标的通知'
      }],
    }
  },
  methods: {
    addList() {

    },
    handleView(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    }
  },
}
</script>

<style lang="scss" scoped>
.index_wrap {
  .index_table {
    width: 60%;
    .table_header {
      height: 2.5rem /* 40/16 */;
      background-color: #307ecc;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1rem;
      color: #fff;
      .header_left {
        .star-icon {
        }
      }
      .header_right {
        display: flex;
        font-weight: bold;
        cursor: pointer;
        .addIcon {
          padding: 0 0.5rem;
          &:hover {
            transform: scale(2, 2);
          }
        }
        // &::before {
        //   content: "+";
        //   padding: 0.5rem;
        //   font-weight: 600;
        //   &:hover {
        //     transform: scale(2, 2);
        //   }
        // }
      }
    }
  }
}

/* 定义keyframe动画，命名为blink */
@keyframes blink {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
/* 添加兼容性前缀 */
@-webkit-keyframes blink {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-moz-keyframes blink {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-ms-keyframes blink {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@-o-keyframes blink {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
/* 定义blink类*/
.blink {
  color: #dd4814;
  animation: blink 1s linear infinite;
  /* 其它浏览器兼容性前缀 */
  -webkit-animation: blink 1s linear infinite;
  -moz-animation: blink 1s linear infinite;
  -ms-animation: blink 1s linear infinite;
  -o-animation: blink 1s linear infinite;
}
</style>
