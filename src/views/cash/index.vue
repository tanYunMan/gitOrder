<template>
  <div class="app-container">
    <div class="btn-box">
      <el-button type="primary" @click.stop="back()">返回</el-button>
    </div>
    <div style="margin-top:40px;">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="提现方式" name="cashWay">
          <el-form ref="form" :model="form" :rules="rules">
            <el-form-item label="提现账户" label-width="120px" prop="cashAccount">
              <el-input v-model="form.cashAccount" style="width:250px" :disabled="wayState == 1 ? true : false" />
            </el-form-item>
            <el-form-item label="提现账户姓名" label-width="120px" prop="cashName">
              <el-input v-model="form.cashName" style="width:250px" :disabled="wayState == 1 ? true : false" />
            </el-form-item>
            <el-form-item label="提现类型" label-width="120px" prop="cashTypeID">
              <el-select v-model="form.cashTypeID" style="width:250px" placeholder="请选择提现类型" :disabled="wayState == 1 ? true : false">
                <el-option
                  v-for="item in cashWayList"
                  :key="item.cashTypeID"
                  :label="item.cashTypeName"
                  :value="item.cashTypeID"
                />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="全网对接押金" label-width="120px">
                            <el-input-number style="width:250px" v-model="form.connectMoney" :precision="2" :step="0.01" :min="0"></el-input-number>
                        </el-form-item> -->
            <el-form-item>
              <el-button v-if="wayState == 1" style="margin-left:280px;" type="primary" icon="el-icon-loading" disabled>审核中</el-button>
              <el-button v-if="wayState == 2" style="margin-left:280px;" type="success" icon="el-icon-check" disabled>审核通过</el-button>
              <el-button v-if="wayState == 3" style="margin-left:280px;" type="danger" icon="el-icon-warning-outline" disabled>审核失败</el-button>
              <el-button v-if="wayState != 1" style="margin-left:280px;" type="primary" @click="save('form')">提交审核</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="提现记录" name="cash">
          <div class="btn-box">
            <el-button type="primary" size="mini" @click="dialogVisible = true">申请提现</el-button>
          </div>
          <el-table :data="dataList" style="width: 100%;margin-top:30px;" border>
            <el-table-column align="center" label="提现单号" prop="cashNumber" />
            <el-table-column align="center" label="提现类型ID" prop="cashMethodID" />
            <el-table-column align="center" label="金额" prop="money" />
            <el-table-column align="center" label="申请时间" prop="askDate" />
            <el-table-column align="center" label="处理时间" prop="dealDate">
              <template slot-scope="scope">
                <span>{{ scope.row.dealDate ? scope.row.dealDate : "—" }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="手续费" prop="fee">
              <template slot-scope="scope">
                <span>{{ scope.row.fee ? scope.row.fee : "—" }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="状态" prop="cashState">
              <template slot-scope="scope">
                <span v-if="scope.row.cashState == 1">审核中</span>
                <span v-if="scope.row.cashState == 2">提现中</span>
                <span v-if="scope.row.cashState == 3">提现完成</span>
                <span v-if="scope.row.cashState == 4">审核失败</span>
              </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="操作" width="350px">
                            <template slot-scope="scope">
                            <el-button size="mini" type="success" >同意退款</el-button>
                            <el-button size="mini" type="danger" >拒绝退款</el-button>
                            </template>
                        </el-table-column> -->
          </el-table>
          <div class="pagination-box">
            <el-pagination
              :current-page="page"
              :page-sizes="PageSizes"
              :page-size="PageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      title="提现"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form :model="cashform">
        <el-form-item label="提现金额" label-width="120px">
          <el-input-number v-model="cashform.money" style="width:250px" controls-position="right" :precision="2" :step="0.01" :min="0" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="cash()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      total: 0,
      page: 1,
      size: 10,
      activeName: 'cashWay',
      cashWayList: [],
      dataList: [],
      form: {
        cashTypeID: '',
        cashAccount: '',
        cashName: ''
      },
      wayState: null,
      rules: {
        cashAccount: [
          { required: true, message: '请输入提现账户', trigger: 'blur' }
        ],
        cashName: [
          { required: true, message: '请输入提现账户姓名', trigger: 'blur' }
        ],
        cashTypeID: [
          { required: true, message: '请选择提现类型', trigger: 'change' }
        ]

      },
      dialogVisible: false,
      cashform: {
        money: ''
      }
    }
  },
  mounted() {
    this.getCashType()
    this.getCashWayView()
    this.getList()
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    back() {
      this.$router.go(-1)
    },
    getCashType() {
      this.GET(
        '/finance/cashType/list',
        {},
        data => {
          if (data.code == 1001) {
            this.cashWayList = data.body
          }
        }
      )
    },
    getCashWayView() {
      this.GET(
        '/finance/cashMethod/get',
        {},
        data => {
          if (data.code == 1001) {
            // this.cashWayList = data.body
            this.form = {
              cashTypeID: data.body.cashTypeID,
              cashAccount: data.body.cashAccount,
              cashName: data.body.cashName
            }
            this.wayState = data.body.cashMethodState
          }
        }
      )
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.POST(
            '/finance/cashMethod/add',
            this.form,
            data => {
              if (data.code == 1001) {
                this.$message({
                  message: '提交成功！等待审核~',
                  type: 'success'
                })
              }
            }
          )
        } else {
          return false
        }
      })
    },
    getList(page, size) {
      this.POST(
        '/finance/cash/myCashPage',
        {
          pageNum: page || 1,
          pageSize: size || 10
        },
        data => {
          this.dataList = data.body.records
          this.page = data.body.current
          this.size = data.body.size
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
    cash() {
      if (!this.cashform.money) {
        this.$message.error('请输入提现金额！')
        return
      }
      var _this = this
      _this.$confirm('确认提现吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.POST(
          '/finance/cash/add',
          this.cashform,
          data => {
            if (data.code == 1001) {
              this.$message({
                message: '申请成功！等待审核~',
                type: 'success'
              })
              this.dialogVisible = false
              this.getList()
            }
          }
        )
      })
    }
  }
}
</script>

<style lang="scss">
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
