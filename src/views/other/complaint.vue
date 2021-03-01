<template>
  <div class="container menu8-4-container">
    <div class="filter-wrap">
      <span>查询信息：</span>
      <el-input v-if="this.userType == 1" v-model="queryParams.platformName" placeholder="请输入平台信息" style="width:200px;" size="small"/>
      <el-input v-model="queryParams.siteName" placeholder="请输入站点信息" style="width:200px;" size="small"/>
      <el-input v-model="queryParams.ThemeName" placeholder="请输入投诉主题" style="width:200px;" size="small" />
      <el-select v-model="queryParams.ComplaintState" placeholder="请选择投诉状态" style="width:200px;" size="small" clearable @clear="setValueNull(1)">
        <el-option v-for="item in complaintStateList" :key="item.id" :label="item.value" :value="item.id" />
      </el-select>
      
      <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
    </div>
    <el-table ref="multipleTable" border row-key="id" :data="tableData" style="width: 100%" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" size="mini" :cell-style="{'text-align':'center'}" @selection-change="handleSelectionChange">
      <el-table-column :show-overflow-tooltip="true" type="selection" />
      <el-table-column v-if="this.userType == 1" :show-overflow-tooltip="true" prop="platformID,platformName" label="平台名称（平台编号）" >
           <template slot-scope="scope">
            <span>{{scope.row.platformName}}（{{scope.row.platformID}}）</span>
        </template>

      </el-table-column>
       <el-table-column :show-overflow-tooltip="true" prop="siteID,siteName" label="站点名称（站点编号）" >
           <template slot-scope="scope">
            <span>{{scope.row.siteName}}（{{scope.row.siteID}}）</span>
        </template>

      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="themeName" label="投诉主题" />
     
      <el-table-column :show-overflow-tooltip="true" prop="userName" label="投诉客户" />
      <el-table-column :show-overflow-tooltip="true" prop="goodsType" label="商品类型">
        <template slot-scope="scope">
          <span v-if="scope.row.goodsType===1">卡密</span>
          <span v-else>充值</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="goodsType" label="订单号">
        <template slot-scope="scope">
          <span><a type="primary" style="color:#409eff" @click="orderInfo(scope.row.orderID)">{{ scope.row.order && scope.row.order.orderCode }}</a></span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="type" label="销售类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type===1">平台销售</span>
          <span v-else>对接销售</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="投诉时间" />
      <el-table-column :show-overflow-tooltip="true" prop="label10" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.complaintState===1" type="text" size="mini" @click="lookComplaint(scope.row)">未处理</el-button>
          <el-button v-else-if="scope.row.complaintState===2" type="text" size="mini" @click="lookComplaint(scope.row)">处理中</el-button>
          <el-button v-else type="text" size="mini" @click="lookComplaint(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <!-- 投诉详情 -->
    <el-dialog title="投诉详情信息" :visible.sync="dialog1" width="60%" class="dialog1 detail-warp" :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="类型：">
          <div>{{ complaintInfo.complaintStatecontent }}</div>
        </el-form-item>
        <el-form-item label="投诉客户：">
          <div>{{ complaintInfo.userName }}</div>
        </el-form-item>
        <el-form-item label="投诉时间：">
          <div>{{ complaintInfo.createTime }}</div>
        </el-form-item>
        <el-form-item label="投诉主题：">
          <div>{{ complaintInfo.themeName }}</div>
        </el-form-item>
        <el-form-item label="订单号：">
          <div>{{ complaintInfo.order && complaintInfo.order.orderCode }}</div>
        </el-form-item>
        <el-form-item label="内容：">
          <el-table ref="multipleTable" border row-key="id" :data="tableDatalist" style="width: 100%" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" size="mini" :cell-style="{'text-align':'center'}" @selection-change="handleSelectionChange">
            <!--  <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column> -->
            <el-table-column :show-overflow-tooltip="true" prop="complaintType" label="对象">
              <template slot-scope="scope">
                <span v-if="scope.row.complaintType===1">购买方</span>
                <span v-else-if="scope.row.complaintType===2">销售方</span>
                <span v-else-if="scope.row.complaintType===3">平台方</span>
                <span v-else-if="scope.row.complaintType===4">经营方</span>
                <span v-else>未知</span>
              </template>
            </el-table-column>

            <el-table-column :show-overflow-tooltip="true" prop="content" label="内容" />
            <el-table-column :show-overflow-tooltip="true" prop="replyTime" label="时间" />
          </el-table>
        </el-form-item>
        <el-form-item label="回复内容：" class="mt10">
          <el-input v-model="form.content" type="textarea" :rows="5" placeholder="请输入回复内容" />
        </el-form-item>
        <!--<el-form-item label="快捷回复：">
          <el-select v-model="form.type" placeholder="请选择">
          </el-select>
        </el-form-item>-->
        <el-form-item label="类型：">
          <el-radio-group v-model="form.complaintState">
            <!-- <el-radio label="1">未处理</el-radio> -->
            <el-radio label="2">处理中</el-radio>
            <el-radio label="3">处理完</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog1 = false">取 消</el-button>
        <el-button type="primary" @click="release">发 布</el-button>
      </span>
    </el-dialog>

    <!-- 查看详情-->
    <el-dialog title="订单详情记录" :visible.sync="dialog2" class="dialog2 wl-dialog-style" @closed="closeOrderInfo">
      <div class="tab-wrap" style="margin-bottom:20px;">
        <a to="sub1" :class="{'active':orderType == 1}" @click="orderType = 1">订单基本信息</a>
        <a v-if="dataInfo.length>0 && dataInfo[0].orderState<5" to="sub1" :class="{'active':orderType == 2}" @click="orderType = 2">订单处理</a>
        <a to="sub1" :class="{'active':orderType == 3}" @click="orderType = 3">金额明细</a>
        <a v-if="dataInfo.length>0 && dataInfo[0].orderState==5" to="sub1" :class="{'active':orderType == 4}" @click="orderType = 4">退款明细</a>
        <!-- <a to="sub1" :class="{'active':orderType == 5}" @click="orderType = 5">销售明细</a>-->
        <a to="sub1" :class="{'active':orderType == 6}" @click="orderType = 6">商务资金明细</a>
      </div>
      <div v-for="value in dataInfo" v-show="orderType == 1" class="order-type order-type1">
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
            <!-- <li>
              <span class="label">退款记录：</span>
              <span class="val">无退款记录</span>
            </li> -->
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
          <ul v-for="item in value.orderCardVOList">
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
              <span class="val">{{ value.userMoneyDetail&&value.userMoneyDetail.remark }}</span>
            </li>
          </ul>
        </div>
        <!-- <div class="item">
          <el-alert title="充值信息" type="success" :closable="false"></el-alert>
        </div> -->
        <!-- <div class="item">
          <el-alert title="处理信息" type="success" :closable="false"></el-alert>
          <ul>
            <li>
              <span class="label">处理人：</span>
              <span class="val">自动发货</span>
            </li>
            <li>
              <span class="label">充值信息：</span>
              <span class="val">。。。。。</span>
            </li>
          </ul>
        </div> -->
        <div class="item">
          <el-alert title="商品详细及结果" type="success" :closable="false" />
          <ul v-for="item in value.orderCardVOList">
            <li>
              <span class="label">卡号：</span>
              <span class="val">{{ item.cardNumber }}</span>
            </li>
            <li v-if="item.cardPws">
              <span class="label">密码：</span>
              <span class="val">{{ item.cardPws }}</span>
            </li>
            <!-- <li>
              <span class="label">赠品/矩阵：</span>
              <span class="val">永久有效</span>
            </li>
            <li>
              <span class="label">导卡时间：</span>
              <span class="val">	2019-11-20 08:35</span>
            </li> -->
          </ul>
        </div>
      </div>
      <div v-show="orderType == 2" class="order-type order-type2">
        <el-form ref="form1" :model="form1" label-width="140px">
          <el-form-item label="退款类型：" prop="refundType" :rules="[{ required: true, message: '请选择退款类型', trigger: 'blur' }]">
            <el-radio-group v-model="form1.refundType">
              <el-radio :label="1">全退</el-radio>
              <el-radio :label="2">按张退</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="form1.refundType==2" label="张数：" prop="num" :rules="[{ required: true, message: '请输入退款张数', trigger: 'blur' }]">
            <el-input-number v-model="form1.num" class="el-class-number" size="mini" controls-position="right" :min="1" :precision="0" /><span> 张</span>
          </el-form-item>

         
          <el-form-item label="">
            <el-button type="primary" :loading="loading" @click="confirmRefund('form1')">确认处理</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="orderType == 3" class="order-type order-type3">
        <el-table ref="multipleTable" border row-key="id" :data="tableMoneyData" style="width: 100%" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" @selection-change="handleSelectionChange">
          <el-table-column :show-overflow-tooltip="true" prop="orderID" label="订单号" />
          <el-table-column :show-overflow-tooltip="true" prop="label2" label="交易类型">
            <template slot-scope="scope">
              <span v-if="scope.row.transactionType">{{ transactionType(scope.row.transactionType) }}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="paySn" label="商户号" />
          <el-table-column :show-overflow-tooltip="true" prop="money" label="交易金额" />
          <el-table-column :show-overflow-tooltip="true" prop="beforeMoney" label="交易前(元)" />
          <el-table-column :show-overflow-tooltip="true" prop="endMoney" label="交易后(元)" />
          <el-table-column :show-overflow-tooltip="true" prop="createTime" label="交易日期" />
        </el-table>
      </div>
      <div v-show="orderType == 4" class="order-type order-type4">
        <el-table ref="multipleTable" border row-key="id" :data="tableRefundData" style="width: 100%" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" @selection-change="handleSelectionChange">
          <el-table-column :show-overflow-tooltip="true" prop="money" label="退款金额" />
          <el-table-column :show-overflow-tooltip="true" prop="label2" label="退款类型">
            <template slot-scope="scope">
              <span>{{ scope.row.operType===1 ? '本地退款' : scope.row.operType===2 ? '供货商退款' : '对接退款' }}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="label2" label="操作类型">
            <template slot-scope="scope">
              <span>{{ scope.row.refundType===1 ? '全退' : '按张退' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="orderType == 5" class="order-type order-type5">
        <el-table ref="multipleTable" border row-key="id" :data="tableData" style="width: 100%" :header-cell-style="{background:'#f5f5f5',color:'#606266'}" @selection-change="handleSelectionChange">
          <el-table-column :show-overflow-tooltip="true" prop="label1" label="销售额" />
          <el-table-column :show-overflow-tooltip="true" prop="label2" label="销售提成" />
          <el-table-column :show-overflow-tooltip="true" prop="label3" label="手续费" />
          <el-table-column :show-overflow-tooltip="true" prop="label1" label="入账金额" />
          <el-table-column :show-overflow-tooltip="true" prop="label2" label="退款额" />
          <el-table-column :show-overflow-tooltip="true" prop="label3" label="进货额" />
        </el-table>
      </div>
      <div v-show="orderType == 6" class="order-type order-type6">
        <el-table ref="multipleTable" border row-key="id" :data="tableSiteMoneyData" style="width: 100%" :header-cell-style="{background:'#f5f5f5',color:'#606266'}">
          <el-table-column :show-overflow-tooltip="true" prop="orderID" label="订单号" />
          <el-table-column :show-overflow-tooltip="true" prop="label2" label="交易类型">
            <template slot-scope="scope">
              <span v-if="scope.row.transactionType">{{ siteMoneyType(scope.row.transactionType) }}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="money" label="交易金额" />
          <el-table-column :show-overflow-tooltip="true" prop="beforeMoney" label="变化前(元)" />
          <el-table-column :show-overflow-tooltip="true" prop="endMoney" label="变化后(元)" />
          <el-table-column :show-overflow-tooltip="true" prop="createTime" label="交易日期" />
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderType: 1,
      tableMoneyData: [], // 资金详情
      tableRefundData: [], // 退款详情
      tableSiteMoneyData: [], // 商务资金明细
      loading: false,
      dataInfo: [],
      color: '#333',
      form1: {},
      form: {
        complaintState: '',
        content: ''
      },
      dialog1: false,
      dialog2: false,
      currentPage: 1,
      checkList: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },

      complaintStateList: [
        { id: 1, value: '未处理' },
        { id: 2, value: '已受理' },
        { id: 3, value: '处理完毕' }
      ],
      tableData: [],
      tableDatalist: [],
      multipleSelection: [],
      complaintInfo: [],
      platformList:[],
      userType:-1

    }
  },
  mounted() {
    this.getList(),
    this.userType = this.Read('userType')
    console.log(this.userType)
    if(this.userType == 1){
       this.getPlatformList()
    }
  },
  methods: {
    // 查看订单详情
    orderInfo(id) {
      this.GET('/order/order/orderDetails',{orderID:id},
      res =>{
        if (res.code === 1001) {
         
          // this.dataInfo = [res.body]
          this.$set(this.dataInfo, 0, res.body)
          this.tableMoneyData = res.body.userMoneyDetails
          this.tableRefundData = res.body.orderRefund ? [res.body.orderRefund] : []
          this.tableSiteMoneyData = res.body.siteMoneyDetails
          this.form1 = { refundType: 1 }
          this.dialog2 = true
        }
      })
    },
    // 关闭弹窗
    closeOrderInfo() {
      this.orderType = 1
      this.form1 = {}
      this.tableMoneyData = []
      this.tableRefundData = []
      this.tableSiteMoneyData = []
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
          if (this.form1.refundType === 1) {
            payload = { orderID: orderID, refundType: this.form1.refundType }
          } else {
            payload = { orderID: orderID, ...this.form1 }
          }
          this.POST('/order/order/orderRefund',{ ...payload },
           res=>{
            if (res.code === 1001) {
              this.$message({
                showClose: true,
                message: res.msg,
                type: 'success'
              })
              this.form = {}
              this.orderInfo(orderID)
              this.orderType = 1
              this.getList()
            } else {
              this.$message({
                showClose: true,
                message: res.msg,
                type: 'error'
              })
            }
            this.loading = false
          })
        }
      })
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

    // 获取订单投诉列表
    getList() {
      this.loading = true
      if (!this.queryParams.ThemeName|| this.queryParams.ThemeName == '') {
        delete this.queryParams.ThemeName
      }
      if (!this.queryParams.siteName|| this.queryParams.siteName == '') {
        delete this.queryParams.siteName
      }
      if (!this.queryParams.platformName|| this.queryParams.platformName == '') {
        delete this.queryParams.platformName
      }
      console.log(this.queryParams)
      this.POST( '/order/complaint/complaintPage',
      this.queryParams,
      res =>{
         console.log(res.msg)
        if (res.code === 1001) {
          res.body.records.map(item => {
            if (item.complaintState === 1) {
              item.complaintStatecontent = '未处理'
            } else if (item.complaintState === 2) {
              item.complaintStatecontent = '已处理'
            } else {
              item.complaintStatecontent = '处理完毕'
            }
          })
          this.tableData = res.body.records
          this.total = res.body.total
        }
      })
       this.loading = false
    },

    // 查看投诉内容
    lookComplaint(data) {
      this.POST('/order/complaintContent/page',
      {complaintID: data.complaintID},
      res=>{
         if (res.code === 1001) {
          this.tableDatalist = res.body.records
          this.complaintInfo = data
          this.dialog1 = true
          this.form.complaintState = data.complaintState
          this.form.content = ''
        }
      })
    },

    // 发布投诉内容
    release() {
      if (!this.form.content) {
        this.$message({
          message: '请输入投诉内容',
          type: 'error'
        })
        return
      }
      if (!this.form.complaintState) {
        this.$message({
          message: '请输入授理类型',
          type: 'error'
        })
        return
      }
      this.GET('/order/complaintContent/saveSeller',
      { complaintID: this.complaintInfo.complaintID, content: this.form.content, complaintState: this.form.complaintState },
      res=>{
        if (res.code === 1001) {
          this.$message({
            message: '回复成功',
            type: 'success'
          })
          this.tableDatalist = []
          this.complaintInfo = []
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
        this.dialog1 = false
        this.getList()
      })
    },

     getPlatformList() {
      this.GET(
        '/platform/platform/list',
        {
         
        },
        data => {
          this.platformList = data.body
        }
      )
    },

    // 清空筛查条件
    setValueNull(val) {
      if (val === 1) {
        delete this.queryParams.ComplaintState
      }
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
<style lang="scss">
.menu8-4-container {
  .dialog1 {
    .el-dialog__body {
      overflow: auto;
      max-height: 700px;
    }
    .el-input {
      // width:400px;
    }
  }
  .dialog2 {
    .el-dialog__body {
      overflow: auto;
      max-height: 700px;
    }

    .el-input {
      width: 400px;
    }
    .el-pagination {
      .el-input {
        width: 50px;
      }
    }
    .order-type1 {
      .item {
        margin-top: 20px;
      }
      li {
        display: flex;
        padding: 8px 0;
        // align-items: center;
        .label {
          font-weight: bold;
          margin-right: 10px;
          width: 120px;
          text-align: right;
        }
        .val {
          flex: 1;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
<style scoped lang="scss">
.container {
  padding: 20px;
  .tab-wrap {
    a {
      &.active {
        border-bottom: 2px solid #409eff;
      }
    }
  }
  .filter-wrap {
    margin-top: 20px;
    margin-bottom: 30px;
    .el-input,
    .el-select {
      width: 150px;
    }
  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom: 20px;
  }
}
</style>

