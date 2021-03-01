<template>
  <div class="app-container">

    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="客户资金" name="2">
        <el-form :inline="true">
          <el-form-item label="平台编号" v-show="userType == 1">
            <el-input v-model="siteForm.platformID" placeholder="请输入平台编号" clearable size="small" style="width:150px"/>
          </el-form-item>
          <el-form-item label="平台名称" v-show="userType == 1">
            <el-input v-model="siteForm.platformName" placeholder="请输入平台名称" clearable size="small" style="width:150px"/>
          </el-form-item>
          <el-form-item label="站点编号">
            <el-input v-model="siteForm.siteID" placeholder="请输入站点编号" clearable size="small" style="width:150px"/>
          </el-form-item>
          <el-form-item label="站点名称">
            <el-input v-model="siteForm.siteName" placeholder="请输入站点名称" clearable size="small" style="width:150px"/>
          </el-form-item>
          <el-form-item label="用户编号">
            <el-input v-model="siteForm.siteID" placeholder="请输入站点编号" clearable size="small" style="width:150px"/>
          </el-form-item>
          <el-form-item label="用户名称">
            <el-input v-model="siteForm.siteName" placeholder="请输入站点名称" clearable size="small" style="width:150px"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click.stop="getSiteList()">查询</el-button>
          </el-form-item>
        </el-form>
        <!-- <el-table :data="siteList" style="width: 100%;margin-top:30px;" border size="mini">
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
        </el-table> -->
        <el-table border row-key="id" ref="multipleTable" :data="siteList" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" v-loading="loading" size="mini" :cell-style="{'text-align':'center'}">
          <el-table-column :show-overflow-tooltip="true" prop="localUserID" label="客户编号"  ></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="userName" label="客户名称"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="money" label="客户余额" ></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="oldMoney" label="消费金额"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="frozenMoney" label="冻结资金"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="saleMoney" label="未转余额"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作"  fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="infoMoney(scope.row)">查看明细</el-button>
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
          :page-sizes="PageSizes"
          :page-size="PageSize"
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
    <!-- 详情 -->
    <el-dialog :title="thisDataInfo.userName + '--客户明细'" :visible.sync="dialog1"  class="wl-dialog-style dialog1">
        <el-table border row-key="id" ref="multipleTable" :data="tableDataUser" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" v-loading="loading" size="mini" :cell-style="{'text-align':'center'}">
         <el-table-column :show-overflow-tooltip="true" prop="localUserID" label="客户编号" width="80"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="userName" label="客户名称"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="transactionTypeName" label="交易类型" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="money" label="交易金额" width="100"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="beforeMoney" label="变化前（元）" width="100"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="endMoney" label="变化后（元）" width="100"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="createTime" label="交易日期"></el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChanges" @current-change="handleCurrentChanges" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="this.queryParamsUser.total || 0"> </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import { getLists } from '@/api/common'
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
      siteList: [],
      tableDataUser: [],// 客户资金明细
      siteForm: {
        siteID: '',
        siteName: ''
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
      thisDataInfo:{}, //当前查看的数据
      multipleSelection: [],
      rules: {
        money: [
          { required: true, message: '请输入冻结金额', trigger: 'blur' }
        ]
      },
      dialog1: false,
      loading: false,
      queryParamsUser: {
        pageNum:1,
        pageSize:20
      },
      queryParams:{
        pageNum:1,
        pageSize:20
      },
      currentPage:1,
      tableDataUser: []
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
    // 获取客户资金明细
    getUserList() {
      this.loading = true
      this.POST(
        '/finance/userMoneyDetail/detailPage',
        this.queryParams,
        res => {
          if (res.code===1001){
            this.tableDataUser = res.body.records
            this.queryParamsUser.total = res.body.total
          }
          this.loading = false
        }
      )
    },
    getSiteList(page, size) {
      const form = Object.assign({}, this.siteForm, {
        pageNum: page || 1,
        pageSize: size || 10
      })
      this.POST(
        '/finance/userMoney/moneyPage',
        form,
        data => {
          this.siteList = data.body.records
          this.tableData = data.body.records
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
    // 查看详情
    infoMoney(data){
      this.dialog1 = true
      
      this.thisDataInfo = {
        userName:data.userName || data.localUserID || '所属(' + data.platformName + ')'
      }
      this.queryParams.userID = data.userID
      this.queryParamsUser = {
        userID:data.userID
      }
      
      this.getUserList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChanges(val) {
      this.queryParamsUser.pageNum = val
      this.queryParams.pageNum = val
      this.getUserList()
    },
    // 客户资金明细
    handleSizeChanges(val) {
      this.queryParamsUser.pageSize = val
      this.queryParams.pageSize = val
      this.getUserList()
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
        this.detaiPage = val
        this.getDetailList(this.detaiPage, this.detaiSize)
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
