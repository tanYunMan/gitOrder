<template>
  <div  class="userCustom-container">
      <div class="selectRaio">
          <span style="width:200px;textAlign:right;display: inline-block;">商家类型：</span>
          <el-radio-group class="radioGroup" v-model="radio" @change="changeMess()">
            <el-radio  label="1">个人</el-radio>
            <el-radio  label="2">个体工商户</el-radio>
            <el-radio  label="3">企业</el-radio>
          </el-radio-group>
          <el-button type="primary">保存</el-button>
          <el-button type="primary">添加已申请商户</el-button>
      </div>
      <el-form ref="form" :model="form" label-width="200px" >
        <el-form-item :label="name[radio-1].one">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item :label="name[radio-1].two">
            <el-input v-model="form.name"></el-input>
            <p>显示在用户支付订单详情内的收款人名称</p>
        </el-form-item>
        
        <el-form-item :label="name[radio-1].three">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item :label="name[radio-1].four" class="fourStyle">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item :label="name[radio-1].five">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item :label="name[radio-1].six">
            {{radio==2?'作为结算账号，要求与商户名称同名，且是实名认证支付宝账户':radio==3?'作为结算账号，要求与企业名称同名，且是实名认证支付宝账户':'作为结算账号，要求与姓名同名，且是实名认证支付宝账户'}}
        </el-form-item>
        <el-form-item v-if="radio!=1" :label="name[radio-1].seven">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item v-if="radio!=1" :label="name[radio-1].eight">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary">确定</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radio:'1',
      form: {
          name: '',
      },
      name:[
          {
              one:'姓名:',
              two:'商户别名:',
              three:'电话:',
              four:'身份证号:',
              five:'支付宝账号:',
              six:''
          },
          {
              one:'商户名称:',
              two:'商户别名:',
              three:'电话:',
              four:'营业执照（统一社会信用代码）:',
              five:'支付宝账号:',
              six:'',
              seven:'法人名称:',
              eight:'法人身份证号:'
          },
          {
              one:'企业名称:',
              two:'商户别名:',
              three:'电话:',
              four:'营业执照（统一社会信用代码）:',
              five:'支付宝账号:',
              six:'',
              seven:'法人名称:',
              eight:'法人身份证号:'
          }
      ]
    }
  },
  watch: {
    
  },
  mounted() {
    
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.content = key;
    },
    changeMess(value){
        console.log(this.radio)
    }
  }
}
</script>

<style lang="scss" scoped>
.userCustom-container{
//   border: 1px solid red;
  /deep/ .el-form-item__content{
      width: 500px;
  }
  .fourStyle{
      .el-input{
          margin-top: 20px;
      }
  }
  p{
    text-align: right;
    margin-top: -35px;
    margin-right: -270px;
    height: 0;
    color: lightgray;
  }
  .selectRaio{
      margin-bottom: 20px;
      margin-top: 50px;
      .radioGroup{
          margin-right: 40px;
      }
      /deep/ .el-button--primary{
          margin: 0 15px;
      }
  }
}
</style>
