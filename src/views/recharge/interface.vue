<template>
  <div  class="interface-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">自定义支付</el-menu-item>
      <el-menu-item index="2">支付宝扫码</el-menu-item>
      <el-menu-item index="3">微信支付</el-menu-item>
      <el-menu-item index="4">QQ支付</el-menu-item>
    </el-menu>
    <div class="mainContent">
      <!-- {{content}} -->
      <UserCustom v-if="content==1"/>
      <AlipayWay v-if="content==2"/>
      <OtherPay types="chat"  v-if="content==3"/>
      <OtherPay types="QQ" v-if="content==4"/>
    </div>
    <div class="tableContent">
      <el-table
        :data="tableData"
        height="250"
        border
        style="width: 100%">
        <el-table-column
          v-for="(item,index) in tableHead"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import UserCustom from '@/views/recharge/userCustom'
import OtherPay from '@/views/recharge/otherPayWay'
import AlipayWay from '@/views/recharge/alipayWay'
export default {
  data() {
    return {
      activeIndex:'1',
      content:'',
      tableData:[],
      tableHead:[
        {
          prop:'date',
          label:'日期',
          width:'180'
        },
        {
          prop:'name',
          label:'姓名',
          width:'180'
        },
        {
          prop:'address',
          label:'地址',
          width:'180'
        },
        {
          prop:'money',
          label:'金额',
          width:'180'
        },
      ]
    }
  },
  components:{
    UserCustom,
    OtherPay,
    AlipayWay
  },
  watch: {
    
  },
  mounted() {
    
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.content = key;
    }
  }
}
</script>

<style lang="scss" scoped>
.interface-container{
  // border: 1px solid red;
}
</style>
