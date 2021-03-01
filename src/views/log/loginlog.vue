<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item v-if="userType == 1" label="平台编号">
        <el-input v-model="serchForm.platformID" placeholder="请输入平台编号" clearable size="small" />
      </el-form-item>
      <el-form-item v-if="userType == 2" label="站点编号">
        <el-input v-model="serchForm.siteID" placeholder="请输入站点编号" clearable size="small" />
      </el-form-item>
      <el-form-item label="用户编号">
        <el-input v-model="serchForm.userID" placeholder="请输入用户编号" clearable size="small" />
      </el-form-item>
      <el-form-item label="登录账号">
        <el-input v-model="serchForm.login" placeholder="请输入登录账号" clearable size="small" />
      </el-form-item>
      <el-form-item label="登录IP">
        <el-input v-model="serchForm.ip" placeholder="请输入IP" clearable size="small" />
      </el-form-item>
      <el-form-item label="登录地址">
        <el-input v-model="serchForm.addr" placeholder="请输入地址" clearable size="small" />
      </el-form-item>
      <el-form-item label="登录域名">
        <el-input v-model="serchForm.domain" placeholder="请输入域名" clearable size="small" />
      </el-form-item>
      <el-form-item label="账号类型">
        <el-select v-model="serchForm.logType" size="small" filterable placeholder="请选择类型" clearable>
          <el-option :value="1" label="管理用户">管理用户</el-option>
          <el-option :value="2" label="平台用户">平台用户</el-option>
          <el-option :value="3" label="站长用户">站长用户</el-option>
          <el-option :value="4" label="前端用户">前端用户</el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click.stop="search()">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table row-key="editionID" :data="dataList" style="width: 100%;margin-top:30px;" border size="mini">
      <el-table-column align="center" label="编号" prop="loginLogID" width="140px" />
      <el-table-column align="center" label="登录账号" prop="login" width="140px" />
      <el-table-column align="center" label="账号类型" prop="logType" width="120px">
        <template slot-scope="scope">
          <span>{{ renderType(scope.row.logType) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录IP" prop="ip" width="140px" />
      <el-table-column align="center" label="登录地址" prop="addr" width="240px" />
      <el-table-column align="center" label="登录域名" prop="domain" width="200px" />
      <el-table-column align="center" label="登录时间" prop="createTime" width="160px" />
      <el-table-column align="center" label="平台编号" prop="platformID" width="160px" />
      <el-table-column align="center" label="站点编号" prop="siteID" width="160px" />
      <el-table-column align="center" label="用户编号" prop="userID" width="160px" />
      <!-- <el-table-column align="center" label="操作" width="300px">
                <template slot-scope="scope">
                <el-button size="mini" type="primary" @click.stop="toDetail(scope.row)">编辑</el-button>
                <el-button size="mini" type="primary" @click.stop="price(scope.row)">价格设置</el-button>
                <el-button size="mini" type="danger" @click.stop="delItem(scope.row.editionID)">删除</el-button>
                </template>
            </el-table-column> -->
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
      total: 0,
      page: 1,
      size: 10,
      serchForm: {
        platformID: '',
        siteID: '',
        userID: '',
        login: '',
        ip: '',
        addr: '',
        domain: '',
        editionType: ''
      },
      userType: null
    }
  },
  created() {
    this.getList()
    this.userType = this.Read('userType')
  },
  methods: {
    search() {
      this.page = 1
      this.getList()
    },
    getList(page, size) {
      const form = Object.assign({}, this.serchForm, {
        pageNum: page || 1,
        pageSize: size || 10
      })
      this.POST(
        '/log/loginLog/page',
        form,
        data => {
          this.dataList = data.body.records
          this.size = data.body.size
          this.page = data.body.current
          this.total = data.body.total
        }
      )
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
    },
    renderType(type) {
      switch (type) {
        case 1:
          return '管理用户'
          break
        case 2:
          return '平台用户'
          break
        case 3:
          return '站长用户'
          break
        case 4:
          return '前端用户'
          break
      }
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
