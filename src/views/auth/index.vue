<template>
  <div class="container menu2-1-container">

    <div class="btn-box">
      <el-button type="success" size="small" @click="userDialog=true">新建站点</el-button>
    </div>

    <el-card class="box-card" style="margin-top:30px;">
      <!-- <div slot="header" class="clearfix">
        <span>角色列表</span>
        <el-button style="float: right;" type="danger" size="small" @click="userDialog=true">添加角色</el-button>
      </div> -->

      <div class="recevie-wrap">
        <el-table ref="multipleTable" v-loading="loading" border row-key="id" :data="tableData" style="width: 100%" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" size="mini" @selection-change="handleSelectionChange">
          <el-table-column prop="roleID" label="角色编号" />
          <el-table-column prop="roleName" label="角色名称" />
          <el-table-column prop="label10" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="goSet(scope.row)">设置权限</el-button>
              <el-button type="warning" size="mini" @click="_edit(scope.row)">编辑</el-button>
              <el-button slot="reference" type="danger" size="mini" @click="_del(scope.row.roleID)">删除角色</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination
            background
            :current-page="currentPage"
            :page-sizes="[10, 20, 30]"
            :page-size="20"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>

    </el-card>

    <!-- 删除 -->
    <el-dialog title="确认删除此角色吗？" :visible.sync="dialog1" width="30%">
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog1 = false">取 消</el-button>
        <el-button type="primary" :loading="confirmDelLoading" @click="confirmDel">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="userDialog" @closed="closeForm('form')">
      <el-form ref="form" :model="form" label-width="100px" class="demo-dynamic">
        <el-form-item
          prop="roleName"
          label="角色名称"
          :rules="[
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { max: 20, message: '长度在 20 字符以内', trigger: 'blur' }
          ]"
        >
          <el-input v-model="form.roleName" placeholder="角色名称" style="max-width:350px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="confirmDelLoading" @click="submitForm('form')">确 认 保 存</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>

  </div>
</template>

<script>
// import { getList,getLists,getData,getDatas } from '@/api/price/price-1/common'
export default {
  data() {
    return {
      form: {},
      dialog1: false,
      userDialog: false,
      title: '添加角色',
      confirmDelLoading: false,
      delId: '',
      loading: false,
      total: 0,
      tableData: [],
      currentPage: 1,
      queryParams: {
        pageNum: 1,
        pageSize: 20
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {

    // 获取角色列表
    getList() {
      this.loading = true
      //   getLists(this.queryParams,'/user/role/pageRole').then(res => {
      //     if (res.code===1001){
      //       this.tableData = res.body.records
      //       this.total = res.body.total
      //     }
      //     this.loading = false
      //   }).catch(err => {
      //     this.loading = false
      //   })
      this.POST(
        '/user/role/pageRole',
        this.queryParams,
        data => {
          if (data.code === 1001) {
            this.tableData = data.body.records
            this.total = data.body.total
          }
          this.loading = false
        }, err => {
          this.loading = false
        }
      )
    },

    // 删除角色
    _del(id) {
      this.dialog1 = true
      this.delId = id
    },
    // 确定删除
    confirmDel() {
      this.confirmDelLoading = true

      this.GET(
        '/user/role/delete',
        {
          id: this.delId
        },
        data => {
          if (data.code === 1001) {
            this.$message({
              showClose: true,
              message: data.msg,
              type: 'success'
            })
            this.getList()
            this.dialog1 = false
          } else {
            this.$message({
              showClose: true,
              message: data.msg,
              type: 'error'
            })
          }
          this.confirmDelLoading = false
        }, err => {
          this.confirmDelLoading = false
        }
      )

      // getDatas({id:this.delId},'/user/role/delete').then(res => {
      //     if (res.code===1001){
      //     this.$message({
      //         showClose: true,
      //         message: res.msg,
      //         type: 'success',
      //     });
      //     this.getList()
      //     this.dialog1 = false
      //     }else{
      //     this.$message({
      //         showClose: true,
      //         message: res.msg,
      //         type: 'error',
      //     });
      //     }
      //     this.confirmDelLoading = false
      // }).catch(err => {
      //     this.confirmDelLoading = false
      // })
    },

    // 编辑角色
    _edit(data) {
      this.title = '修改角色名称'
      this.form = {
        roleID: data.roleID,
        roleName: data.roleName
      }
      this.userDialog = true
    },

    // 清空form
    closeForm(formName) {
      this.title = '添加角色'
      this.form = {}
      this.$refs[formName].resetFields()
    },

    // 添加角色
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmDelLoading = true
          // getLists(this.form,'/user/role/saveOrUpdate').then(res => {
          //   if (res.code===1001){
          //     this.$message({
          //       showClose: true,
          //       message: res.msg,
          //       type: 'success',
          //     });
          //     this.getList()
          //     this.userDialog = false
          //   }else{
          //     this.$message({
          //       showClose: true,
          //       message: res.msg,
          //       type: 'error',
          //     });
          //   }
          //   this.confirmDelLoading = false
          // }).catch(err => {
          //   this.confirmDelLoading = false
          // })

          this.POST(
            '/user/role/saveOrUpdate',
            this.form,
            data => {
              if (data.code === 1001) {
                this.$message({
                  showClose: true,
                  message: data.msg,
                  type: 'success'
                })
                this.getList()
                this.userDialog = false
              } else {
                this.$message({
                  showClose: true,
                  message: data.msg,
                  type: 'error'
                })
              }
              this.confirmDelLoading = false
            }, err => {
              this.confirmDelLoading = false
            }
          )
        } else {
          return false
        }
      })
    },

    // 去设置权限
    goSet(data) {
      this.$router.push({ path: '/auth/admin/authedit/' + data.roleID + '/' + data.roleName })
    },

    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getList()
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  padding:20px;
  .tips {
    color:#909399;
    font-size:12px;
    line-height:20px;
    width:400px;
    margin-left:10px;
  }
  .tab-wrap {
    a {
      &.active {
        border-bottom:2px solid #409eff
      }
    }
  }
  .filter-wrap {
    margin-top:20px;
  }
}
</style>

