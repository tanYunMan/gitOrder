<template>
  <div class="container menu2-1-container">
    <div class="filter-wrap">
      <span>查询关键字：</span>

      <el-date-picker  style="width:180px"  value-format="yyyy-MM-dd" v-model="queryParams.recordTime" type="date"  placeholder="统计日期" > </el-date-picker>
      <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
    </div>
    <div class="recevie-wrap">
      <el-table border row-key="id" ref="multipleTable" v-loading="loading" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" size="mini" :cell-style="{'text-align':'center'}">
        <!--  <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column> -->
        <!-- <el-table-column :show-overflow-tooltip="true" label="站点"  >
          <template slot-scope="scope">
            <span>{{scope.row.site.siteName}}（{{scope.row.site.siteID}}）</span>
          </template>
        </el-table-column> -->
         <el-table-column :show-overflow-tooltip="true" prop="money" label="余额"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="frozenMoney" label="冻结资金"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="rechargeMoney" label="充值金额"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="siteMoney" label="站点总余额"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="recordTime" label="统计日期" ></el-table-column>
       
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getList,getLists,getData } from '@/api/common'
import request from '@/utils/request'
export default {
  data() {
    return {
      type:1,
      color:'#333',
      form:{},
      dialog1:false,
      currentPage:1,
      tableData: [],
      showInfoForm: [],//详情
      total:0,
      queryParams:{
        pageNum:1,
        pageSize:20,
      },
      options: [{//支付状态
          value: '0',
          label: '等待支付'
        }, {
          value: '1',
          label: '支付失败'
        }, {
          value: '2',
          label: '支付成功'
        }, {
          value: '3',
          label: '退款'
      }],
      loading: true,
      rechargeModeList: [],//支付方式
      multipleSelection: []
    }
  },
  components: {
    Tinymce
  },
  methods: {
    // 客户充值记录列表
    getList() {
      if(!this.queryParams.paySn){
        delete this.queryParams.paySn
      }
       const form = Object.assign({}, this.queryParams, {})
       this.POST(
        '/finance/platformDayMoney/page',
        form,
        data => {
         this.tableData = data.body.records
        this.total = data.body.total
        this.loading = false
        }
      )
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getList();
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },


    // 清空筛查条件
    setValueNull(val){
      if(val === 1){
        delete this.queryParams.payState
      }else if(val === 2){
        delete this.queryParams.rechargeModeID
      }
    },

    // 获取充值方式
    getRechargeMode() {
      getLists({},'/finance/rechargeMode/page').then(res => {
        this.rechargeModeList = res.body.records
      }).catch(err => {
        
      })
    },

    // 查看详情
    showInfo(data) {
      //console.log(data,55)
      this.dialog1 = true
      this.showInfoForm = data
    }
    
  },
  created() {
    this.getList();
    this.getRechargeMode();
  },
}
</script>
<style lang="scss">
.menu2-1-container {
  .dialog1 {
    .el-dialog__body {
      overflow: auto;
      max-height:700px;
    }
    .el-input {
      width:400px;
    }
  }
}
</style>
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

