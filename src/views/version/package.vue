<template>
  <div class="app-container">

    <div class="btn-box">
      <el-button type="success" size="small" @click.stop="toDetail()">新建版本</el-button>
    </div>

    <el-table :data="dataList" style="width: 100%;margin-top:30px;" border size="mini">
      <el-table-column align="center" label="站点版本套餐ID" prop="sitePackageID" />
      <el-table-column align="center" label="站点版本套餐名称" prop="name" />
      <el-table-column align="center" label="站点版本ID" prop="editionID" />
      <el-table-column align="center" label="站点版本名称" prop="name">
        <template slot-scope="scope">
          <span>{{ scope.row.siteEdition ? scope.row.siteEdition.editionName : "" }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click.stop="toDetail(scope.row)">编辑</el-button>
          <el-button size="mini" type="primary" @click.stop="price(scope.row)">额度设置</el-button>
          <el-button size="mini" type="danger" @click.stop="delItem(scope.row.sitePackageID)">删除</el-button>
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

    <el-dialog
      title="新增"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form label-position="right" label-width="160px" :model="form">
        <el-form-item label="站点版本套餐名称">
          <el-input v-model="form.name" style="width:200px;" />
        </el-form-item>
        <el-form-item label="站点版本">
          <el-select v-model="form.editionID" filterable placeholder="请选择站点版本" :disabled="form.sitePackageID ? true : false">
            <el-option
              v-for="item in siteEditionList"
              :key="item.editionID"
              :label="item.editionName"
              :value="item.editionID"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="rowName + '额度列表'"
      :visible.sync="priceVisible"
      width="80%"
    >
      <el-button type="primary" size="mini" @click.stop="toPriceDetail()">新增额度</el-button>
      <el-table :data="priceList" style="width: 100%;margin-top:30px;" border size="mini">
        <el-table-column align="center" label="版本ID" prop="editionID" />
        <el-table-column align="center" label="版本名称" prop="editionName">
          <template slot-scope="scope">
            <span>{{ scope.row.siteEditionVO ? scope.row.siteEditionVO.editionName : "未知" }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="额度" prop="num">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.num" size="small" controls-position="right" :min="0" @change="handleChange($event,scope.row)" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="300px">
          <template slot-scope="scope">
            <!-- <el-button size="mini" type="primary" @click.stop="toPriceDetail(scope.row)">编辑</el-button> -->
            <el-button size="mini" type="danger" @click.stop="delIPrice(scope.row.sitePackageSizeID)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-box">
        <el-pagination
          :current-page="pricePage"
          :page-size="priceSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="priceTotal"
          @size-change="priceSizeChange"
          @current-change="priceCurrentChange"
        />
      </div>

      <el-dialog
        width="40%"
        :title="priceForm.sitePackageSizeID ? '编辑' : '新增' "
        :visible.sync="innerVisible"
        append-to-body
      >
        <el-form label-position="right" label-width="160px" :model="priceForm">
          <el-form-item label="站点版本名称">
            <el-select v-model="priceForm.editionID" filterable placeholder="请选择站点版本" :disabled="priceForm.sitePackageSizeID ? true : false">
              <el-option
                v-for="item in siteEditionList"
                :key="item.editionID"
                :label="item.editionName"
                :value="item.editionID"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="额度">
            <el-input v-model="priceForm.num" style="width:200px;" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="innerVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="handlePriceClose">确 定</el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'VersionList',
  data() {
    return {
      dataList: [],
      siteEditionList: [],
      total: 0,
      page: 1,
      size: 10,
      dialogVisible: false,
      priceVisible: false,
      innerVisible: false,
      form: {
        editionID: '',
        name: '',
        siteEdition: '',
        sitePackageID: ''
      },
      rowName: '',
      rowId: '',
      priceList: [],
      priceSize: 10,
      pricePage: 1,
      priceTotal: 0,
      priceForm: {
        sitePackageSizeID: '',
        sitePackageID: '',
        editionID: '',
        num: ''
      }
    }
  },
  watch: {
    dialogVisible() {
      if (!this.dialogVisible) {
        this.form = {
          editionID: '',
          name: '',
          siteEdition: '',
          sitePackageID: ''
        }
      }
    },
    innerVisible() {
      if (!this.innerVisible) {
        this.priceForm = {
          id: '',
          price: 0,
          editionRealID: ''
        }
      }
    }
  },
  created() {
    this.getList()
    this.getSiteEditionList()
  },
  methods: {
    getList(page, size) {
      this.POST(
        '/platform/sitePackage/page',
        {
          pageSize: this.size,
          pageNum: this.page
        },
        data => {
          this.dataList = data.body.records
          this.size = data.body.size
          this.page = data.body.current
          this.total = data.body.total
        }
      )
    },
    getSiteEditionList() {
      this.GET(
        '/platform/siteEdition/list',
        {},
        data => {
          this.siteEditionList = data.body
        }
      )
    },
    toDetail(row) {
      this.dialogVisible = true
      if (row) {
        this.form = {
          editionID: row.editionID,
          name: row.name,
          siteEdition: row.siteEdition,
          sitePackageID: row.sitePackageID
        }
      }
    },
    handleClose() {
      var _this = this
      this.POST(
        this.form.sitePackageID ? '/platform/sitePackage/update' : '/platform/sitePackage/add',
        this.form.sitePackageID ? {
          name: this.form.name,
          sitePackageID: this.form.sitePackageID
        } : {
          name: this.form.name,
          editionID: this.form.editionID
        },
        data => {
          _this.$message({
            message: _this.form.editionID ? '修改成功' : '新增成功',
            type: 'success'
          })
          _this.getList()
          _this.dialogVisible = false
        }
      )
    },
    delItem(id) {
      var _this = this
      _this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.GET(
          '/platform/sitePackage/delete',
          {
            id: id
          },
          data => {
            _this.$message({
              message: '删除成功',
              type: 'success'
            })
            _this.getList()
          }
        )
      }).catch(() => {

      })
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
    },

    getSizeList(id) {
      this.POST(
        '/platform/sitePackageSize/page',
        {
          sitePackageID: this.rowId,
          pageSize: this.priceSize,
          pageNum: this.pricePage
        },
        data => {
          this.priceList = data.body.records
          this.priceSize = data.body.size
          this.pricePage = data.body.current
          this.priceTotal = data.body.total
        }
      )
    },

    // 每页数量改变
    priceSizeChange(val) {
      this.priceSize = val
      this.pricePage = 1
      this.getSizeList()
    },
    // 当前页面改变
    priceCurrentChange(val) {
      this.pricePage = val
      this.getSizeList()
    },

    price(row) {
      this.priceVisible = true
      this.rowName = row.name
      this.rowId = row.sitePackageID
      this.getSizeList()
    },

    delIPrice(id) {
      var _this = this
      _this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.GET(
          '/platform/sitePackageSize/delete',
          {
            id: id
          },
          data => {
            _this.$message({
              message: '删除成功',
              type: 'success'
            })
            _this.getSizeList()
          }
        )
      }).catch(() => {

      })
    },

    toPriceDetail(row) {
      if (row) {
        this.priceForm = {
          sitePackageSizeID: row.sitePackageSizeID,
          sitePackageID: row.sitePackageID,
          editionID: row.editionID,
          num: row.num
        }
      }
      this.innerVisible = true
    },
    handlePriceClose() {
      var _this = this
      // if(_this.priceForm.sitePackageID){
      //   _this.POST(
      //     '/platform/sitePackageSize/update',
      //     {
      //       sitePackageSizeID:_this.priceForm.sitePackageSizeID,
      //       num:_this.priceForm.num
      //     },
      //     data => {
      //       _this.$message({
      //         message:'修改成功',
      //         type: 'success'
      //       })
      //       _this.getSizeList()
      //       _this.innerVisible = false
      //     }
      //   )
      // }else{
      _this.POST(
        '/platform/sitePackageSize/add',
        {
          editionID: _this.priceForm.editionID,
          sitePackageID: _this.rowId,
          num: _this.priceForm.num
        },
        data => {
          _this.$message({
            message: '新增成功',
            type: 'success'
          })
          _this.getSizeList()
          _this.innerVisible = false
        }
      )
      // }
    },
    handleChange(value, row) {
      var _this = this
      if (!value && value != 0) {
        this.$message.error('额都不能为空')
        return
      }
      _this.POST(
        '/platform/sitePackageSize/update',
        {
          sitePackageSizeID: row.sitePackageSizeID,
          num: value
        },
        data => {
          _this.$message({
            message: '修改成功',
            type: 'success'
          })
          _this.getSizeList()
        }
      )
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
