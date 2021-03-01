<template>
  <div class="app-container">
    <div class="btn-box">

      <el-form label-position="right" :inline="true" :model="form">
        <el-form-item label="平台名称">
          <el-input v-model="form.platformName" size="small" style="width:200px;" clearable />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="form.contacts" size="small" style="width:200px;" clearable />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" size="small" style="width:200px;" clearable />
        </el-form-item>
        <el-form-item label="介绍">
          <el-input v-model="form.remark" size="small" style="width:200px;" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.isEnable" size="small" filterable placeholder="请选择状态" clearable>
            <el-option value="1" label="可用">可用</el-option>
            <el-option value="0" label="不可用">不可用</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getList()">查询</el-button>
          <el-button type="success" size="small" @click.stop="dialogVisible = true">新建平台</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="dataList" style="width: 100%;margin-top:30px;" border size="mini">
      <el-table-column align="center" label="平台名称" prop="platformName" width="140px" />
      <el-table-column align="center" label="版本名称" prop="platformPackage" width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.platformEdition ? scope.row.platformEdition.editionName : "" }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="isEnable" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.isEnable == "1" ? "可用" : "禁用" }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否对接其他平台货物" prop="isDocking" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.isDocking == "1" ? "可对接" : "不可对接" }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否允许被其他站点对接" prop="isShare" width="220px">
        <template slot-scope="scope">
          <span>{{ scope.row.isShare == "1" ? "允许" : "不允许" }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人" prop="contacts" width="120px" />
      <el-table-column align="center" label="电话" prop="phone" width="120px" />
      <el-table-column align="center" label="证件号码" prop="iDNumber" width="120px" />
      <el-table-column align="center" label="地址" prop="iDAddr" width="220px" />
      <el-table-column align="center" label="介绍" prop="remark" width="220px" />
      <el-table-column align="center" label="操作" width="550px" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click.stop="resetPass(scope.row.adminID)">重置登录密码</el-button>
          <el-button size="mini" type="primary" @click.stop="resetDealPass(scope.row.adminID)">重置交易密码</el-button>
          <el-button size="mini" type="primary" @click="limit(scope.row)">额度设置</el-button>
          <el-button size="mini" type="primary" @click.stop="_det(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click.stop="_del(scope.row.platformID)">删除</el-button>
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

    <el-dialog :title="viewForm.platformID ? '修改平台' : '新增平台' " :visible.sync="dialogVisible">
      <el-form ref="form" :model="viewForm" :rules="rules">
        <el-form-item label="平台名称" label-width="120px" prop="platformName">
          <el-input v-model="viewForm.platformName" style="width:250px" size="small" />
        </el-form-item>
        <el-form-item label="版本t套餐" label-width="120px" prop="platformPackageID">
          <el-select v-model="viewForm.platformPackageID" style="width:250px" size="small" placeholder="请选择平台版本" :disabled="viewForm.platformID ? true: false">
            <el-option
              v-for="item in platformPackageList"
              :key="item.platformPackageID"
              :label="item.name"
              :value="item.platformPackageID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="登录帐号" label-width="120px" prop="login">
          <el-input v-model="viewForm.login" size="small" style="width:250px" :disabled="viewForm.platformID ? true: false" />
        </el-form-item>
        <el-form-item label="登录密码" label-width="120px" prop="password">
          <el-input v-model="viewForm.password" size="small" style="width:250px" :disabled="viewForm.platformID ? true: false" />
        </el-form-item>
        <el-form-item label="联系人" label-width="120px" prop="contacts">
          <el-input v-model="viewForm.contacts" size="small" style="width:250px" />
        </el-form-item>
        <el-form-item label="电话" label-width="120px" prop="phone">
          <el-input v-model="viewForm.phone" size="small" style="width:250px" />
        </el-form-item>
        <el-form-item label="证件号码" label-width="120px">
          <el-input v-model="viewForm.iDNumber" size="small" style="width:250px" />
        </el-form-item>
        <el-form-item label="地址" label-width="120px">
          <el-input v-model="viewForm.iDAddr" size="small" style="width:250px" />
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-radio-group v-model="viewForm.isEnable">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="对接其他平台" label-width="120px">
          <el-radio-group v-model="viewForm.isDocking">
            <el-radio label="1">可对接</el-radio>
            <el-radio label="0">不可对接</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="被其他平台对接" label-width="120px">
          <el-radio-group v-model="viewForm.isShare">
            <el-radio label="1">允许</el-radio>
            <el-radio label="0">不允许</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="介绍" label-width="120px" prop="remark">
          <el-input
            v-model="viewForm.remark"
            style="width:350px"
            type="textarea"
            :rows="4"
            placeholder="请输入平台介绍"
          />
        </el-form-item>
        <el-form-item>
          <el-button size="small" style="float:right;margin-left:20px;" type="primary" @click="save('form')">{{ form.siteID ? "立即保存" : "立即创建" }}</el-button>
        </el-form-item>
      </el-form>
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
            <span>{{ scope.row.siteEditionVO ? scope.row.siteEditionVO.editionName : "未知" }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="额度" prop="price">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.num" size="small" controls-position="right" :min="0" @change="handleChange($event,scope.row)" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click.stop="delILimit(scope.row.platformSiteQuota)">删除</el-button>
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
        :title="limitForm.platformSiteQuota ? '编辑' : '新增' "
        :visible.sync="innerlimitVisible"
        append-to-body
      >
        <el-form ref="form" label-position="right" label-width="160px" :model="limitForm">
          <el-form-item label="站点版本名称" prop="editionID">
            <el-select v-model="limitForm.editionID" filterable placeholder="请选择站点版本" :disabled="limitForm.platformSiteQuota ? true : false">
              <el-option
                v-for="item in siteEditionList"
                :key="item.editionID"
                :label="item.editionName"
                :value="item.editionID"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="额度" prop="num">
            <el-input-number v-model="limitForm.num" controls-position="right" :min="0" />
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
        platformName: '',
        contacts: '',
        phone: '',
        remark: '',
        isEnable: null
      },
      dialogVisible: false,
      viewForm: {
        platformID: '',
        platformName: '',
        platformPackageID: '',
        contacts: '',
        phone: '',
        iDNumber: '',
        iDAddr: '',
        remark: '',
        isEnable: '0',
        isDocking: '0',
        isShare: '0',
        login: '',
        password: ''
      },
      platformPackageList: [],
      rules: {
        platformName: [
          { required: true, message: '请输入平台名称', trigger: 'blur' }
        ],
        platformPackageID: [
          { required: true, message: '请选择平台版本', trigger: 'change' }
        ],
        login: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        contacts: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入电话', trigger: 'blur' }
        ]
      },
      rowName: '',
      rowId: '',
      siteEditionList: [],
      limitVisible: false,
      innerlimitVisible: false,
      limitList: [],
      limitSize: 10,
      limitPage: 1,
      limitTotal: 0,
      limitForm: {
        editionID: '',
        num: ''
      }
    }
  },
  watch: {
    dialogVisible() {
      if (!this.dialogVisible) {
        this.rest()
      }
    }
  },
  mounted() {
    this.getList()
    this.getSiteEdition()
    this.getPlatformPackage()
  },
  methods: {
    getList(page, size) {
      this.POST(
        '/platform/platform/page',
        {
          pageSize: this.size,
          pageNum: this.page,
          platformName: this.form.platformName,
          contacts: this.form.contacts,
          phone: this.form.phone,
          remark: this.form.remark,
          isEnable: this.form.isEnable ? this.form.isEnable : ''
        },
        data => {
          this.dataList = data.body.records
          this.size = data.body.size
          this.page = data.body.current
          this.total = data.body.total
        }
      )
    },
    getPlatformPackage() {
      this.GET(
        '/platform/platformPackage/list',
        {},
        data => {
          this.platformPackageList = data.body
        }
      )
    },
    _det(row) {
      this.dialogVisible = true
      this.viewForm = {
        platformID: row.platformID,
        platformName: row.platformName,
        platformPackageID: '不可修改',
        contacts: row.contacts,
        phone: row.phone,
        iDNumber: row.iDNumber,
        iDAddr: row.iDAddr,
        remark: row.remark,
        isEnable: row.isEnable + '',
        isDocking: row.isDocking + '',
        isShare: row.isShare + '',
        login: '不可修改',
        password: '不可修改'
      }
    },
    _del(id) {

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
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.viewForm.platformID) {
            this.viewForm.platformPackageID = ''
            this.viewForm.login = ''
            this.viewForm.password = ''
            this.siteUpdate()
          } else {
            this.siteAdd()
          }
        } else {
          return false
        }
      })
    },
    siteUpdate() {
      this.POST(
        '/platform/platform/update',
        this.viewForm,
        data => {
          if (data.code == 1001) {
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
            this.getList()
            this.dialogVisible = false
          }
        }
      )
    },
    siteAdd() {
      delete this.viewForm['platformID']
      this.POST(
        '/platform/platform/create',
        this.viewForm,
        data => {
          if (data.code == 1001) {
            this.$message({
              message: '新增成功！',
              type: 'success'
            })
            this.getList()
            this.dialogVisible = false
          }
        }
      )
    },
    rest() {
      this.$refs['form'].resetFields()
      this.viewForm = {
        platformName: '',
        platformEditionID: '',
        contacts: '',
        phone: '',
        iDNumber: '',
        iDAddr: '',
        remark: '',
        isEnable: '0',
        isDocking: '0',
        isShare: '0',
        login: '',
        password: ''
      }
    },
    resetPass(id) {
      var _this = this
      _this.$confirm('确定要重置登录密码吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.POST(
          '/user/user/resetUserPassword',
          {
            userID: id
          },
          data => {
            if (data.code == 1001) {
              this.$alert(`重置成功！新的交易密码为：${data.msg}`, '提示', {
                confirmButtonText: '确定'
              })
            }
          }
        )
      })
    },
    resetDealPass(id) {
      var _this = this
      _this.$confirm('确定要重置登录密码吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.POST(
          '/user/user/resetTransactionPassword',
          {
            userID: id
          },
          data => {
            if (data.code == 1001) {
              this.$alert(`重置成功！新的交易密码为：${data.msg}`, '提示', {
                confirmButtonText: '确定'
              })
            }
          }
        )
      })
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

    // 额度设置模块
    getlimitList(id) {
      this.POST(
        '/platform/platformSiteQuota/page',
        {
          platformID: this.rowId,
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
      this.rowName = row.platformName
      this.rowId = row.platformID
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
          '/platform/platformSiteQuota/delete',
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
      _this.limitForm.platformID = this.rowId
      _this.POST(
        '/platform/platformSiteQuota/saveOrUpdate',
        _this.limitForm,
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
        this.$message.error('额度不能为空')
        return
      }
      _this.POST(
        '/platform/platformSiteQuota/saveOrUpdate',
        {
          platformID: this.rowId,
          editionID: row.editionID,
          num: value
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
