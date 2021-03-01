<template>
  <div class="container menu8-1-container app-container">

    <el-form :inline="true">
      <el-form-item label="订单编号">
        <el-input v-model="serchForm.orderCode" placeholder="请输入订单编号" clearable size="small" />
      </el-form-item>
      <el-form-item label="商品名称">
        <el-input v-model="serchForm.goodsName" placeholder="请输入商品名称" clearable size="small" />
      </el-form-item>
      <el-form-item label="商品类型">
        <el-input v-model="serchForm.goodsTypeName" placeholder="请输入商品类型" clearable size="small" />
      </el-form-item>
      <el-form-item label="卡号卡密">
        <el-input v-model="serchForm.cardNumber" placeholder="请输入卡号或卡密" clearable size="small" />
      </el-form-item>
      <el-form-item label="销售类型">
        <el-select v-model="serchForm.saleType" size="small" filterable placeholder="请选择销售类型" clearable>
          <el-option value="1" label="平台销售">平台销售</el-option>
          <el-option value="2" label="对接销售">对接销售</el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="userType == 1" label="平台">
        <!-- <el-input v-model="serchForm.platformID" placeholder="请输入平台ID" clearable size="small"></el-input> -->
        <el-select v-model="serchForm.platformID" style="width:250px" size="small" placeholder="请选择平台" clearable>
          <el-option
            v-for="item in platformList"
            :key="item.platformID"
            :label="item.platformName"
            :value="item.platformID"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="userType == 2" label="站点ID">
        <el-input v-model="serchForm.siteID" placeholder="请输入站点ID" clearable size="small" />
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="time"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          size="small"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click.stop="getList()">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="dataList" style="width: 100%;margin-top:30px;" border size="mini">
      <el-table-column align="center" label="订单编号" prop="orderCode" min-width="200px" />
      <el-table-column align="center" label="商品名称" prop="goodsName" min-width="400px" />
      <el-table-column align="center" label="商品类型" prop="goodsTypeName" min-width="140px" />
      <el-table-column prop="supplierName" align="center" label="订单状态" min-width="100px">
        <template slot-scope="scope">
          <span :style="orderStateColor(scope.row.orderState)">{{ orderState(scope.row.orderState) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="goodsUserName" label="购买客户" min-width="180px" />
      <el-table-column align="center" label="创建时间" prop="createTime" min-width="180px" />
      <el-table-column align="center" label="订单金额" prop="orderPrice" min-width="140px" />
      <el-table-column align="center" label="销售类型" prop="saleType" min-width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.saleType == 1 ? '平台销售' : '对接销售' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="140px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-search" @click="orderInfo(scope.row.orderID)">订单详情</el-button>
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
    <!-- 查看详情-->
    <el-dialog title="订单详情记录" :visible.sync="dialog1" width="60%" class="dialog1" @closed="closeOrderInfo">
      <div class="tab-wrap" style="margin-bottom:20px;">
        <a to="sub1" :class="{'active':orderType == 1}" @click="orderType = 1">订单基本信息</a>
        <a v-if="dataInfo.length>0 && dataInfo[0].orderState<5" to="sub1" :class="{'active':orderType == 2}" @click="orderType = 2">订单处理</a>
        <a to="sub1" :class="{'active':orderType == 3}" @click="orderType = 3">金额明细</a>
        <a v-if="dataInfo.length>0 && dataInfo[0].orderState==5" to="sub1" :class="{'active':orderType == 4}" @click="orderType = 4">退款明细</a>
        <a to="sub1" :class="{'active':orderType == 6}" @click="orderType = 6">商务资金明细</a>
      </div>
      <div v-for="(value,index) in dataInfo" v-show="orderType == 1" :key="index" class="order-type order-type1">
        <div class="item">
          <el-alert title="订单信息" type="success" :closable="false" />
          <ul>
            <li>
              <span class="label">订单编号：</span>
              <span class="val">{{ value.orderCode }}</span>
            </li>
            <li>
              <span class="label">提交时间：</span>
              <span class="val">{{ value.createTime }}</span>
            </li>
            <li v-if="value.dealTime">
              <span class="label">处理时间：</span>
              <span class="val">{{ value.dealTime }}</span>
            </li>
            <li v-if="value.takeUpTime">
              <span class="label">订单处理耗时：</span>
              <span class="val">{{ value.takeUpTime }}</span>
            </li>
            <li>
              <span class="label">订单状态：</span>
              <span class="val" style="color:#409EFF">{{ value.orderState === 1 ? "未处理" : value.orderState === 2 ? "处理中" : value.orderState === 3 ? "处理完毕" : value.orderState === 4 ? "投诉中" : value.orderState === 5 ? "已退款" : value.orderState === 6 ? "已关闭" : '异常订单' }}</span>
            </li>
          </ul>
        </div>
        <div v-if="value.supplierName || value.supplierID" class="item">
          <el-alert title="供货方" type="success" :closable="false" />
          <ul>
            <li>
              <span v-if="value.supplierName" class="label">订单供货方：</span>
              <span class="val">{{ value.supplierName }}</span>
            </li>
            <li>
              <span v-if="value.supplierID" class="label">供货商编号：</span>
              <span class="val">{{ value.supplierID }}</span>
            </li>
          </ul>
        </div>
        <div class="item">
          <el-alert title="商品信息" type="success" :closable="false" />
          <ul v-for="(item,orderCardIndex) in value.orderCardVOList" :key="orderCardIndex">
            <li>
              <span class="label">商品名称：</span>
              <span class="val">{{ item.goodsName }}</span>
            </li>
            <li>
              <span class="label">售价：</span>
              <span class="val">{{ item.salePrive }}元</span>
            </li>
          </ul>
        </div>
        <div class="item">
          <el-alert title="客户信息" type="success" :closable="false" />
          <ul>
            <li>
              <span class="label">购买客户：</span>
              <span class="val">{{ value.goodsUserName }}</span>
            </li>
            <li>
              <span v-if="value.goodsUserAddr" class="label">客户详细：</span>
              <span class="val">{{ value.goodsUserAddr }}</span>
            </li>
            <li>
              <span v-if="value.userMoneyDetail&&value.userMoneyDetail.remark" class="label">备注：</span>
              <span class="val">{{ value.dataInfo&&value.userMoneyDetail.remark }}</span>
            </li>
          </ul>
        </div>
        <div class="item">
          <el-alert title="商品详细及结果" type="success" :closable="false" />
          <ul v-for="(item,orderCardIndex1) in value.orderCardVOList" :key="orderCardIndex1">
            <li>
              <span class="label">卡号：</span>
              <span class="val">{{ item.cardNumber }}</span>
            </li>
            <li v-if="item.cardPws">
              <span class="label">密码：</span>
              <span class="val">{{ item.cardPws }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div v-show="orderType == 2" class="order-type order-type2">
        <el-form ref="form" :model="form" label-width="140px">
          <el-form-item label="退款类型：" prop="refundType" :rules="[{ required: true, message: '请选择退款类型', trigger: 'blur' }]">
            <el-radio-group v-model="form.refundType">
              <el-radio :label="1">全退</el-radio>
              <el-radio :label="2">按张退</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            v-if="form.refundType==2"
            label="张数："
            prop="num"
            :rules="[{ required: true, message: '请输入退款张数', trigger: 'blur' }]"
          >
            <el-input-number v-model="form.num" class="el-class-number" size="mini" controls-position="right" :min="1" :precision="0" /><span> 张</span>
          </el-form-item>

          <el-form-item label="">
            <el-button type="primary" :loading="loading" @click="confirmRefund('form')">确认处理</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="orderType == 3" class="order-type order-type3">
        <el-table ref="multipleTable" border row-key="id" :data="tableMoneyData" style="width: 100%" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" @selection-change="handleSelectionChange">
          <el-table-column prop="orderID" label="订单号" />
          <el-table-column prop="label2" label="交易类型">
            <template slot-scope="scope">
              <span v-if="scope.row.transactionType">{{ transactionType(scope.row.transactionType) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="paySn" label="商户号" />
          <el-table-column prop="money" label="交易金额" />
          <el-table-column prop="beforeMoney" label="交易前(元)" />
          <el-table-column prop="endMoney" label="交易后(元)" />
          <el-table-column prop="createTime" label="交易日期" />
        </el-table>
      </div>
      <div v-show="orderType == 4" class="order-type order-type4">
        <el-table ref="multipleTable" border row-key="id" :data="tableRefundData" style="width: 100%" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" @selection-change="handleSelectionChange">
          <el-table-column prop="money" label="退款金额" />
          <el-table-column prop="label2" label="退款类型">
            <template slot-scope="scope">
              <span>{{ scope.row.operType===1 ? '本地退款' : scope.row.operType===2 ? '供货商退款' : '对接退款' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="label2" label="操作类型">
            <template slot-scope="scope">
              <span>{{ scope.row.refundType===1 ? '全退' : '按张退' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="orderType == 5" class="order-type order-type5">
        <el-table ref="multipleTable" border row-key="id" :data="dataList" style="width: 100%" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" @selection-change="handleSelectionChange">
          <el-table-column prop="label1" label="销售额" />
          <el-table-column prop="label2" label="销售提成" />
          <el-table-column prop="label3" label="手续费" />
          <el-table-column prop="label1" label="入账金额" />
          <el-table-column prop="label2" label="退款额" />
          <el-table-column prop="label3" label="进货额" />
        </el-table>
      </div>
      <div v-show="orderType == 6" class="order-type order-type6">
        <el-table ref="multipleTable" border row-key="id" :data="tableSiteMoneyData" style="width: 100%" :header-cell-style="{background:'#f5f5f5',color:'#606266'}">
          <el-table-column prop="orderID" label="订单号" />
          <el-table-column prop="label2" label="交易类型">
            <template slot-scope="scope">
              <span v-if="scope.row.transactionType">{{ siteMoneyType(scope.row.transactionType) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="money" label="交易金额" />
          <el-table-column prop="beforeMoney" label="变化前(元)" />
          <el-table-column prop="endMoney" label="变化后(元)" />
          <el-table-column prop="createTime" label="交易日期" />
        </el-table>
      </div>
    </el-dialog>
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
      platformList: [],
      serchForm: {
        orderCode: '',
        goodsName: '',
        goodsTypeName: '',
        cardNumber: '',
        saleType: '',
        beginTime: '',
        endTime: '',
        platformID: '',
        siteID: ''
      },
      time: [],
      userType: '',
      orderType: 1,
      form: {},
      tableMoneyData: [],
      tableRefundData: [],
      tableSiteMoneyData: [],
      dialog1: false,
      loading: false,
      dataInfo: []

    }
  },
  mounted() {
    this.getList()
    this.userType = this.Read('userType')
    if(this.userType === 1){
       this.getPlatformList()
    }
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
        '/order/order/orderPage',
        form,
        data => {
          this.dataList = data.body.records
          this.size = data.body.size
          this.page = data.body.current
          this.total = data.body.total
        }
      )
    },
    getPlatformList(page, size) {
      this.POST(
        '/platform/platform/page',
        {
          pageSize: 1,
          pageNum: 999
        },
        data => {
          this.platformList = data.body.records
        }
      )
    },
    handleChange(val) {
      if (val) {
        this.serchForm.beginTime = val[0]
        this.serchForm.endTime = val[1]
      } else {
        this.serchForm.beginTime = ''
        this.serchForm.endTime = ''
      }
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
    // 订单状态--颜色
    orderStateColor(type) {
      switch (type) {
        case 0:
          return 'color:#e6a23c'
          break
        case 1:
          return 'color:#409eff'
          break
        case 2:
          return 'color:#e6a23c'
          break
        case 3:
          return 'color:#67c23a'
          break
        case 4:
          return 'color:#909399'
          break
        case 5:
          return 'color:#f56c6c'
          break
        case 6:
          return 'color:#909399'
          break
        default:
          return 'color:#909399'
      }
    },
    // 订单状态
    orderState(type) {
      switch (type) {
        case 0:
          return '待支付'
          break
        case 1:
          return '未处理'
          break
        case 2:
          return '处理中'
          break
        case 3:
          return '处理完毕'
          break
        case 4:
          return '投诉中'
          break
        case 5:
          return '已退款'
          break
        case 6:
          return '已关闭'
          break
        default:
          return '未知'
      }
    },
    // 交易类型
    siteMoneyType(type) {
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
          return '未知'
      }
    },
    // 交易类型
    transactionType(type) {
      switch (type) {
        case 1:
          return '订单扣款'
          break
        case 2:
          return '订单退款'
          break
        case 3:
          return '充值到账'
          break
        case 4:
          return '前台加款'
          break
        case 5:
          return '前台减款'
          break
        case 6:
          return '管理员加款'
          break
        case 7:
          return '管理员减款'
          break
        default:
          return '未知'
      }
    },

    // 关闭弹窗
    closeOrderInfo() {
      this.orderType = 1
      this.form = {}
      this.tableMoneyData = []
      this.tableRefundData = []
      this.tableSiteMoneyData = []
    },

    // 查看订单详情
    orderInfo(id) {
      // getData({orderID:id},'/order/order/orderDetails').then(res => {
      //     if (res.code===1001){
      //     //this.dataInfo = [res.body]
      //     this.$set(this.dataInfo,0,res.body)
      //     this.tableMoneyData = res.body.userMoneyDetails
      //     this.tableRefundData = res.body.orderRefund ? [res.body.orderRefund] : []
      //     this.tableSiteMoneyData = res.body.siteMoneyDetails
      //     this.dialog1 = true
      //     }
      // }).catch(err => {

      // })

      this.GET(
        '/order/order/orderDetails',
        { orderID: id },
        res => {
          if (res.code === 1001) {
            // this.dataInfo = [res.body]
            this.$set(this.dataInfo, 0, res.body)
            this.tableMoneyData = res.body.userMoneyDetails
            this.tableRefundData = res.body.orderRefund ? [res.body.orderRefund] : []
            this.tableSiteMoneyData = res.body.siteMoneyDetails
            this.dialog1 = true
          }
        }
      )
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 确认退款
    confirmRefund(formName) {
      this.loading = true
      const orderID = this.dataInfo[0].orderID
      if (!orderID) {
        this.$message({
          showClose: true,
          message: '订单异常，请联系客服',
          type: 'error'
        })
        return null
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let payload
          if (this.form.refundType == 1) {
            payload = { orderID: orderID, refundType: this.form.refundType }
          } else {
            payload = { orderID: orderID, ...this.form }
          }
          this.POST('/order/order/orderRefund',payload,
            res => {
              if (res.code === 1001) {
                  this.$message({
                    showClose: true,
                    message: res.msg,
                    type: 'error'
                  })
                  this.loading = false
              }
            }
          )

          // getList({ ...payload }, '/order/order/orderRefund').then(res => {
          //   if (res.code === 1001) {
          //     this.$message({
          //       showClose: true,
          //       message: res.msg,
          //       type: 'success'
          //     })
          //     this.form = {}
          //     this.orderInfo(orderID)
          //     this.orderType = 1
          //     this.getList()
          //   } else {
          //     this.$message({
          //       showClose: true,
          //       message: res.msg,
          //       type: 'error'
          //     })
          //   }
          //   this.loading = false
          // }).catch(err => {
          //   this.loading = false
          // })
        } else {
          this.loading = false
          return false
        }
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
<style lang="scss">

.el-hidden-tc {
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  width: 100%;
  border: none;
}

.el-class-number .el-input .el-input__inner{
  width: 130px;
}

.menu8-1-container {
  .tips {
    color:#909399;
    font-size:12px;
    line-height:20px;
    width:400px;
    margin-left:10px;
  }
  .dialog1 {
    .el-dialog__body {
      overflow: auto;
      max-height:700px;
    }

    .el-input {
      width:400px;
    }
    .el-pagination {
      .el-input {
        width:50px;
      }
    }
    .order-type1 {
      .item {
        margin-top:20px;
      }
      li {
        display:flex;
        padding:8px 0;
        // align-items: center;
        .label {
          font-weight: bold;
          margin-right:10px;
          width:120px;
          text-align: right;
        }
        .val {
          flex:1;
          font-size:14px;

        }
      }
    }
  }
}
</style>
<style scoped lang="scss">
.container {
  padding:20px;
  .tab-wrap {
    border-bottom:1px solid #ddd;
    a {
        padding:5px;
        display: inline-block;
        margin: 0 5px;
      &.active {
        border-bottom:2px solid #409eff
      }
    }
  }
  .filter-wrap {
    margin-top:20px;
    .el-input,.el-select {
      width:130px;
    }
  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom:20px;
  }

}
</style>
