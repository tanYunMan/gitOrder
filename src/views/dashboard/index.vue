<template>
  <div>

    <div class="dashboard-container">
      <div class="section section2" style="width:100%;border:1px solid #eaeaea">
        <div class="title">今日统计</div>
        <div style="padding:20px 60px 30px 60px;">
          <el-row type="flex" class="row-bg" justify="space-between" :gutter="100" style="margin-bottom:30px">
            <el-col :span="6">
              <el-card class="box-card wl-index-card-padding" shadow="hover">
                <div class="wl-box-card">
                  <div class="wl-box-card-left" style="background:#30cc7b">
                    <img src="index1.png" class="user-avatar">
                  </div>
                  <div class="wl-box-card-right">
                    <p class="wl-info-content"><span style="color:#30cc7b">{{ form.money }}</span><span style="padding: 0 5px;">元</span></p>
                    <div style="height:1px;width:100%;background:#EBEEF5;" />
                    <p class="wl-info-title">充 值 金 额</p>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="box-card wl-index-card-padding" shadow="hover">
                <div class="wl-box-card">
                  <div class="wl-box-card-left" style="background:#2196F3">
                    <img src="index2.png" class="user-avatar">
                  </div>
                  <div class="wl-box-card-right">
                    <p class="wl-info-content"><span style="color:#2196F3">{{ form.B }}</span><span style="padding: 0 5px;">元</span></p>
                    <div style="height:1px;width:100%;background:#EBEEF5;" />
                    <p class="wl-info-title">销 售 金 额</p>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="box-card wl-index-card-padding" shadow="hover">
                <div class="wl-box-card">
                  <div class="wl-box-card-left" style="background:#ff9800">
                    <img src="index3.png" class="user-avatar">
                  </div>
                  <div class="wl-box-card-right">
                    <p class="wl-info-content"><span style="color:#ff9800">{{ form.C }}</span><span style="padding: 0 5px;">元</span></p>
                    <div style="height:1px;width:100%;background:#EBEEF5;" />
                    <p class="wl-info-title">手 续 费</p>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="box-card wl-index-card-padding" shadow="hover">
                <div class="wl-box-card">
                  <div class="wl-box-card-left" style="background:#F44336">
                    <img src="index4.png" class="user-avatar">
                  </div>
                  <div class="wl-box-card-right">
                    <p class="wl-info-content"><span style="color:#F44336">{{ form.saleOrder }}</span><span style="padding: 0 5px;">个</span></p>
                    <div style="height:1px;width:100%;background:#EBEEF5;" />
                    <p class="wl-info-title">直 销 订 单</p>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <el-row type="flex" class="row-bg" justify="space-between" :gutter="100">
            <el-col :span="6">
              <el-card class="box-card wl-index-card-padding" shadow="hover">
                <div class="wl-box-card">
                  <div class="wl-box-card-left" style="background:#e83e8c">
                    <img src="index5.png" class="user-avatar">
                  </div>
                  <div class="wl-box-card-right">
                    <p class="wl-info-content"><span style="color:#e83e8c">{{ form.joinOrder }}</span><span style="padding: 0 5px;">个</span></p>
                    <div style="height:1px;width:100%;background:#EBEEF5;" />
                    <p class="wl-info-title">对 接 订 单</p>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="box-card wl-index-card-padding" shadow="hover">
                <div class="wl-box-card">
                  <div class="wl-box-card-left" style="background:#6c757d">
                    <img src="index6.png" class="user-avatar">
                  </div>
                  <div class="wl-box-card-right">
                    <p class="wl-info-content"><span style="color:#6c757d">{{ form.E }}</span><span style="padding: 0 5px;">个</span></p>
                    <div style="height:1px;width:100%;background:#EBEEF5;" />
                    <p class="wl-info-title">投 诉 订 单</p>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="box-card wl-index-card-padding" shadow="hover">
                <div class="wl-box-card">
                  <div class="wl-box-card-left" style="background:#ffc107">
                    <img src="index7.png" class="user-avatar">
                  </div>
                  <div class="wl-box-card-right">
                    <p class="wl-info-content"><span style="color:#ffc107">{{ form.D }}</span><span style="padding: 0 5px;">位</span></p>
                    <div style="height:1px;width:100%;background:#EBEEF5;" />
                    <p class="wl-info-title">注 册 客 户</p>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="box-card wl-index-card-padding" shadow="hover">
                <div class="wl-box-card">
                  <div class="wl-box-card-left" style="background:#17a2b8">
                    <img src="index8.png" class="user-avatar">
                  </div>
                  <div class="wl-box-card-right">
                    <p class="wl-info-content"><span style="color:#17a2b8">{{ form.F }}</span><span style="padding: 0 5px;">个</span></p>
                    <div style="height:1px;width:100%;background:#EBEEF5;" />
                    <p class="wl-info-title">搭 建 子 站</p>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <div :class="isWidth ? 'dashboard-container-true' : 'dashboard-container'">
      <div :class="isWidth ? 'el-left-div-content-true' : 'el-left-div-content'">
        <div class="section section1">
          <div class="title">产品更新<span class="more">更多</span></div>
          <!-- <ul>
                  <li>
                    <a href="" style="color:#FF0000">关于5月份和6月份更新内容</a>
                    <span class="date">2020-06-10</span>
                  </li>
                  <li>
                    <a href="" style="color:#FF00FF">新卡售2.0即将上线</a>
                    <span class="date">2020-06-10</span>
                  </li>
                </ul> -->
          <el-table :data="tableData" style="width: 100%" :show-header="status">
            <el-table-column prop="content" label="名称">
              <template slot-scope="scope">
                <img src="index_news.png" style="margin-right:5px">
                <a target="_blank" @click="goNotice(scope.row.updateNoticeID)"><span :style="{'color':scope.row.color}">{{ scope.row.title }}</span></a>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="时间" width="180">
              <template slot-scope="scope">
                <span>{{ scope.row.createTime }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div :class="isWidth ? 'el-right-div-content-true' : 'el-right-div-content'">
        <div class="section section2">
          <!-- <div class="title">商户信息</div> -->
          <ul>
            <li v-for="(item,i) in LoginSiteInfo" :key="i" style="margin:10px 0;display:flex;align-items: flex-start;">
              <span class="label" style="font-size: 14px;font-weight: 600;">{{ item.key }}：</span>
              <div style="margin-top:1px;">
                <span v-for="(items,is) in item.value" :key="is" style="margin-left:10px;display:block" class="val">{{ items }}</span>
              </div>
            </li>
            <!-- <li>
                    <span class="label">网站域名：</span>
                    <span class="val">www.sdfsdf.com</span>
                  </li>
                  <li>
                    <span class="label">网站版本：</span>
                    <span class="val"><el-button type="danger" size="mini">旗舰版</el-button></span>
                  </li>
                  <li>
                    <span class="label">到期时间：</span>
                    <span class="val">2018-06-04 至 2020-06-29</span>
                  </li>
                  <li>
                    <span class="label">实名认证状态：</span>
                    <span class="val"><el-button type="primary" plain="" size="mini">已实名</el-button></span>
                  </li> -->
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
// import { getLists,getDatas } from '@/api/price/price-1/common'

export default {
  name: 'Dashboard',
  metaInfo: {
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=0.31, maximum-scale=1, user-scalable=yes" }
    ],
  },
  data() {
    return {
      status: false,
      form: {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0,
        F: 0
      },
      isWidth: false,
      tableData: [],
      LoginSiteInfo: []
    }
  },
  computed: {
    // ...mapGetters([
    //   'name'
    // ])
  },
  created() {
    var w = document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth// 先获取窗口宽度
    if (w < 750) {
      this.isWidth = true
    }
    this.getLists()
    this.getOrderToday()
    this.getPayMoneyToday()
    this.getOrderMoneyToday()
    this.getMoneyServiceToday()
    this.getRegToday()
    this.getComplaintToday()
    this.getSiteToday()
    this.getLoginSite()
  },
  mounted () {
    
  },
  methods: {

    // 获取公告信息
    getLists() {
      // getLists({pageNum:1,pageSize:40},'/platform/updateNotice/page').then(res => {
      //   if (res.code===1001){
      //     this.tableData = res.body.records
      //   }
      // }).catch(err => {
      // })
      this.POST(
        '/platform/updateNotice/page',
        { pageNum: 1, pageSize: 40 },
        res => {
          this.tableData = res.body.records
        }
      )
    },

    // 统计--获取

    // 获取当日订单数
    getOrderToday() {
      // 直销
      // getDatas({saleType:1},'/order/order/orderToday').then(res => {
      //   if (res.code===1001){
      //     this.form.saleOrder = res.body
      //   }
      // }).catch(err => {
      // }),
      this.GET(
        '/order/order/orderToday',
        { saleType: 1 },
        res => {
          this.form.saleOrder = res.body
        }
      )
      // 对接
      // getDatas({saleType:2},'/order/order/orderToday').then(res => {
      //   if (res.code===1001){
      //     this.form.joinOrder = res.body
      //   }
      // }).catch(err => {
      // })
      this.GET(
        '/order/order/orderToday',
        { saleType: 2 },
        res => {
          this.form.joinOrder = res.body
        }
      )
    },
    // 获取当日销售金额
    getOrderMoneyToday() {
      // getDatas({},'/order/order/orderMoneyToday').then(res => {
      //   if (res.code===1001){
      //     this.form.B = res.body
      //   }
      // }).catch(err => {
      // })
      this.GET(
        '/order/order/orderMoneyToday',
        {},
        res => {
          this.form.B = res.body
        }
      )
    },
    // 获取当日充值金额
    getPayMoneyToday() {
      // getDatas({},'/finance/moneyStatistics/moneyRechargeToday').then(res => {
      //   if (res.code===1001){
      //     this.form.money = res.body
      //   }
      // }).catch(err => {
      // })
      this.GET(
        '/finance/moneyStatistics/moneyRechargeToday',
        {},
        res => {
          this.form.money = res.body
        }
      )
    },
    // 获取当日手续费
    getMoneyServiceToday() {
      // getDatas({},'/finance/moneyStatistics/moneyServiceToday').then(res => {
      //   if (res.code===1001){
      //     this.form.C = res.body
      //   }
      // }).catch(err => {
      // })
      this.GET(
        '/finance/moneyStatistics/moneyServiceToday',
        {},
        res => {
          this.form.C = res.body
        }
      )
    },

    // 获取当日注册用户
    getRegToday() {
      // getDatas({},'/user/user/regToday').then(res => {
      //   if (res.code===1001){
      //     this.form.D = res.body
      //   }
      // }).catch(err => {
      // })
      this.GET(
        '/user/user/regToday',
        {},
        res => {
          this.form.D = res.body
        }
      )
    },

    // 获取当日投诉数
    getComplaintToday() {
      // getDatas({},'/order/complaint/complaintToday').then(res => {
      //   if (res.code===1001){
      //     this.form.E = res.body
      //   }
      // }).catch(err => {
      // })
      this.GET(
        '/order/complaint/complaintToday',
        {},
        res => {
          this.form.E = res.body
        }
      )
    },

    // 获取当日搭建子站数
    getSiteToday() {
      // getDatas({},'/platform/siteStatistics/siteToday').then(res => {
      //   if (res.code===1001){
      //     this.form.F = res.body
      //   }
      // }).catch(err => {
      // })
      this.GET(
        '/platform/siteStatistics/siteToday',
        {},
        res => {
          this.form.F = res.body
        }
      )
    },

    // 商户信息
    getLoginSite() {
      // getDatas({},'/platform/site/getLoginSite').then(res => {
      //   if (res.code===1001){
      //     this.LoginSiteInfo = res.body
      //     //console.log(this.LoginSiteInfo,111)
      //   }
      // }).catch(err => {
      // })
      this.GET(
        '/platform/platform/getLoginPlatform',
        {},
        res => {
          this.LoginSiteInfo = res.body
        }
      )
    },

    // 跳转详情
    goNotice(id) {
      this.$router.push({ path: '/notice' })
    }

  }
}
</script>

<style lang="scss" scoped>

.el-table__header-wrapper {
    display:none !important;
}

.dashboard-container-true{
  .el-left-div-content-true{
      width: 100%;
      border: 1px solid #eaeaea;
  }
  .el-right-div-content-true{
    width: 100%;
    border: 1px solid #eaeaea;
    margin-top: 20px;
  }
  padding:20px;
  .title {
    display:flex;
    justify-content: space-between;
    .more {
      font-weight: normal;
    }
  }
  ul {
      margin:0;
      padding:0;
    }
  .section {
    margin-bottom:30px;
  }
  .section1 {

    li {
      font-size:13px;
      padding:5px 0;
      cursor: pointer;
      display:flex;
      justify-content: space-between;
      padding:5px 20px;
      margin:0;
      a {
        font-size:12px;
      }
      .date {
        color:#999;
      }
    }
  }
  .section2 {
    li {
      display:flex;
      font-size:13px;
      color:#888;
      padding:5px 0;
      align-items: center;
      .label {
        width:140px;
        text-align: right;

      }
    }
  }
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.dashboard-container {
  display:flex;
  .el-left-div-content{
    width: 49%;
    margin-right: 2%;
    border: 1px solid #eaeaea;
  }
  .el-right-div-content{
    width: 49%;
    border: 1px solid #eaeaea;
  }

  padding:20px;
  .title {
    display:flex;
    justify-content: space-between;
    .more {
      font-weight: normal;
    }
  }
  ul {
      margin:0;
      padding:0;
    }
  .section {
    margin-bottom:30px;
  }
  .section1 {

    li {
      font-size:13px;
      padding:5px 0;
      cursor: pointer;
      display:flex;
      justify-content: space-between;
      padding:5px 80px;
      margin:0;
      a {
        font-size:12px;
      }
      .date {
        color:#999;
      }
    }
  }
  .section2 {
    li {
      display:flex;
      font-size:13px;
      color:#888;
      padding:5px 0;
      align-items: center;
      .label {
        width:140px;
        text-align: right;

      }
    }
  }
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }

}

  .dashboard-container-r{
    width: 50%;
    float:right;
    .el-title-p-wl{
      line-height:6px;
      color:#898989;
    }
  }
  .el-title-sp-wl{
    color: #d07100;
    font-weight: bold;
  }

  .wl-box-card{
    display: flex;
  }
  .wl-box-card-right{
    min-width:60%;
  }
  .wl-box-card-left{
    height:100px;
    width:40%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .wl-info-content{
    line-height:50px;
    margin: 0;
    padding-left: 20px;
  }
  .wl-info-title{
    line-height:50px;
    margin: 0;
    padding-left: 20px;
    font-weight: 500;
  }
  .user-avatar{
    width: 50px;
  }
</style>
