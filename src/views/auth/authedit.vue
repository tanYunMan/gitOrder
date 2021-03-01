<template>
  <div class="container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>角色权限配置</span>
        <div style="float: right;">角色名称：<span style="color:#F56C6C">{{ form.name }}</span></div>
      </div>

      <el-form ref="form" :model="form" label-width="100px">
        <div v-for="(item,index) in listData" :key="index">
          <el-form-item :label="item.functionName">
            <el-checkbox v-model="item.itemCheckAll" :indeterminate="item.isIndeterminate" @change="handleCheckAllChange(item)" />
            <div style="margin: 15px 0;" />
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="val in item.children" :key="val.functionID" :label="val.functionID">{{ val.functionName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>

        <el-form-item>
          <el-button type="primary" :loading="confirmLoading" @click="savePower">保存权限</el-button>
          <el-button v-if="!isAllChecked" @click="checkAllPower">全部勾选</el-button>
          <el-button v-else type="danger" @click="cancelAllPower">全部取消</el-button>
        </el-form-item>
      </el-form>

    </el-card>

  </div>
</template>

<script>
// import { getLists,getDatas } from '@/api/price/price-1/common'
export default {
  data() {
    return {
      type: 1,
      color: '#333',
      form: {},
      checkAll: false, // 局部全选
      checkedCities: [], // 选择
      checkList: [],
      listData: [],
      roleData: [], // 角色权限
      multipleSelection: [],
      confirmLoading: false,
      isAllChecked: false
    }
  },
  mounted() {
    if (this.$route.params && this.$route.params.roleID) {
      this.form = {
        roleID: this.$route.params.roleID,
        name: this.$route.params.name
      }
      this.getByRoleID()
      this.getList()
    }
  },
  methods: {
    // 获取角色权限
    getByRoleID() {
    //   getDatas({roleID:this.form.roleID},'/user/function/getByRoleID').then(res => {
    //     if (res.code===1001){
    //         this.roleData = res.body ? res.body : []
    //         this.roleData.map((item)=>{
    //           this.checkedCities.push(item.functionID)
    //         })
    //         this.handleCheckedCitiesChange(this.checkedCities)
    //     }
    //   }).catch(err => {

      //   })

      this.GET(
        '/user/function/getByRoleID',
        { roleID: this.form.roleID },
        res => {
          if (res.code === 1001) {
            this.roleData = res.body ? res.body : []
            this.roleData.map((item) => {
              this.checkedCities.push(item.functionID)
            })
            this.handleCheckedCitiesChange(this.checkedCities)
          }
        }, err => {

        }
      )
    },

    // 获取权限树
    getList() {
    //   getDatas({},'/user/function/tree').then(res => {
    //     if (res.code===1001){
    //       let thisData =  res.body
    //       //this.listData = res.body
    //       thisData.map((item)=>{
    //           item.isIndeterminate = false   //是否只负责控制样式
    //           item.itemCheckAll = false      // 分支是否全选
    //       })
    //       this.listData = thisData

      //     }
      //   }).catch(err => {

      //   })

      this.GET(
        '/user/function/tree',
        {},
        res => {
          if (res.code === 1001) {
            const thisData = res.body
            // this.listData = res.body
            thisData.map((item) => {
              item.isIndeterminate = false // 是否只负责控制样式
              item.itemCheckAll = false // 分支是否全选
            })
            this.listData = thisData
          }
        }, err => {

        }
      )
    },

    // 局部全选
    handleCheckAllChange(data) {
      const val = data.functionID // 局部全选的id
      // 第一步  剔除已在 checkedCities 中的

      // 剔除没有子集的
      if (data.children.length == 0) {
        if (!data.itemCheckAll) {
          const noCindex = this.checkedCities.indexOf(data.functionID)
          if (noCindex != -1) {
            this.checkedCities.splice(noCindex, 1)
          }
        } else {
          this.checkedCities.push(data.functionID)
        }
      }

      //   获取当前的所有子集id--并从 checkedCities 移除
      let thisData

      this.listData.map(item => {
        if (item.functionID === val) {
          thisData = item.children
          item.isIndeterminate = false
        }
      })
      thisData.map((item) => {
        this.checkedCities.map((items) => {
          if (item.functionID == items) {
            const thisIndex = this.checkedCities.indexOf(item.functionID)
            this.checkedCities.splice(thisIndex, 1)
          }
        })
      })

      // 第二步   data.itemCheckAll 为true时勾选当前下的全部
      if (data.itemCheckAll) {
        if (val) {
          this.listData.map(item => {
            if (item.functionID === val) {
              thisData = item.children
              item.isIndeterminate = false // 是否只负责控制样式
            }
          })
        }
        thisData.map((item) => {
          this.checkedCities.push(item.functionID)
        })
      }
    },

    // 剔除  勾选
    handleCheckedCitiesChange(value) {
      if (this.checkedCities.length == 0) {
        this.listData.map((item) => {
          item.itemCheckAll = false
          item.isIndeterminate = false
        })
        return false
      }

      for (var i = 0; i < this.listData.length; i++) {
        const thisData = this.listData[i].children
        if (thisData.length === 0) {
          const thisIndexs = this.checkedCities.indexOf(this.listData[i].functionID)
          if (thisIndexs != -1) {
            this.listData[i].itemCheckAll = true
          }
        }
        for (var is = 0; is < thisData.length; is++) {
          const thisIndex = this.checkedCities.indexOf(thisData[is].functionID)
          if (thisIndex == -1) {
            this.listData[i].itemCheckAll = false
            value.map((item) => {
              if (item == thisData[is].functionID) {
                this.listData[i].isIndeterminate = true
              }
            })
          } else {
            this.listData[i].itemCheckAll = true
            this.listData[i].isIndeterminate = is != thisData.length - 1
          }
        }
      }
    },

    // 保存权限
    savePower() {
      if (this.isAllChecked) {
        this.checkedCities = []
        this.listData.map((item) => {
          item.children.map((items) => {
            this.checkedCities.push(items.functionID)
          })
          this.checkedCities.push(item.functionID)
        })
        this.save(this.checkedCities)
      } else {
        this.save(this.checkedCities)
      }
    },

    save(data) {
      this.confirmLoading = true
      //   getLists({roleID:this.form.roleID,functionID:data},'/user/roleFunction/saveRoleFunction').then(res => {
      //     if (res.code===1001){
      //       this.$message({
      //         message: res.msg,
      //         type: 'success',
      //       });
      //       setTimeout(()=>{
      //         this.confirmLoading = false
      //       },1000)
      //       this.getByRoleID();
      //       this.getList()
      //     } else {
      //       this.$message({
      //         showClose: true,
      //         message: res.msg,
      //         type: 'error',
      //       });
      //     }
      //   }).catch(err => {

      //   })

      this.POST(
        '/user/roleFunction/saveRoleFunction',
        { roleID: this.form.roleID, functionID: data },
        res => {
          if (res.code === 1001) {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            setTimeout(() => {
              this.confirmLoading = false
            }, 1000)
            this.getByRoleID()
            this.getList()
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
        }, err => {

        }
      )
    },

    // 选中所有
    checkAllPower() {
      this.checkedCities = []
      this.listData.map((item) => {
        item.itemCheckAll = true
        item.children.map((items) => {
          this.checkedCities.push(items.functionID)
        })
      })
      this.isAllChecked = true
    },

    // 全部取消
    cancelAllPower() {
      this.checkedCities = []
      this.isAllChecked = false
      this.listData.map((item) => {
        item.itemCheckAll = false
      })
    }

  }
}
</script>

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
  }
  .handle-wrap {
    // margin-top:20px;
    margin-bottom:20px;
  }

}
</style>

