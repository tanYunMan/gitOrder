<template>
  <div class="container menu2-1-container">

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>管理员列表</span>
        <!-- <el-button style="float: right;" type="danger" @click="userDialog=true">添加角色</el-button> -->
      </div>

      <div class="recevie-wrap">
        <el-table ref="multipleTable" v-loading="loading" border row-key="id" :data="tableData" style="width: 100%" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" size="mini" @selection-change="handleSelectionChange">
          <el-table-column prop="userID" label="编号" />
          <el-table-column prop="login" label="登录帐号" />
          <el-table-column prop="userName" label="用户名称" />
          <el-table-column prop="money" label="金额" />
          <el-table-column prop="role" label="角色名">
            <template slot-scope="scope">
              <span v-if="scope.row.roleVO">{{ scope.row.roleVO.roleName || '--' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userState" label="状态">
            <template slot-scope="scope">
              <span>{{ scope.row.userState == 1 ? '正常' : scope.row.userState == 2 ? '禁用' : scope.row.userState == 3 ? '删除' : '--' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="label10" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="goSet(scope.row)">添加角色</el-button>
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

    <el-dialog :title="title" :visible.sync="userDialog" @closed="closeForm('form')">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="demo-dynamic">
        <el-form-item
          prop="roleName"
          label="用户名称:"
        >
          <span style="max-width:350px">{{ form.userName }}</span>
        </el-form-item>
        <el-form-item
          prop="roleID"
          label="选择角色:"
        >
          <el-select v-model="form.roleID" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.roleID"
              :label="item.roleName"
              :value="item.roleID"
            />
          </el-select>
        </el-form-item>

        <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="val in roleList" :label="val.roleName" :key="val.roleID">{{val.roleName}}</el-checkbox>
          </el-checkbox-group> -->
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
      isIndeterminate: false,
      checkAll: false,
      checkedCities: [],

      form: {
        roleID: ''
      },
      rules: {
        roleID: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ]
      },
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
      },
      roleList: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {

    // handleCheckAllChange(val) {
    //   this.checkedCities = val ? cityOptions : [];
    //   this.isIndeterminate = false;
    // },
    // handleCheckedCitiesChange(value) {
    //   let checkedCount = value.length;
    //   this.checkAll = checkedCount === this.cities.length;
    //   this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    // },

    // 获取管理员列表
    getList() {
      this.loading = true
      // getLists(this.queryParams,'/user/user/pageSite').then(res => {
      //   if (res.code===1001){
      //     this.tableData = res.body.records
      //     this.total = res.body.total
      //   }
      //   this.loading = false
      // }).catch(err => {
      //   this.loading = false
      // })
      this.POST(
        '/user/user/pageSite',
        this.queryParams,
        res => {
          this.tableData = res.body.records
          this.total = res.body.total
          this.loading = false
        },
        err => {
          this.loading = false
        }
      )
    },

    // 清空form
    closeForm(formName) {
      this.title = '添加角色'
      this.form = {
        roleID: ''
      }
      this.$refs[formName].resetFields()
    },

    // 添加角色
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmDelLoading = true
          // getLists({roleID:this.form.roleID,userID:this.form.userID},'/user/userRole/saveUserRole').then(res => {
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
            '/user/userRole/saveUserRole',
            { roleID: this.form.roleID, userID: this.form.userID },
            res => {
              this.$message({
                showClose: true,
                message: res.msg,
                type: 'success'
              })
              this.getList()
              this.userDialog = false
              this.confirmDelLoading = false
            },
            err => {
              if (err.msg) {
                this.$message({
                  showClose: true,
                  message: err.msg,
                  type: 'error'
                })
              }
              this.confirmDelLoading = false
            }
          )
        } else {
          return false
        }
      })
    },

    // 获取可选择的角色
    goSet(data) { // userID:data.userID
      this.form = { ...data, roleID: '' }
      // getDatas({},'/user/role/getRolesByUserID').then(res => {
      //   if (res.code===1001){
      //       this.roleList = res.body
      //       this.userDialog = true
      //   }

      // }).catch(err => {

      // })
      this.GET(
        '/user/role/getRolesByUserID',
        {},
        res => {
          this.roleList = res.body
          this.userDialog = true
        }
      )
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
  }
}
