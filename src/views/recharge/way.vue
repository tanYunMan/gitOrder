<template>
  <div class="app-container">
    <div class="btn-box">
      <el-button type="success" size="small" @click.stop="dialogVisible = true">新增方式</el-button>
    </div>
    <el-table :data="dataList" style="width: 100%;margin-top:30px;" border size="mini">
      <el-table-column align="center" label="编号" prop="rechargeModeID" width="140px" />
      <el-table-column align="center" label="充值方式名称" prop="rechargeName" width="140px" />
      <el-table-column align="center" label="图片" prop="rechargeImg" width="180px">
        <template slot-scope="scope">
          <span v-if="scope.row.rechargeImg">
            <el-image
              style="height: 50px"
              :src="scope.row.rechargeImg"
              :preview-src-list="scope.row.imgArr"
            />
          </span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="充值类型" prop="rechargeType" width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.rechargeType == 1 ? 'PC' : '移动' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="充值标识" prop="rechargeKey" width="140px" />
      <el-table-column align="center" label="最低充值" prop="minMoney" width="140px" />
      <el-table-column align="center" label="最高充值" prop="maxMoney" width="140px" />
      <el-table-column align="center" label="状态" prop="rechargeState" width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.rechargeState == 1 ? '启用' : '禁用' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="160px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click.stop="_det(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click.stop="_del(scope.row.rechargeModeID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-box">
      <el-pagination
        :current-page="page"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog width="70%" :title="form.rechargeModeID ? '修改充值方式' : '新增充值方式' " :visible.sync="dialogVisible">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="充值名称" label-width="120px" prop="rechargeName">
          <el-input v-model="form.rechargeName" style="width:250px" size="small" />
        </el-form-item>
        <el-form-item label="图片" label-width="120px">
          <Upload :img-list="form.rechargeImg" img-name="图片" @listenTochildEvent="showMessageFromChild" />
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-radio-group v-model="form.rechargeType">
            <el-radio label="1">PC</el-radio>
            <el-radio label="2">移动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="充值标识" label-width="120px" prop="rechargeKey">
          <el-input v-model="form.rechargeKey" style="width:250px" size="small" />
        </el-form-item>
        <el-form-item label="最低充值" label-width="120px" prop="rechargeCost">
        <el-input-number v-model="form.minMoney" style="width:150px" size="small" controls-position="right" :precision="2" :step="0.01" :min="0" />
      </el-form-item>
        <el-form-item label="最高充值" label-width="120px" prop="rechargeCost">
        <el-input-number v-model="form.maxMoney" style="width:150px" size="small" controls-position="right" :precision="2" :step="0.01" :min="0" />
      </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-radio-group v-model="form.rechargeState">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button size="small" style="float:right;margin-left:20px;" type="primary" @click="save('form')">{{ form.siteID ? "立即保存" : "立即创建" }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Upload from '@/components/Upload'
export default {
  components: {
    Upload
  },
  data() {
    return {
      dataList: [],
      total: 0,
      page: 1,
      size: 10,
      form: {
        rechargeModeID: '',
        rechargeName: '',
        rechargeImg: '',
        rechargeType: '1',
        rechargeKey: '',
        minMoney: '',
        maxMoney: '',
        rechargeState: '1'
      },
      dialogVisible: false,
      rules: {
        rechargeName: [
          { required: true, message: '请输入充值名称', trigger: 'blur' }
        ],
        rechargeKey: [
          { required: true, message: '请输入充值标识', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    dialogVisible() {
      if (!this.dialogVisible) {
        this.cancel()
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList(page, size) {
      this.POST(
        '/finance/rechargeMode/page',
        {
          pageSize: this.size,
          pageNum: this.page
        },
        data => {
          const imgArr = []
          data.body.records.forEach(el => {
            if (el.rechargeImg) {
              imgArr.push(el.rechargeImg)
            }
            el.imgArr = imgArr
          })
          this.dataList = data.body.records
          this.size = data.body.size
          this.page = data.body.current
          this.total = data.body.total
        }
      )
    },
    _det(row) {
      this.form = {
        rechargeModeID: row.rechargeModeID,
        rechargeName: row.rechargeName,
        rechargeImg: row.rechargeImg || '',
        rechargeType: row.rechargeType,
        rechargeKey: row.rechargeKey,
        minMoney: row.minMoney,
        maxMoney: row.maxMoney,
        rechargeState: row.rechargeState
      }
      this.dialogVisible = true
    },
    _del(id) {
      var _this = this
      _this.$confirm('确定删除该条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.GET(
          '/finance/rechargeMode/delete',
          {
            id: id
          },
          data => {
            if (data.code == 1001) {
              _this.$message({
                message: '操作成功！',
                type: 'success'
              })
              this.getList()
            }
          }
        )
      })
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.POST(
            this.form.rechargeModeID ? '/finance/rechargeMode/update' : '/finance/rechargeMode/add',
            this.form,
            data => {
              if (data.code == 1001) {
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
                this.getList()
                this.dialogVisible = false
                this.cancel()
              }
            }
          )
        } else {
          return false
        }
      })
    },
    cancel() {
      this.form = {
        rechargeModeID: '',
        rechargeName: '',
        rechargeImg: '',
        rechargeType: 1,
        rechargeKey: '',
        minMoney: '',
        maxMoney: '',
        rechargeState: 1
      }
      this.$refs['form'].resetFields()
    },
    // 上传图片返回的信息
    showMessageFromChild(data) {
      this.form = {
        ...this.form,
        rechargeImg: data
      }
    },
    // 每页数量改变
    handleSizeChange(val) {
      this.size = val
      this.page = 1
      this.getList()
    },
    // 当前页面改变
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
