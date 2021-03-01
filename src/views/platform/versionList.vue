<template>
  <div class="app-container">
    <div class="btn-box">
      <el-button type="success" size="small" @click.stop="toDetail()">新建版本</el-button>
    </div>

    <el-table :data="dataList" style="width: 100%;margin-top:30px;" border size="mini">
      <el-table-column align="center" label="版本编号" prop="platformEditionID" />
      <el-table-column align="center" label="版本名称" prop="editionName" />
      <el-table-column align="center" label="操作" width="450px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="toDetail(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="delItem(scope.row.platformEditionID)">删除</el-button>
          <el-button size="mini" type="primary" @click="price(scope.row)">价格设置</el-button>
          <el-button size="mini" type="primary" @click="limit(scope.row)">额度设置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-box">
      <el-pagination
        :current-page="page"
        :page-sizes="PageSizes"
        :page-size="PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog :title="form.platformEditionID ? '修改版本' : '新增版本' " :visible.sync="Visible">
      <el-form :model="form">
        <el-form-item label="版本名称" label-width="120px" prop="editionName">
          <el-input v-model="form.editionName" style="width:250px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Visible = false">取 消</el-button>
        <el-button type="primary" @click="save()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 价格列表 -->
    <el-dialog
      :title="rowName + '价格列表'"
      :visible.sync="priceVisible"
      width="80%"
    >
      <el-button type="primary" size="mini" @click.stop="toPriceDetail()">新增价格</el-button>
      <el-table :data="priceList" style="width: 100%;margin-top:30px;" border size="mini">
        <el-table-column align="center" label="站点版本ID" prop="editionID" />
        <el-table-column align="center" label="站点版本名称" prop="platformEditionVO">
          <template slot-scope="scope">
            <span>{{ scope.row.platformEditionVO ? scope.row.platformEditionVO.editionName : "未知" }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="价格" prop="price">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.price" size="small" controls-position="right" :min="0" @change="handleChange($event,scope.row)" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click.stop="delIPrice(scope.row.platformSitePriceID)">删除</el-button>
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
          <el-form-item label="价格">
            <!-- <el-input v-model="priceForm.price" style="width:200px;"></el-input> -->
            <el-input-number v-model="priceForm.price" controls-position="right" :min="0" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="innerVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="handlePriceClose">确 定</el-button>
        </span>
      </el-dialog>
    </el-dialog>

    <!-- 额度列表 -->
    <el-dialog
      :title="rowName + '额度列表'"
      :visible.sync="limitVisible"
      width="80%"
    >
      <el-button type="primary" size="mini" @click.stop="toLimitDetail()">额度价格</el-button>
      <el-table :data="limitList" style="width: 100%;margin-top:30px;" border size="mini">
        <el-table-column align="center" label="站点版本ID" prop="editionID" />
        <el-table-column align="center" label="站点版本名称" prop="edition">
          <template slot-scope="scope">
            <span>{{ scope.row.edition ? scope.row.edition.editionName : "未知" }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="额度" prop="price">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.limitNum" size="small" controls-position="right" :min="0" @change="handleChange($event,scope.row)" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click.stop="delILimit(scope.row.siteLimitID)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-box">
        <el-pagination
          :current-page="limitPage"
          :page-size="PageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="limitTotal"
          @size-change="priceSizeChange"
          @current-change="priceCurrentChange"
        />
      </div>

      <el-dialog
        width="40%"
        :title="priceForm.sitePackageSizeID ? '编辑' : '新增' "
        :visible.sync="innerlimitVisible"
        append-to-body
      >
        <el-form ref="form" label-position="right" label-width="160px" :model="priceForm">
          <el-form-item label="站点版本名称" prop="editionID">
            <el-select v-model="priceForm.editionID" filterable placeholder="请选择站点版本" :disabled="priceForm.sitePackageSizeID ? true : false">
              <el-option
                v-for="item in siteEditionList"
                :key="item.editionID"
                :label="item.editionName"
                :value="item.editionID"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="额度" prop="limitNum">
            <el-input-number v-model="priceForm.limitNum" controls-position="right" :min="0" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="innerlimitVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="handlePriceClose">确 定</el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataList: [],
      total: 0,
      page: 1,
      size: 10,
      form: {
        platformEditionID: '',
        editionName: ''
      },
      Visible: false,
      priceVisible: false,
      innerVisible: false,
      rowName: '',
      rowId: '',
      priceList: [],
      priceSize: 10,
      pricePage: 1,
      priceTotal: 0,
      priceForm: {
        platformEditionID: '',
        editionID: '',
        price: ''
      },
      siteEditionList: [],
      limitVisible: false,
      innerlimitVisible: false,
      limitList: [],
      limitSize: 10,
      limitPage: 1,
      limitTotal: 0,
      limitForm: {
        platformEditionID: '',
        editionID: '',
        limitNum: ''
      }
    }
  },
  watch: {
    'innerVisible': function() {
      if (!this.innerVisible) {
        this.priceForm = {
          platformEditionID: '',
          editionID: '',
          price: ''
        }
      }
    },
    'innerlimitVisible': function() {
      if (!this.innerlimitVisible) {
        this.limitForm = {
          platformEditionID: '',
          editionID: '',
          limitNum: ''
        }
        console.log(this.$refs['form'])
        this.$refs['form'].resetFields()
      }
    }
  },
  mounted() {
    this.getList()
    this.getSiteEdition()
  },
  methods: {
    getList(page, size) {
      this.POST(
        '/platform/platformEdition/page',
        {
          pageNum: page || 1,
          pageSize: size || 10
        },
        data => {
          this.dataList = data.body.records
          this.page = data.body.current
          this.size = data.body.size
          this.total = data.body.total
        }
      )
    },
    // 每页数量改变
    handleSizeChange(val) {
      this.size = val
      this.page = 1
      this.getList(this.page, this.size)
    },
    // 当前页面改变
    handleCurrentChange(val) {
      this.page = val
      this.getList(this.page, this.size)
    },
    delItem(id) {
      var _this = this
      _this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.GET(
          '/platform/platformEdition/delete',
          {
            id: id
          },
          data => {
            _this.$message({
              message: '删除成功',
              type: 'success'
            })
            _this.getList()
          })
      }).catch(() => {

      })
    },
    toDetail(row) {
      if (row) {
        this.form = {
          platformEditionID: row.platformEditionID,
          editionName: row.editionName
        }
      }
      this.Visible = true
    },
    save() {
      var _this = this
      if (this.form.platformEditionID) {
        _this.POST(
          '/platform/platformEdition/update',
          this.form,
          data => {
            _this.$message({
              message: '修改成功',
              type: 'success'
            })
            _this.getList()
            _this.Visible = false
          }
        )
      } else {
        var _this = this
        const form = _this.form
        delete form['platformEditionID']
        _this.POST(
          '/platform/platformEdition/add',
          form,
          data => {
            _this.$message({
              message: '新增成功',
              type: 'success'
            })
            _this.getList()
            _this.Visible = false
          }
        )
      }
    },

    // 获取站点版本
    getSiteEdition() {
      this.GET(
        '/platform/siteEdition/list',
        {},
        data => {
          this.siteEditionList = data.body
        }
      )
    },

    // 价格设置模块
    getPriceList(id) {
      this.POST(
        '/platform/platformSitePrice/page',
        {
          platformEditionID: this.rowId,
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
      this.getPriceList()
    },
    // 当前页面改变
    priceCurrentChange(val) {
      this.pricePage = val
      this.getPriceList()
    },

    price(row) {
      this.priceVisible = true
      this.rowName = row.editionName
      this.rowId = row.platformEditionID
      this.getPriceList()
    },

    delIPrice(id) {
      var _this = this
      _this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.GET(
          '/platform/platformSitePrice/delete',
          {
            id: id
          },
          data => {
            _this.$message({
              message: '删除成功',
              type: 'success'
            })
            _this.getPriceList()
          }
        )
      }).catch(() => {

      })
    },

    toPriceDetail() {
      this.innerVisible = true
    },
    handlePriceClose() {
      var _this = this
      _this.priceForm.platformEditionID = this.rowId
      _this.POST(
        '/platform/platformSitePrice/add',
        _this.priceForm,
        data => {
          _this.$message({
            message: '新增成功',
            type: 'success'
          })
          _this.getPriceList()
          _this.innerVisible = false
        }
      )
    },
    handleChange(value, row) {
      var _this = this
      if (!value && value != 0) {
        this.$message.error('价格不能为空')
        return
      }
      _this.POST(
        '/platform/platformSitePrice/update',
        {
          platformSitePriceID: row.platformSitePriceID,
          price: value
        },
        data => {
          _this.$message({
            message: '修改成功',
            type: 'success'
          })
          _this.getSizeList()
        }
      )
    },

    // 额度设置模块
    getlimitList(id) {
      this.POST(
        '/platform/siteLimit/page',
        {
          platformEditionID: this.rowId,
          pageSize: this.limitSize,
          pageNum: this.limitPage
        },
        data => {
          this.limitList = data.body.records
          this.limitSize = data.body.size
          this.limitPage = data.body.current
          this.limitTotal = data.body.total
        }
      )
    },

    // 每页数量改变
    priceSizeChange(val) {
      this.limitSize = val
      this.limitPage = 1
      this.getlimitList()
    },
    // 当前页面改变
    priceCurrentChange(val) {
      this.limitPage = val
      this.getlimitList()
    },

    limit(row) {
      this.limitVisible = true
      this.rowName = row.editionName
      this.rowId = row.platformEditionID
      this.getlimitList()
    },

    delILimit(id) {
      var _this = this
      _this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.GET(
          '/platform/siteLimit/delete',
          {
            id: id
          },
          data => {
            _this.$message({
              message: '删除成功',
              type: 'success'
            })
            _this.getlimitList()
          }
        )
      }).catch(() => {

      })
    },

    toLimitDetail() {
      this.innerlimitVisible = true
    },
    handlePriceClose() {
      var _this = this
      _this.priceForm.platformEditionID = this.rowId
      _this.POST(
        '/platform/siteLimit/add',
        _this.priceForm,
        data => {
          _this.$message({
            message: '新增成功',
            type: 'success'
          })
          _this.getlimitList()
          _this.innerlimitVisible = false
        }
      )
    },
    handleChange(value, row) {
      var _this = this
      if (!value && value != 0) {
        this.$message.error('价格不能为空')
        return
      }
      _this.POST(
        '/platform/siteLimit/update',
        {
          siteLimitID: row.siteLimitID,
          limitNum: value
        },
        data => {
          _this.$message({
            message: '修改成功',
            type: 'success'
          })
          _this.getlimitList()
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
