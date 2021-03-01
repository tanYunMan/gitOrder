<template>
  <div class="container menu2-1-container">
    <div class="filter-wrap">
      <span>查询关键字：</span>
       <el-input v-model="queryParams.platformName" placeholder="请输入平台编号或名称" style="width:200px"></el-input>
        <el-input v-model="queryParams.siteName" placeholder="请输入站点编号或名称" style="width:200px"></el-input>
      <el-input v-model="queryParams.paySn" placeholder="请输入商户单号" style="width:200px"></el-input>

      <el-select v-model="queryParams.payState" placeholder="请选择支付状态" style="width:200px;" clearable @clear="setValueNull(1)">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <el-select v-model="queryParams.rechargeModeID" placeholder="请选择支付方式" style="width:200px;" clearable @clear="setValueNull(2)">
        <el-option
          v-for="item in rechargeModeList"
          :key="item.rechargeModeID"
          :label="item.rechargeName"
          :value="item.rechargeModeID">
        </el-option>
      </el-select>

      <el-date-picker v-show="type == 1" style="width:430px" value-format="yyyy-MM-dd" format="yyyy-MM-dd" @change="dataSearch" v-model="queryTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
      <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
    </div>
    <div class="recevie-wrap">
      <el-table border row-key="id" ref="multipleTable" v-loading="loading" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" size="mini" :cell-style="{'text-align':'center'}">
        <!--  <el-table-column :show-overflow-tooltip="true" type="selection" > </el-table-column> -->
        <el-table-column :show-overflow-tooltip="true" label="平台"  >
          <template slot-scope="scope">
            <span>{{scope.row.platform.platformName}}（{{scope.row.platform.platformID}}）</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="站点"  >
          <template slot-scope="scope">
            <span>{{scope.row.site.siteName}}（{{scope.row.site.siteID}}）</span>
          </template>
        </el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="userName" label="充值用户"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建时间"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="payTime" label="支付时间"  ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="reachTime" label="到账时间"></el-table-column>
        <!--  <el-table-column :show-overflow-tooltip="true" prop="payMoney" label="金额" ></el-table-column> -->
         <el-table-column :show-overflow-tooltip="true" prop="serviceMoney" label="手续费" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="payMoney" label="支付金额" ></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="rechargeName" label="支付方式" width="130"></el-table-column>
         <el-table-column :show-overflow-tooltip="true" prop="paySn" label="商户单号" width="220"></el-table-column>
        <!--  <el-table-column :show-overflow-tooltip="true" prop="payGateWay" label="支付网关" ></el-table-column> -->
        <!--  <el-table-column :show-overflow-tooltip="true" prop="userName" label="支付客户" ></el-table-column> -->
         <el-table-column :show-overflow-tooltip="true" prop="payState" label="支付状态" >
          <template slot-scope="scope">
              <span v-if="scope.row.payState===0">等待支付</span>
              <span v-else-if="scope.row.payState===1">支付失败</span>
              <span v-else-if="scope.row.payState===2">支付成功</span>
              <span v-else>退款</span>
          </template>
        </el-table-column>
        <!--  <el-table-column :show-overflow-tooltip="true" prop="remark" label="返回或处理备注" ></el-table-column> -->
         <el-table-column :show-overflow-tooltip="true" prop="label9" label="操作" align="center" width="100">
          <template slot-scope="scope">
            <a type="primary" style="color:#409eff" size="mini" @click="showInfo(scope.row)">查看</a>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>


    <!-- 详情 -->
    <el-dialog title="充值明细" :visible.sync="dialog1" class="dialog1 detail-warp">
      <el-form ref="form" :model="form" label-width="140px">
        <el-form-item label="充值用户：">
          <div>{{showInfoForm.userName}}</div>
        </el-form-item>
        <el-form-item label="支付方式：">
          <div>{{showInfoForm.rechargeName}}</div>
        </el-form-item>
        <el-form-item label="创建时间：" v-if="showInfoForm.payTime">
          <div>{{showInfoForm.createTime}}</div>
        </el-form-item>
        <el-form-item label="支付时间：" v-if="showInfoForm.payTime">
          <div>{{showInfoForm.payTime}}</div>
        </el-form-item>
        <el-form-item label="到账时间：" v-if="showInfoForm.payState===2">
          <div>{{showInfoForm.reachTime}}</div>
        </el-form-item>
        <el-form-item label="商户单号：">
          <div>{{showInfoForm.paySn}}</div>
        </el-form-item>
        <el-form-item label="手续费：">
          <div>{{showInfoForm.serviceMoney}}</div>
        </el-form-item>
        <el-form-item label="支付金额：">
          <div>{{showInfoForm.payMoney}}</div>
        </el-form-item>
        <el-form-item label="支付状态：">
          <div v-if="showInfoForm.payState===0">等待支付</div>
          <div v-else-if="showInfoForm.payState===1">支付失败</div>
          <div v-else-if="showInfoForm.payState===2">支付成功</div>
          <div v-else>退款</div>
        </el-form-item>
        <el-form-item label="充值来源：" v-if="showInfoForm.rechargeSource">
          <div>{{showInfoForm.rechargeSource}}</div>
        </el-form-item>
        <el-form-item label="返回或处理备注" v-if="showInfoForm.remark">
          <div>在线支付成功</div>
        </el-form-item>
      </el-form>
    </el-dialog>


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
      queryTime: [],//查询时间
      tableData: [],
      showInfoForm: [],//详情
      total:0,
      queryParams:{
        pageNum:1,
        pageSize:20,
        payState: '2'
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
    //获取平台列表
    getListPlatFormList(){
         return request({
            url: '/platform/platform/listOnly',
            method: 'get',
        }).then(res=>{
            console.log(res)
        })
    },
    // 客户充值记录列表
    getList() {
     if(!this.queryParams.paySn){
        delete this.queryParams.paySn
      }
       const form = Object.assign({}, this.queryParams, {})
       this.POST(
        '/finance/rechargeRecord/recordPage',
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

    // 处理时间改变
    dataSearch(){
      if(this.queryTime){
        this.queryParams = {
          ...this.queryParams,
          createTimeStart:this.queryTime[0] + ' 00:00:00',
          createTimeEnd:this.queryTime[1] + ' 23:59:59'
        }
        //console.log(this.queryParams,12)
      }else{
        delete this.queryParams.createTimeStart
        delete this.queryParams.createTimeEnd
      }
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
    this.getListPlatFormList();
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

