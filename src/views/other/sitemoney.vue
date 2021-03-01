<template>
  <div class="app-container">

    <el-tabs v-model="activeName" type="border-card">
      <!-- <el-tab-pane v-if="userType == 1" label="平台资金" name="1">
        <el-form :inline="true">
          <el-form-item label="平台编号">
            <el-input v-model="platformForm.platformID" placeholder="请输入平台编号" clearable size="small" />
          </el-form-item>
          <el-form-item label="平台名称">
            <el-input v-model="platformForm.platformName" placeholder="请输入平台名称" clearable size="small" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click.stop="getPlatformList()">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="PlatformList" style="width: 100%;margin-top:30px;" border size="mini">
          <el-table-column align="center" label="平台名称" prop="platformName" min-width="200px" />
          <el-table-column align="center" label="余额" prop="money" min-width="200px" />
          <el-table-column align="center" label="保证金" prop="bondMoney" min-width="200px" />
          <el-table-column align="center" label="冻结资金" prop="frozenMoney" min-width="200px" />
          <el-table-column align="center" label="管理员" prop="userName" min-width="200px" />
          <el-table-column align="center" label="操作" width="300px">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-search" @click="goDetail(scope.row.platformID,'platform')">余额明细</el-button>
              <el-button type="warning" size="mini" icon="el-icon-lock" @click="frozen(scope.row.platformID,'platform')">余额冻结</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination
            :current-page="PlatformPage"
            :page-sizes="PageSizes"
            :page-size="PageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="PlatformTotal"
            @size-change="handleSize($event,'Platform')"
            @current-change="handleCurrent($event,'Platform')"
          />
        </div>
      </el-tab-pane> -->
      <el-tab-pane label="站点资金" name="2">
        <el-form :inline="true">
          <el-form-item label="平台编号" v-show="userType == 1">
            <el-input v-model="siteForm.platformID" placeholder="请输入平台编号" clearable size="small" style="width:150px"/>
          </el-form-item>
          <el-form-item label="平台名称" v-show="userType == 1">
            <el-input v-model="siteForm.platformName" placeholder="请输入平台名称" clearable size="small" style="width:150px"/>
          </el-form-item>
          <el-form-item label="站点编号">
            <el-input v-model="siteForm.siteID" placeholder="请输入站点编号" clearable size="small" />
          </el-form-item>
          <el-form-item label="站点名称">
            <el-input v-model="siteForm.siteName" placeholder="请输入站点名称" clearable size="small" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click.stop="getSiteList()">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="siteList" style="width: 100%;margin-top:30px;" border size="mini">
          <el-table-column align="center" label="站点编号" prop="siteID" min-width="200px" />
          <el-table-column align="center" label="站点名称" prop="siteName" min-width="200px" />
          <el-table-column align="center" label="余额" prop="money" min-width="200px" />
          <el-table-column align="center" label="保证金" prop="bondMoney" min-width="200px" />
          <el-table-column align="center" label="冻结资金" prop="frozenMoney" min-width="200px" />
          <el-table-column align="center" label="管理员" prop="userName" min-width="200px" />
          <el-table-column align="center" label="操作" width="300px">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-search" @click="goDetail(scope.row.siteID,'site')">余额明细</el-button>
              <el-button type="warning" size="mini" icon="el-icon-lock" @click="frozen(scope.row.siteID,'site')">余额冻结</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination
            :current-page="sitePage"
            :page-sizes="PageSizes"
            :page-size="PageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="siteTotal"
            @size-change="handleSize($event,'site')"
            @current-change="handleCurrent($event,'site')"
          />
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      title="余额明细"
      :visible.sync="priceVisible"
      width="80%"
    >
      <el-table :data="detailList" style="width: 100%;margin-top:30px;" border size="mini">
        <el-table-column align="center" label="交易类型" prop="transactionType" min-width="120px">
          <template slot-scope="scope">
            <span>{{ renderType(scope.row.transactionType) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="交易金额" prop="money" min-width="100px" />
        <el-table-column align="center" label="变化前（元）" prop="beforeMoney" min-width="100px" />
        <el-table-column align="center" label="变化后（元）" prop="endMoney" min-width="100px" />
        <el-table-column align="center" label="交易日期" prop="createTime" min-width="180px" />
        <el-table-column align="center" label="操作" width="160px">
          <template slot-scope="scope">
            <el-button v-if="scope.row.transactionType === 8" type="warning" size="mini" icon="el-icon-unlock" @click="unfrozen(scope.row,type)">解冻金额</el-button>
            <span v-else>—</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-box">
        <el-pagination
          :current-page="detailPage"
          :page-size="detailSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="detailTotal"
          @size-change="handleSize($event,'detail')"
          @current-change="handleCurrent($event,'detail')"
        />
      </div>
    </el-dialog>

    <el-dialog width="50%" title="冻结余额" :visible.sync="dialogVisible">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="冻结金额" label-width="120px" prop="money">
          <el-input-number v-model="form.money" style="width:250px" size="small" :precision="2" :step="0.01" :min="0" />
        </el-form-item>
        <el-form-item label="内容" label-width="120px">
          <el-input
            v-model="form.remark"
            style="width:250px"
            size="small"
            type="textarea"
            :rows="4"
            placeholder="请输入备注信息"
          />
        </el-form-item>
        <el-form-item>
          <el-button size="small" style="float:right;margin-left:20px;" type="primary" @click="save('form')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: '2',
      PlatformList: [],
      PlatformTotal: 0,
      PlatformPage: 1,
      PlatformSize: 10,
      siteList: [],
      siteTotal: 0,
      sitePage: 1,
      siteSize: 10,
      platformForm: {
        platformID: '',
        platformName: ''
      },
      siteForm: {
        siteID: '',
        siteName: '',
        platformName: '',
        platformID: ''
      },
      userType: '',
      priceVisible: false,
      detailTotal: 0,
      detailPage: 1,
      detailSize: 10,
      detailList: [],
      type: '',
      detailId: '',
      dialogVisible: false,
      form: {
        money: null,
        remark: ''
      },
      frozenId: '',
      rules: {
        money: [
          { required: true, message: '请输入冻结金额', trigger: 'blur' }
        ]
      }

    }
  },
  watch: {
    dialogVisible() {
      if (!this.dialogVisible) {
        this.cancel()
      }
    }
  },
  mounted() {
    this.userType = this.Read('userType')
    if (this.userType == 1) {
      this.getPlatformList()
    } else {
      this.activeName = '2'
    }

    this.getSiteList()
  },
  methods: {
    getPlatformList(page, size) {
      const form = Object.assign({}, this.platformForm, {
        pageNum: page || 1,
        pageSize: size || 10
      })
      this.POST(
        '/finance/platformMoney/moneyPage',
        form,
        data => {
          this.PlatformList = data.body.records
          this.PlatformSize = data.body.size
          this.PlatformPage = data.body.current
          this.PlatformTotal = data.body.total
        }
      )
    },
    getSiteList(page, size) {
      const form = Object.assign({}, this.siteForm, {
        pageNum: page || 1,
        pageSize: size || 10
      })
      this.POST(
        '/finance/siteMoney/moneyPage',
        form,
        data => {
          this.siteList = data.body.records
          this.siteSize = data.body.size
          this.sitePage = data.body.current
          this.siteTotal = data.body.total
        }
      )
    },
    getDetailList(page, size) {
      let form
      if (this.type == 'platform') {
        form = Object.assign({}, {
          pageNum: page || 1,
          pageSize: size || 10,
          platformID: this.detailId
        })
      } else {
        form = Object.assign({}, {
          pageNum: page || 1,
          pageSize: size || 10,
          siteID: this.detailId
        })
      }
      this.POST(
        this.type == 'platform' ? '/finance/platMoneyDetail/detailPage' : '/finance/siteMoneyDetail/page',
        form,
        data => {
          this.detailList = data.body.records
          this.detailSize = data.body.size
          this.detailPage = data.body.current
          this.detailTotal = data.body.total
          this.priceVisible = true
        }
      )
    },
    goDetail(id, type) {
      this.type = type
      this.detailId = id
      this.getDetailList()
    },
    renderType(type) {
      switch (type) {
        case 1:
          return '客户充值'
          break
        case 2:
          return '对接收入'
          break
        case 3:
          return '对接收入退款'
          break
        case 4:
          return '对接支出'
          break
        case 5:
          return '对接支出退款'
          break
        case 6:
          return '站长提现'
          break
        case 7:
          return '站长充值'
          break
        case 8:
          return '投诉冻结'
          break
        case 9:
          return '投诉解冻'
          break
        default:
          return ''
      }
    },
    // 每页数量改变
    handleSize(val, type) {
      if (type === 'Platform') {
        this.PlatformSize = val
        this.PlatformPage = 1
        this.getPlatformList(this.PlatformPage, this.PlatformSize)
      } else if (type === 'site') {
        this.siteSize = val
        this.sitePage = 1
        this.getSiteList(this.sitePage, this.siteSize)
      } else {
        this.detailSize = val
        this.detailPage = 1
        this.getDetailList(this.detailPage, this.detailSize)
      }
    },
    // 当前页面改变
    handleCurrent(val, type) {
      if (type === 'Platform') {
        this.PlatformPage = val
        this.getPlatformList(this.PlatformPage, this.PlatformSize)
      } else if (type === 'site') {
        this.sitePage = val
        this.getSiteList(this.sitePage, this.siteSize)
      } else {
        this.detailPage = val
        this.getDetailList(this.detailPage, this.detailSize)
      }
    },
    frozen(rowId, type) {
      this.frozenId = rowId
      this.frozenType = type
      this.dialogVisible = true
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let form
          if (this.frozenType === 'platform') {
            form = Object.assign({}, this.form, { platformID: this.frozenId })
          } else {
            form = Object.assign({}, this.form, { siteID: this.frozenId })
          }
          this.POST(
            this.frozenType === 'platform' ? '/finance/platformMoney/frozenMoney' : '/finance/siteMoney/frozenMoney',
            form,
            data => {
              if (data.code == 1001) {
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
                this.getPlatformList()
                this.dialogVisible = false
                this.cancel()
              }
            }
          )
        } else {
          return false
        }
      })
    },
    cancel() {
      this.form = {
        money: '',
        remark: ''
      }
      this.$refs['form'].resetFields()
    },
    unfrozen(row, type) {
      var _this = this
      _this.$confirm('确定要解冻金额吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let form = {}
        if (type === 'platform') {
          form = Object.assign({}, form, {
            platformID: row.platformID,
            moneyDetailID: row.moneyDetailID
          })
        } else {
          form = Object.assign({}, form, {
            siteID: row.siteID,
            moneyDetailID: row.siteMoneyDetailID
          })
        }
        _this.POST(
          type === 'platform' ? '/finance/platformMoney/unfrozenMoney' : '/finance/siteMoney/unfrozenMoney',
          form,
          data => {
            if (data.code == 1001) {
              _this.$message({
                message: '操作成功！',
                type: 'success'
              })
              _this.getDetailList(_this.detailPage, _this.detailSize)
            }
          }
        )
      })
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
