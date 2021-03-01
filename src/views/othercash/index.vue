<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="提现方式" name="1">
        <el-table :data="wayDataList" style="width: 100%;margin-top:30px;" border size="mini">
          <el-table-column align="center" label="提现账户号" prop="cashAccount" min-width="200px" />
          <el-table-column align="center" label="提现账户姓名" prop="cashName" min-width="120px" />
          <el-table-column align="center" label="提现类型" prop="cashTypeID" min-width="120px">
            <template slot-scope="scope">
              <span>{{ renderCashType(scope.row.cashTypeID) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="图片" prop="payImg" >
              <template slot-scope="scope">
                <viewer :images="imgs" v-if="scope.row.payImg">
                  <img :src="scope.row.payImg" width="40" height="40"/>
                </viewer>
                  <span v-else>{{"—"}}</span>
              </template>
          </el-table-column>
          <el-table-column align="center" label="提交时间" prop="cashSubmitDate" min-width="180px" />
          <el-table-column align="center" label="处理人ID" prop="dealUserID" min-width="120px">
            <template slot-scope="scope">
              <span>{{ scope.row.dealUserID ? scope.row.dealUserID : "—" }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="处理时间" prop="dealDate" min-width="180px">
            <template slot-scope="scope">
              <span>{{ scope.row.dealDate ? scope.row.dealDate : "—" }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" prop="cashMethodState" min-width="100px">
            <template slot-scope="scope">
              <span v-if="scope.row.cashMethodState == 1">审核中</span>
              <span v-if="scope.row.cashMethodState == 2">审核通过</span>
              <span v-if="scope.row.cashMethodState == 3">审核失败</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="160px">
            <template slot-scope="scope">
              <el-button v-if="scope.row.cashMethodState == 1" size="mini" type="success" @click="examineMethod(scope.row.userID,2)">同意</el-button>
              <el-button v-if="scope.row.cashMethodState == 1" size="mini" type="danger" @click="examineMethod(scope.row.userID,3)">拒绝</el-button>
              <span v-if="scope.row.cashMethodState != 1">—</span>
            </template>
          </el-table-column>

        </el-table>
        <div class="pagination-box">
          <el-pagination
            :current-page="waypage"
            :page-sizes="PageSizes"
            :page-size="PageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="waytotal"
            @size-change="handleSizeChangeWay"
            @current-change="handleCurrentChangeWay"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="提现记录" name="2">
        <el-table :data="cashdataList" style="width: 100%;margin-top:30px;" border size="mini">
          <el-table-column align="center" label="提现单号" prop="cashNumber" min-width="200px" />
          <el-table-column align="center" label="站点编号" prop="siteID" min-width="100px" />
          <el-table-column align="center" label="站点名称" prop="userName" min-width="100px" />
          <el-table-column align="center" label="金额" prop="money" min-width="100px" />
          <el-table-column align="center" label="手续费" prop="fee" min-width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.fee ? scope.row.fee : "—" }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column align="center" label="提现类型" prop="cashMethodID" min-width="120px">
            <template slot-scope="scope">
              <span>{{ renderCashType(scope.row.cashMethodID) }}</span>
            </template>
          </el-table-column> -->
          <el-table-column align="center" label="提现方式" prop="askDate" min-width="160px">
            <template slot-scope="scope">
              <span>{{ scope.row.cashMethodVO ? scope.row.cashMethodVO.cashTypeName : "—" }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="提现账号" prop="askDate" min-width="160px">
            <template slot-scope="scope">
              <span>{{ scope.row.cashMethodVO ? scope.row.cashMethodVO.cashAccount : "—" }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="提现人" prop="askDate" min-width="160px">
            <template slot-scope="scope">
              <span>{{ scope.row.cashMethodVO ? scope.row.cashMethodVO.cashName : "—" }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="图片" prop="payImg" >
              <template slot-scope="scope">
                <viewer :images="imgs" v-if="scope.row.cashMethodVO&&scope.row.cashMethodVO.payImg">
                  <img :src="scope.row.cashMethodVO.payImg"  width="40" height="40"/>
                </viewer> 
                  <span v-else>{{"—"}}</span>
              </template>
          </el-table-column>
          <el-table-column align="center" label="申请时间" prop="askDate" min-width="160px" />
          <el-table-column align="center" label="处理人ID" prop="dealUserID" min-width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.dealUserID ? scope.row.dealUserID : "—" }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="处理时间" prop="dealDate" min-width="160px">
            <template slot-scope="scope">
              <span>{{ scope.row.dealDate ? scope.row.dealDate : "—" }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" prop="cashState" min-width="100px">
            <template slot-scope="scope">
              <span v-if="scope.row.cashState == 1">审核中</span>
              <span v-if="scope.row.cashState == 2">提现中</span>
              <span v-if="scope.row.cashState == 3">提现完成</span>
              <span v-if="scope.row.cashState == 4">审核失败</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="260px">
            <template slot-scope="scope">
              <el-button v-if="scope.row.cashState == 1" size="mini" type="success" @click="examine(scope.row.cashID,2)">同意提现</el-button>
              <el-button v-if="scope.row.cashState == 2" size="mini" type="success" @click="examine(scope.row.cashID,3)">提现完成</el-button>
              <el-button v-if="scope.row.cashState == 1" size="mini" type="danger" @click="examine(scope.row.cashID,4)">拒绝提现</el-button>
              <span v-if="scope.row.cashState == 3 || scope.row.cashState == 4">—</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination
            :current-page="cashpage"
            :page-sizes="PageSizes"
            :page-size="PageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="cashtotal"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="费率设置" name="3">
        <div>
          <div class="table_head">
            <span class="spanwidth">开始金额</span>
            <span style="margin: 0 4px;">—</span>
            <span class="spanwidth">结束金额</span>
            <span class="spanwidth">收费类型</span>
            <span class="spanwidth">收费值</span>
          </div>
          <div v-for="(item,index) in rateArr" :key="item.cashRateID" style="margin-bottom:10px;">
            <el-input-number
              v-model="item.startMoney"
              size="small"
              style="width:130px"
              controls-position="right"
              :precision="2"
              :step="0.01"
              :min="index > 0 ? rateArr[index - 1].endMoney : 0 "
            />
            —
            <el-input-number
              v-model="item.endMoney"
              size="small"
              style="width:130px"
              controls-position="right"
              :precision="2"
              :step="0.01"
              :min="index > 0 ? rateArr[index - 1].endMoney : 0 "
            />
            <el-select v-model="item.rateType" style="width:130px" placeholder="选择收费类型" size="small">
              <el-option label="百分比" :value="1" />
              <el-option label="固定金额" :value="2" />
            </el-select>
            <el-input-number
              v-model="item.rateNum"
              size="small"
              style="width:130px"
              controls-position="right"
              :precision="2"
              :step="0.01"
              :min="0"
            />
            <el-button type="text" size="medium" style="position:relative;" @click="reduceone(index)">
              <i class="el-icon-close" style="position:absolute;left: 0;bottom: 0px;" />
            </el-button>
          </div>
          <div v-if="rateArr && rateArr.length < 10">
            <el-button size="small" type="text" style="color:#67c23a" @click="addone()">新增 + </el-button>
          </div>
          <div style="padding-left:500px;margin-top: 50px;">
            <el-button type="primary" size="small" @click="save()">保存</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: '1',
      waytotal: 0,
      waypage: 1,
      waysize: 10,
      wayDataList: [],
      cashtotal: 0,
      cashpage: 1,
      cashsize: 10,
      cashdataList: [],
      rateArr: [],
      cashWayList: [],
      dialogVisible: false
    }
  },
  mounted() {
    this.getWayList()
    this.getCashList()
    this.getRateList()
    this.getCashType()
  },
  methods: {
    getWayList(page, size) {
      this.POST(
        '/finance/cashMethod/cashMethodPage',
        {
          pageNum: page || 1,
          pageSize: size || 10
        },
        data => {
          this.wayDataList = data.body.records
          this.waypage = data.body.current
          this.waysize = data.body.size
          this.waytotal = data.body.total
        }
      )
    },
    // 每页数量改变
    handleSizeChangeWay(val) {
      this.waysize = val
      this.waypage = 1
      this.getWayList(this.waypage, this.waysize)
    },
    // 当前页面改变
    handleCurrentChangeWay(val) {
      this.waypage = val
      this.getWayList(this.waypage, this.waysize)
    },
    examineMethod(userID, state) {
      var _this = this
      _this.$confirm(`是否${state == 2 ? '同意' : '拒绝'}申请`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.POST(
          '/finance/cashMethod/cashMethodExamine',
          {
            userID: userID,
            cashMethodState: state
          },
          data => {
            _this.$message({
              message: '操作成功',
              type: 'success'
            })
            _this.getWayList()
          }
        )
      }).catch(() => {

      })
    },

    getCashList(page, size) {
      this.POST(
        '/finance/cash/cashPage',
        {
          pageNum: page || 1,
          pageSize: size || 10
        },
        data => {
          this.cashdataList = data.body.records
          this.cashpage = data.body.current
          this.cashsize = data.body.size
          this.cashtotal = data.body.total
        }
      )
    },
    // 每页数量改变
    handleSizeChange(val) {
      this.cashsize = val
      this.cashpage = 1
      this.getCashList(this.cashpage, this.cashsize)
    },
    // 当前页面改变
    handleCurrentChange(val) {
      this.cashpage = val
      this.getCashList(this.cashpage, this.cashsize)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    getRateList() {
      this.GET(
        '/finance/cashRate/listCashRate',
        {},
        data => {
          this.rateArr = data.body
        }
      )
    },
    examine(cashID, state) {
      var _this = this
      _this.$confirm(`是否${state == 2 || state == 3 ? '同意' : '拒绝'}提现`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.POST(
          '/finance/cash/cashExamine',
          {
            cashID: cashID,
            cashState: state
          },
          data => {
            _this.$message({
              message: '操作成功',
              type: 'success'
            })
            _this.getCashList(this.cashpage,this.cashsize)
          }
        )
      }).catch(() => {

      })
    },
    addone() {
      this.rateArr.push({
        startMoney: null,
        endMoney: null,
        rateType: null,
        rateNum: null,
        managerType: this.Read('userType')
      })
    },
    reduceone(index) {
      this.rateArr.splice(index, 1)
    },
    save() {
      var _this = this
      _this._POST(
        '/finance/cashRate/saveCashRateBatch',
        JSON.stringify(this.rateArr),
        data => {
          _this.$message({
            message: '操作成功',
            type: 'success'
          })
          _this.getRateList()
        },
      )
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
    renderCashType(type) {
      let cashTypeName = '未知'
      this.cashWayList.forEach(el => {
        if (el.cashTypeID == type) {
          cashTypeName = el.cashTypeName
        }
      })
      return cashTypeName
    }
  }
}
</script>

<style lang="scss" scope>
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
    .table_head{
        display: flex;
        font-size: 13px;
        margin-bottom: 20px;
    }
    .spanwidth{
        width:130px;
        text-align: center;
    }
</style>
