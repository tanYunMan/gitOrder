<template>
  <div class="app-container">

    <el-form :inline="true">
      <el-form-item label="版本类型">
        <el-select v-model="serchForm.editionType" size="small" filterable placeholder="请选择版本类型" clearable>
          <el-option :value="1" label="主站">主站</el-option>
          <el-option :value="2" label="分站">分站</el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click.stop="search()">查询</el-button>
      </el-form-item>
    </el-form>

    <div class="btn-box">
      <el-button type="success" size="small" @click.stop="toDetail()">新建版本</el-button>
    </div>

    <el-table row-key="editionID" :data="dataList" style="width: 100%;margin-top:30px;" border size="mini">
      <el-table-column align="center" label="版本名称" prop="editionName" width="140px" />
      <el-table-column align="center" label="版本序号" prop="sort" width="140px" />
      <el-table-column align="center" label="版本类型" prop="editionType" width="100px">
        <template slot-scope="scope">
          <template>{{ scope.row.editionType == 1 ? "主站" : "分站" }}</template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否有全网权限" prop="isConnect" width="140px">
        <template slot-scope="scope">
          <template>{{ scope.row.isConnect == 1 ? "是" : "否" }}</template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="全网数量" prop="connectNum" width="100px" />
      <el-table-column align="center" label="是否有批量对接权限" prop="isBatch" width="160px">
        <template slot-scope="scope">
          <template>{{ scope.row.isBatch == 1 ? "是" : "否" }}</template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否有二次全网权限" prop="isConnect2" width="160px">
        <template slot-scope="scope">
          <template>{{ scope.row.isConnect2 == 1 ? "是" : "否" }}</template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否自营商品" prop="isSelf" width="120px">
        <template slot-scope="scope">
          <template>{{ scope.row.isConnect2 == 1 ? "是" : "否" }}</template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否有可对接" prop="isJoin" width="120px">
        <template slot-scope="scope">
          <template>{{ scope.row.isJoin == 1 ? "是" : "否" }}</template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否可自主创建" prop="isSelfCreate" width="120px">
        <template slot-scope="scope">
          <template>{{ scope.row.isSelfCreate == 1 ? "是" : "否" }}</template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="自营商品数量" prop="selfNum" width="140px" />
      <el-table-column align="center" label="操作" width="300px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click.stop="toDetail(scope.row)">编辑</el-button>
          <el-button size="mini" type="primary" @click.stop="price(scope.row)">价格设置</el-button>
          <el-button size="mini" type="danger" @click.stop="delItem(scope.row.editionID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <div class="pagination-box">
      <el-pagination
        :current-page="page"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div> -->

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

    <el-dialog
      title="新增"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form label-position="right" label-width="160px" :model="form" :rules="rule" ref="addForm">
        <el-form-item label="版本名称">
          <el-input v-model="form.editionName" style="width:200px;" />
        </el-form-item>
        <el-form-item label="版本类型" prop="editionType">
          <el-radio-group v-model="form.editionType">
            <el-radio label="1">主站</el-radio>
            <el-radio label="2">分站</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="全网权限" prop="isConnect">
          <el-radio-group v-model="form.isConnect">
            <el-radio label="1">有</el-radio>
            <el-radio label="0">无</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="全网数量">
          <el-input v-model="form.connectNum" style="width:120px;" />
        </el-form-item>
        <el-form-item label="批量对接权限" prop="isBatch">
          <el-radio-group v-model="form.isBatch">
            <el-radio label="1">有</el-radio>
            <el-radio label="0">无</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="二次全网权限" prop="isConnect2">
          <el-radio-group v-model="form.isConnect2">
            <el-radio label="1">有</el-radio>
            <el-radio label="0">无</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否自营商品"  prop="isSelf">
          <el-radio-group v-model="form.isSelf">
            <el-radio label="1">有</el-radio>
            <el-radio label="0">无</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否有可对接" prop="isJoin">
          <el-radio-group v-model="form.isJoin" >
            <el-radio label="1">有</el-radio>
            <el-radio label="0">无</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否可自主创建"  prop="isSelfCreate">
          <el-radio-group v-model="form.isSelfCreate">
            <el-radio label="1">有</el-radio>
            <el-radio label="0">无</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="自营商品数量">
          <el-input v-model="form.selfNum" style="width:120px;" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="rowName + '价格列表'"
      :visible.sync="priceVisible"
      width="50%"
    >
      <el-button type="primary" size="mini" @click.stop="toPriceDetail()">新增价格</el-button>
      <el-table :data="priceList" style="width: 100%;margin-top:30px;" border>
        <el-table-column align="center" label="版本名称" prop="editionReal">
          <template slot-scope="scope">
            <span>{{ scope.row.editionReal? scope.row.editionReal.editionName : "" }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="购买价格" prop="price" />
        <el-table-column align="center" label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click.stop="toPriceDetail(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click.stop="delIPrice(scope.row.siteSitePriceID)">删除</el-button>
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
        :title="priceForm.id ? '编辑' : '新增' "
        :visible.sync="innerVisible"
        append-to-body
      >
        <el-form label-position="right" label-width="160px" :model="priceForm">
          <el-form-item label="版本名称">
            <el-select v-model="priceForm.editionRealID" placeholder="请选择" :disabled="priceForm.id ? true : false">
              <el-option
                v-for="item in dataList"
                :key="item.editionID"
                :label="item.editionName"
                :value="item.editionID"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="购买价格">
            <el-input v-model="priceForm.price" style="width:200px;" />
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
import Sortable from 'sortablejs'
export default {
  name: 'VersionList',
  data() {
    return {
      rule:{
         editionType:[
          {required:true,trigger: 'change',message:'请选择'},
          {max:1, trigger: 'change',message:'请选择'}
        ],
         isConnect:[
          {required:true,trigger: 'change',message:'请选择'},
          {max:1, trigger: 'change',message:'请选择'}
        ],
         isBatch:[
          {required:true,trigger: 'change',message:'请选择'},
          {max:1, trigger: 'change',message:'请选择'}
        ],
         isConnect2:[
          {required:true,trigger: 'change',message:'请选择'},
          {max:1, trigger: 'change',message:'请选择'}
        ],
         isSelf:[
          {required:true,trigger: 'change',message:'请选择'},
          {max:1, trigger: 'change',message:'请选择'}
        ],
         isJoin:[
          {required:true,trigger: 'change',message:'请选择'},
          {max:1, trigger: 'change',message:'请选择'}
        ],
        isSelfCreate:[
          {required:true,trigger: 'change',message:'请选择'},
          {max:1, trigger: 'change',message:'请选择'}
        ],
      },
      dataList: [],
      total: 0,
      page: 1,
      size: 10,
      serchForm: {
        editionType: ''
      },
      dialogVisible: false,
      priceVisible: false,
      innerVisible: false,
      form: {
        editionID: '',
        editionName: '',
        editionType: '1',
        isConnect: '1',
        connectNum: 0,
        isBatch: '1',
        isConnect2: '1',
        isSelf: '1',
        isJoin: '1',
        isSelfCreate :'1',
        selfNum: 0
      },
      rowName: '',
      rowId: '',
      priceList: [],
      priceSize: 10,
      pricePage: 1,
      priceTotal: 0,
      priceForm: {
        id: '',
        price: 0,
        editionRealID: ''
      }
    }
  },
  watch: {
    dialogVisible() {
      if (!this.dialogVisible) {
        this.form = {
          editionID: '',
          editionName: '',
          editionType: '1',
          isConnect: '1',
          connectNum: 0,
          isBatch: '1',
          isConnect2: '1',
          isSelf: '1',
          isJoin: '1',
          isSelfCreate :'1',
          selfNum: 0
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
  },
  mounted() {
    this.$nextTick(() => {
      this.rowDrop()
    })
  },
  methods: {
    // 行拖拽
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.dataList.splice(oldIndex, 1)[0]

          _this.dataList.splice(1, 0, currRow)
          _this.sortClick(newIndex, oldIndex, currRow)
        }
      })
    },

    // 排序
    sortClick(newIndex, oldIndex, currRow) {
      const formSort = {
        editionID: currRow.editionID,
        beforIndex: this.dataList[oldIndex].sort,
        sortIndex: this.dataList[newIndex].sort
      }
      this.POST(
        '/platform/siteEdition/dragSort',
        formSort,
        data => {
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
          this.getList()
        }
      )
    },

    search() {
      this.page = 1
      this.getList()
    },
    getList(page, size) {
      const form = Object.assign({}, this.serchForm, {
        pageNum: page || 1,
        pageSize: size || 10
      })
      this.POST(
        '/platform/siteEdition/page',
        form,
        data => {
          this.dataList = data.body.records
          this.size = data.body.size
          this.page = data.body.current
          this.total = data.body.total
        }
      )
    },
    toDetail(row) {
      this.dialogVisible = true
      if (row) {
        this.form = {
          editionID: row.editionID,
          editionName: row.editionName,
          editionType: row.editionType + '',
          isConnect: row.isConnect + '',
          connectNum: row.connectNum,
          isBatch: row.isBatch + '',
          isConnect2: row.isConnect2 + '',
          isSelf: row.isSelf + '',
          isJoin: row.isJoin + '',
          isSelfCreate:row.isSelfCreate + '',
          selfNum: row.selfNum
        }
      }
      console.log(this.form)
    },
    handleClose() {
      var _this = this
      this.$refs['addForm'].validate((valid)=>{
        if(valid){
           this.POST(
              this.form.editionID ? '/platform/siteEdition/update' : '/platform/siteEdition/add',
              this.form,
              data => {
                _this.$message({
                  message: _this.form.editionID ? '修改成功' : '新增成功',
                  type: 'success'
                })
                _this.getList()
                _this.dialogVisible = false
              }
            )
        }
      })
    
    },
    delItem(id) {
      var _this = this
      _this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.GET(
          '/platform/siteEdition/delete',
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
      this.getList(this.page, this.size)
    },
    // 当前页面改变
    handleCurrentChange(val) {
      this.page = val
      this.getList(this.page, this.size)
    },

    getPriceList(id) {
      this.POST(
        '/platform/siteSitePrice/page',
        {
          editionID: this.rowId,
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
      this.rowId = row.editionID
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
          '/platform/siteSitePrice/delete',
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

    toPriceDetail(row) {
      if (row) {
        this.priceForm = {
          id: row.siteSitePriceID,
          price: row.price,
          editionRealID: row.editionRealID
        }
      }
      this.innerVisible = true
    },
    handlePriceClose() {
      var _this = this
      if (_this.priceForm.id) {
        _this.POST(
          '/platform/siteSitePrice/update',
          {
            siteSitePriceID: _this.priceForm.id,
            price: _this.priceForm.price
          },
          data => {
            _this.$message({
              message: '修改成功',
              type: 'success'
            })
            _this.getPriceList()
            _this.innerVisible = false
          }
        )
      } else {
        _this.POST(
          '/platform/siteSitePrice/add',
          {
            editionID: _this.rowId,
            editionRealID: _this.priceForm.editionRealID,
            price: _this.priceForm.price
          },
          data => {
            _this.$message({
              message: '新增成功',
              type: 'success'
            })
            _this.getPriceList()
            _this.innerVisible = false
          }
        )
      }
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
