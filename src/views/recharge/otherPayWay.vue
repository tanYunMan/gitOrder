<template>
    <div  class="otherPayWay-container">
        <el-form ref="form" :model="form" label-width="200px" style="marginTop:20px">
            <el-form-item label="开关：">
                <el-radio-group v-model="form.resource">
                <el-radio label="开启"></el-radio>
                <el-radio label="关闭"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="基础手续费：">
                单笔0.5元<span>于SUP余额扣款</span>
            </el-form-item>
            <el-form-item label="自有接口选择：">
                <el-radio-group v-model="form.interface">
                <el-radio label="官签接口"></el-radio>
                <el-radio label="易支付接口"></el-radio>
                <el-radio label="码支付接口"></el-radio>
                <el-radio label="特约商户进件"></el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div class="range">
            <span>起充范围</span>
            <div class="rangeContent">
                <el-input v-model="rangeInputOne"></el-input>-&nbsp&nbsp&nbsp
                <el-input v-model="rangeInputTwo"></el-input>
            </div>
            
        </div>
        <div class="rate">
            <span>前台充值费率</span>
            <div class="rateContent">
                <el-input v-model="rateInputOne"></el-input>% &nbsp&nbsp&nbsp单笔最低&nbsp
                <el-input v-model="rateInputTwo"></el-input>元
                <el-button v-if="types=='QQ'" type="primary">添加</el-button>
                <el-button v-if="types=='chat'" type="primary">申请</el-button>
                <el-button v-if="types=='chat'" type="primary">添加已申请商户</el-button>
            </div>
        </div>
        <span v-if="types=='chat'" class="lastContent">提示：进件签约过程中有疑问请联系专属客服</span>
    </div>
</template>

<script>
export default {
    props:{
        types:{
            type:String,
            default:''
        }
    },
  data() {
    return {
        form: {
            resource: "开启",
            interface: "官签接口"
        }
    }
  },
  watch: {
    
  },
  mounted() {
    
  },
  methods: {
    onSubmit() {
        console.log('submit!');
    }
  }
}
</script>

<style lang="scss" scoped>
.otherPayWay-container{
//   border: 1px solid red;
    .range{
        display: flex;
        span{
            width: 200px;
            display: inline-block;
            text-align: right;
            padding-right: 20px;
            line-height: 40px;
            font-size: 14px;
            color: #606266;
            font-weight: bold;
        }
        .rangeContent{
            .el-input{
                width:100px;
                margin-right: 20px;
            }
        }
    }
    .rate{
        display: flex;
        margin: 20px 0;
        span{
            width: 200px;
            display: inline-block;
            text-align: right;
            padding-right: 20px;
            line-height: 40px;
            font-size: 14px;
            color: #606266;
            font-weight: bold;
        }
        .rateContent{
            font-size: 14px;
            .el-input{
                width:50px;
                margin-right: 20px;
            }
        }
        /deep/ .el-button--primary{
          margin: 0 15px;
      }
    }
    .lastContent{
        font-size: 14px;
        color: red;
        margin-left: 100px;
        display: inline-block;
        text-align: right;
    }
}
</style>
