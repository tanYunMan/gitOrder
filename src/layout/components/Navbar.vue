<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <div v-if="userType != 1">
        <el-tag>保证金：{{ bondMoney }}</el-tag>
        <el-tag>冻结资金：{{ frozenMoney }}</el-tag>
        <el-tag style="margin-right:20px;">余额：{{ money }}</el-tag>
      </div>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          {{ userName }}
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/home">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <router-link v-if="userType != 1" to="/cash">
            <el-dropdown-item divided>提现</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided v-if="userType != 1">
            <span style="display:block;" @click="rechargeMoney">充值</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- 申请提现 -->
      <el-dialog title="余额充值" class="recharge-warp" :visible.sync="rechargeDialog">
        <el-form ref="thisMoneyForm" :model="thisMoneyForm" label-width="30%">
          <el-form-item label="充值金额：">
            <el-input-number
              v-model="thisMoneyForm.money"
              :min="0"
              :precision="2"
              controls-position="right"
            ></el-input-number>
            <span style="margin-left:14px">元</span>
          </el-form-item>

          <el-form-item label="充值方式：">
            <div style="max-width:600px">
              <span
                class="el-forClientlist"
                v-for="(item,index) in forClientlist"
                :key="index"
                :style="{'border':item.select?'1px solid red':'none'}"
                @click="clickIndex(index)"
              >
                <img
                  style="width:100%;height:100%;"
                  :src="item.rechargeImg"
                  class="user-avatar"
                  :alt="item.rechargeName"
                  :title="item.rechargeName"
                />
              </span>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rechargeDialog = false">取 消</el-button>
          <el-button type="primary" @click="rechargeConfirm">充 值</el-button>
        </span>
        <el-dialog width="240px" title="扫码支付" :visible.sync="payDialog" append-to-body>
          <vue-qr :text="qrCode" :size="200"></vue-qr>
        </el-dialog>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import VueQr from "vue-qr";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    VueQr,
  },
  data() {
    return {
      userName: this.Read("name"),
      userType: null,
      rechargeDialog: false,
      payDialog: false, // 支付弹窗
      qrCode: "", // 二维码地址
      bondMoney: 0,
      payInterval: null, // 支付的定时器
      payIntervalCount: 0, // 轮询次数
      outTradeNo: "", // 支付订单
      frozenMoney: 0,
      forClientlist: [], // 充值方式
      thisMoneyForm: {
        money: 0,
        rechargeModeID: null,
      },
      money: 0,
    };
  },
  computed: {
    ...mapGetters(["sidebar"]),
  },
  created() {
    this.userType = this.Read("userType");
    if (this.userType != 1) {
      this.getMoney();
    }
    this.getListForClient();
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    getMoney() {
      this.GET("/finance/platformMoney/getCurrentMoney", {}, (res) => {
        this.bondMoney = res.body.bondMoney;
        this.frozenMoney = res.body.frozenMoney;
        this.money = res.body.money;
      });
    },
    async logout() {
      this.Set("name", "");
      this.$router.push(`/`);
    },
    rechargeMoney() {
      this.rechargeDialog = true;
    },
    // 充值按钮
    clickIndex(key) {
      this.forClientlist.map((item, index) => {
        if (key == index) {
          item.select = true;

          this.$set(this.forClientlist, index, item);

          this.thisMoneyForm.rechargeModeID = item.rechargeModeID;
        } else {
          item.select = false;
        }
      });
    }, //获取充值方式
    getListForClient() {
      this.loading = true;
      this.GET(
        "/finance/rechargeMode/getListForClient",
        { rechargeType: 1 },
        (res) => {
          if (res.code === 1001) {
            //console.log(res,55)
            this.forClientlist = res.body;
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: "error",
            });
          }
          this.loading = false;
        }
      );
    },
    // 确认充值
    rechargeConfirm() {
      this.loading = true;
      if (this.thisMoneyForm.money == 0) {
        this.$message({
          showClose: true,
          message: "请输入正确充值的金额",
          type: "error",
        });
        this.loading = false;
        return false;
      } else if (this.thisMoneyForm.money > 100000) {
        this.$message({
          showClose: true,
          message: "充值金额超过最大充值金额100000",
          type: "error",
        });
        this.loading = false;
        return false;
      } else if (!this.thisMoneyForm.rechargeModeID) {
        this.$message({
          showClose: true,
          message: "请选择充值支付方式",
          type: "error",
        });
        this.loading = false;
        return false;
      }

      this.POST(
        "/finance/rechargeRecord/addRecharge",
        this.thisMoneyForm,
        (res) => {
          if (res.code === 1001) {
            this.loading = false;
            const qrCode = res.body.qr_code;
            if (qrCode) {
              // 有二维码，当面付
              this.qrCode = qrCode;
              this.outTradeNo = res.body.out_trade_no;
              this.payDialog = true;
              // 在这里轮询
              this.payInterval = setInterval(() => {
                this.GET(
                  "/finance/rechargeRecord/queryPayStateFk",
                  { paySn: this.outTradeNo },
                  (payRes) => {
                    if (payRes.body.payState == 2) {
                      this.$notify({
                        title: "支付成功",
                        message: "您的支付已经成功，请查看账户余额",
                      });
                      this.payDialog = false;
                      this.qrCode = "";
                      this.outTradeNo = "";
                      clearInterval(this.payInterval);
                      this.getMoney();
                    }
                    if (payRes.body.payState == 1) {
                      this.$message.error("支付失败 ，请重新支付");
                      this.payDialog = false;
                      this.qrCode = "";
                      this.outTradeNo = "";
                      clearInterval(this.payInterval);
                    }
                  }
                );

                if (this.payIntervalCount > 60) {
                  this.$message.error("支付订单已超时 ，请重新支付");
                  this.payDialog = false;
                  this.qrCode = "";
                  this.outTradeNo = "";
                  clearInterval(this.payInterval);
                }
                this.payIntervalCount++;
              }, 3000);
            } else {
              paySubmit(res.body);
              //window.open(res.body.postUrl,"_blank")
            }
            setTimeout(() => {
              this.rechargeDialog = false;
              this.loading = false;
            }, 3000);
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: "error",
            });
          }
          this.loading = false;
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.el-forClientlist {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  margin: 10px;
  cursor: pointer;
  display: block;
  width: 130px;
  height: 55px;
  float: left;
  padding: 1px;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;
        cursor: pointer;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
