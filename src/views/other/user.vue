<template>
  <div class="app-container">

    <el-form :inline="true">
      <el-form-item label="用户名称">
        <el-input v-model="serchForm.userName" placeholder="请输入用户名称" clearable size="small" />
      </el-form-item>
      <el-form-item label="用户编号">
        <el-input v-model="serchForm.userCode" placeholder="请输入用户编号" clearable size="small" />
      </el-form-item>
      <el-form-item label="平台编号">
        <el-input v-model="serchForm.platformID" placeholder="请输入平台编号" clearable size="small" />
      </el-form-item>
      <el-form-item label="站点编号">
        <el-input v-model="serchForm.siteID" placeholder="请输入站点编号" clearable size="small" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="serchForm.userState" size="small" filterable placeholder="请选择状态" clearable>
          <el-option value="0" label="禁用">禁用</el-option>
          <el-option value="1" label="启动">启动</el-option>
          <el-option value="2" label="删除">删除</el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click.stop="getList()">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="dataList" style="width: 100%;margin-top:30px;" border size="mini">
      <el-table-column align="center" label="用户编号" prop="userID" width="140px" />
      <el-table-column align="center" label="平台编号" prop="platformID" width="140px" />
      <el-table-column align="center" label="用户名称" prop="userName" width="140px" />
      <el-table-column align="center" label="登录名" prop="login" width="140px" />
      <el-table-column align="center" label="状态" prop="userState" width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.userState == 1 ? '已启用' : scope.row.userState == 2 ? '已禁用' : '已删除' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最后登录时间" prop="lastLoginTime" width="140px" />
      <el-table-column align="center" label="操作" width="320px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click.stop="resetPass(scope.row.userID)">重置登录密码</el-button>
          <el-button size="mini" type="danger" @click.stop="resetDealPass(scope.row.userID)">重置交易密码</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-box">
      <el-pagination
        :current-page="page"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataList: [],
      levelList: [],
      total: 0,
      page: 1,
      size: 10,
      serchForm: {
        userName: '',
        userCode: '',
        userState: '',
        siteID: '',
        platformID: ''
      }

    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList(page, size) {
      const form = Object.assign({}, this.serchForm, {
        pageNum: page || 1,
        pageSize: size || 10
      })
      for (const key in form) {
        if (!form[key]) {
          delete form[key]
        }
      }
      this.POST(
        '/user/user/pageUser',
        form,
        data => {
          this.dataList = data.body.records
          this.size = data.body.size
          this.page = data.body.current
          this.total = data.body.total
        }
      )
    },
    resetPass(id) {
      var _this = this
      _this.$confirm('确定要重置登录密码吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.POST(
          '/user/user/resetUserPassword',
          {
            userID: id
          },
          data => {
            if (data.code == 1001) {
              this.$alert(`重置成功！新的登录密码为：${data.msg}`, '提示', {
                confirmButtonText: '确定'
              })
            }
          }
        )
      })
    },
    resetDealPass(id) {
      var _this = this
      _this.$confirm('确定要重置交易密码吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.POST(
          '/user/user/resetTransactionPassword',
          {
            userID: id
          },
          data => {
            if (data.code == 1001) {
              this.$alert(`重置成功！新的交易密码为：${data.msg}`, '提示', {
                confirmButtonText: '确定'
              })
            }
          }
        )
      })
    },
    // 每页数量改变
    handleSizeChange(val) {
      this.size = val
      this.page = 1
      this.getList(this.page, this.size)
    },
    // 当前页面改变
    handleCurrentChange(val) {
      this.page = val
      this.getList(this.page, this.size)
    }
  }
}
</script>

<style lang="scss" scoped>
    .app-container {
        .roles-table {
            margin-top: 30px;
        }
        .permission-tree {
            margin-bottom: 30px;
        }
    }
    .table-img{
        width: 80px;
    }
</style>
