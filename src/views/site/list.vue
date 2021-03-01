<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="站点信息">
        <el-input v-model="serchForm.siteName" placeholder="请输入站点ID或站点名称" clearable size="small" />
      </el-form-item>
      <el-form-item label="联系人信息">
        <el-input v-model="serchForm.contacts" placeholder="请输入联系人名称或电话" clearable size="small" />
      </el-form-item>
      <el-form-item label="域名前缀">
        <el-input v-model="serchForm.domainPre" placeholder="请输入域名前缀" clearable size="small" />
      </el-form-item>
      <el-form-item label="站点版本">
        <el-select v-model="serchForm.editionID" size="small" placeholder="请选择站点版本" clearable filterable>
          <el-option
            v-for="item in siteEditionList"
            :key="item.editionID"
            :label="item.editionName"
            :value="item.editionID"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="serchForm.isEnable" size="small" filterable placeholder="请选择状态" clearable>
          <el-option value="0" label="禁用">禁用</el-option>
          <el-option value="1" label="启动">启动</el-option>
          <el-option value="2" label="到期">到期</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="对接权限">
        <el-select v-model="serchForm.isConnect" size="small" filterable placeholder="请选择对接权限" clearable>
          <el-option value="0" label="未开通">未开通</el-option>
          <el-option value="1" label="已开通">已开通</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="到期时间">
        <el-date-picker
          v-model="time"
          size="small"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changeTime"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click.stop="search()">查询</el-button>
      </el-form-item>
    </el-form>

    <div class="btn-box">
      <el-button type="success" size="small" @click.stop="toDetail()">新建站点</el-button>
    </div>

    <el-table :data="dataList" style="width: 100%;margin-top:30px;" border size="mini">
      <el-table-column align="center" label="站点ID" prop="siteID" width="120px" />
      <el-table-column align="center" label="站点名称" prop="siteName" width="200px" />
      <el-table-column align="center" label="站点域名" prop="domainPre" width="180px">
        <template slot-scope="scope">
          <el-button style="padding:0;" type="text"><a target="_blank" :href="scope.row.systemDomain ? 'http://' + scope.row.domainPre +'.'+ scope.row.systemDomain.domainAddr : '' ">{{ scope.row.systemDomain ? scope.row.domainPre +'.'+ scope.row.systemDomain.domainAddr : '' }}</a></el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="到期时间" prop="endDate" width="220px">
        <template slot-scope="scope">
          <template>
            {{ scope.row.endDate }}
            <el-button
              v-if="(!timeShow && scope.row.siteID == rowIDTime) || (scope.row.siteID != rowIDTime)"
              style="margin-left:20px;padding:0;"
              type="text"
              @click="ShowaddTime(scope.row.siteID)"
            >
              续费
            </el-button>
            <div v-if="timeShow && scope.row.siteID == rowIDTime" style="display:flex;">

              <el-select v-model="renewalType" size="mini" style="width:250px" placeholder="请选择续费时间" :disabled="form.siteID ? true :false">
                <el-option
                  v-for="item in timeArr"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
              <el-button style="margin-left:10px;" size="mini" type="primary" @click="addTime(scope.row.siteID)">续费</el-button>
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人" prop="contacts" width="120px" />
      <el-table-column align="center" label="电话" prop="phone" width="120px" />
      <el-table-column align="center" label="证件号码" prop="iDNumber" width="180px" />
      <el-table-column align="center" label="地址" prop="iDAddr" width="300px" />
      <el-table-column align="center" label="站点版本" prop="location" width="140px">
        <template slot-scope="scope">
          <template>{{ scope.row.siteEdition ? scope.row.siteEdition.editionName : "" }}</template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="克隆额度" prop="batchLimit" width="180px">
        <template slot-scope="scope">
          <template>
            {{ scope.row.batchLimit }}
            <el-button v-if="(!show && scope.row.siteID == rowIDLines) || (scope.row.siteID != rowIDLines)" style="margin-left:20px;padding:0;" type="text"><i class="el-icon-plus" @click="showAddLines(scope.row.siteID)" /></el-button>
            <div v-if="show && scope.row.siteID == rowIDLines" style="display:flex;">
              <el-input-number v-model="lines" size="mini" :step-strictly="true" :step="1" :min="0" :controls="false" />
              <el-button style="margin-left:20px;" size="mini" type="primary" @click="addlines(scope.row.siteID)">增加</el-button>
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="全网对接押金" prop="connectMoney" width="120px" />
      <el-table-column align="center" label="站长姓名" prop="adminUser" width="120px">
        <template slot-scope="scope">
          <template>{{ scope.row.adminUser ? scope.row.adminUser.userName : "" }}</template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="isEnable" width="80px">
        <template slot-scope="scope">
          <template>{{ scope.row.isEnable ? "已启用" : "已禁用" }}</template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="600px" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click.stop="resetPass(scope.row.adminID)">重置登录密码</el-button>
          <el-button size="mini" type="primary" @click.stop="resetDealPass(scope.row.adminID)">重置交易密码</el-button>
          <el-button size="mini" :type="scope.row.isEnable ? 'danger' : 'success'" @click.stop="openClose(scope.row)">{{ scope.row.isEnable ? '禁用' : '启用' }}</el-button>
          <el-button size="mini" type="primary" @click.stop="toDetail(scope.row.siteID)">编辑</el-button>
          <el-button size="mini" type="success" @click.stop="leveUp(scope.row.siteID)">升级</el-button>
          <el-button size="mini" type="primary" @click.stop="price(scope.row)">域名管理</el-button>
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

    <el-dialog :title="form.siteID ? '修改站点' : '新增站点' " :visible.sync="Visible">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="站点名称" label-width="120px" prop="siteName">
          <el-input v-model="form.siteName" style="width:250px" size="small" />
        </el-form-item>
        <el-form-item label="站点域名" label-width="120px" :prop="form.siteID ? '' : 'domainID'" :hidden="form.siteID">
          <el-input v-model="form.domainPre" size="small" style="width:122px" :disabled="form.siteID ? true :false" />
          <el-select v-model="form.domainID" style="width:122px" size="small" placeholder="请选择域名" :disabled="form.siteID ? true :false">
            <el-option
              v-for="item in sysDomainList"
              :key="item.domainID"
              :label="item.domainAddr"
              :value="item.domainID"
            />
          </el-select>
          <el-button v-if="!checking&&!form.siteID" size="small" type="primary" @click="checkingDomainPre">验证域名</el-button>
          <el-button v-if="checking === 1001&&!form.siteID" size="small" type="success" icon="el-icon-check" circle />
          <el-button v-if="checking&&checking != 1001&&!form.siteID" size="small" type="danger" icon="el-icon-close" circle />
        </el-form-item>
        <el-form-item label="到期时间" label-width="120px" :hidden="form.siteID">
          <el-date-picker
            v-model="form.endDate"
            size="small"
            style="width:250px"
            type="date"
            :disabled="form.siteID ? true :false"
            value-format="yyyy-MM-dd"
            placeholder="选择到期时间"
          />
        </el-form-item>
        <el-form-item label="联系人" label-width="120px">
          <el-input v-model="form.contacts" size="small" style="width:250px" />
        </el-form-item>
        <el-form-item label="电话" label-width="120px">
          <el-input v-model="form.phone" size="small" style="width:250px" />
        </el-form-item>
        <el-form-item label="证件号码" label-width="120px">
          <el-input v-model="form.iDNumber" size="small" style="width:250px" />
        </el-form-item>
        <el-form-item label="地址" label-width="120px">
          <el-input v-model="form.iDAddr" size="small" style="width:250px" />
        </el-form-item>
        <el-form-item label="版本套餐" label-width="120px" :prop="form.siteID ? '' : 'sitePackageID'" :hidden="form.siteID">
          <el-select v-model="form.sitePackageID" size="small" style="width:250px" placeholder="请选择版本套餐" :disabled="form.siteID ? true :false">
            <el-option
              v-for="item in sitePackageList"
              :key="item.sitePackageID"
              :label="item.name"
              :value="item.sitePackageID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="全网对接押金" label-width="120px">
          <el-input-number v-model="form.connectMoney" size="small" style="width:250px" :precision="2" :step="0.01" :min="0" />
        </el-form-item>
        <el-form-item label="站点类型" label-width="120px">
          <el-radio-group v-model="form.siteType">
            <el-radio :label="0">全部</el-radio>
            <el-radio :label="1">卡盟</el-radio>
            <el-radio :label="2">发卡</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="站长姓名" label-width="120px" :prop="form.siteID ? '' : 'userName'" :hidden="form.siteID">
          <el-input v-model="form.userName" size="small" style="width:250px" :disabled="form.siteID ? true :false" />
        </el-form-item>
        <el-form-item label="登录帐号" label-width="120px" :prop="form.siteID ? '' : 'login'" :hidden="form.siteID">
          <el-input v-model="form.login" size="small" style="width:250px" :disabled="form.siteID ? true :false" />
        </el-form-item>
        <el-form-item label="登录密码" label-width="120px" :prop="form.siteID ? '' : 'password'" :hidden="form.siteID">
          <el-input v-model="form.password" size="small" style="width:250px" :disabled="form.siteID ? true :false" />
        </el-form-item>
        <el-form-item>
          <el-button size="small" style="float:right;margin-left:20px;" type="primary" @click="save('form')">{{ form.siteID ? "立即保存" : "立即创建" }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="站点升级" :visible.sync="leveVisible">
      <el-form>
        <el-form-item label="版本套餐" label-width="120px">
          <el-select v-model="leveSitePackageID" size="small" style="width:250px" placeholder="请选择版本套餐">
            <el-option
              v-for="item in leveSitePackageList"
              :key="item.sitePackageID"
              :label="item.name"
              :value="item.sitePackageID"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="leveVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="leveUpSave">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="rowName + '站点域名'"
      :visible.sync="priceVisible"
      width="60%"
    >
      <el-button type="primary" size="mini" @click.stop="toPriceDetail()">新增域名</el-button>
      <el-table :data="priceList" style="width: 100%;margin-top:30px;" border size="mini">
        <el-table-column align="center" label="域名地址" prop="siteAliasAddr" width="160px" />
        <el-table-column align="center" label="备案人姓名" prop="name" width="120px" />
        <el-table-column align="center" label="电话" prop="phone" width="120px" />
        <el-table-column align="center" label="备案人地址" prop="addr" width="250px" />
        <el-table-column align="center" label="证件号" prop="card" width="200px" />
        <el-table-column align="center" label="审核状态" prop="statu" width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.statu ? "已通过" : "未通过" }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200px" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click.stop="toPriceDetail(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click.stop="delIPrice(scope.row.siteAliasID)">删除</el-button>
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
          <el-form-item label="域名地址">
            <el-input v-model="priceForm.siteAliasAddr" style="width:200px;" />
          </el-form-item>
          <el-form-item label="备案人名称">
            <el-input v-model="priceForm.name" style="width:200px;" />
          </el-form-item>
          <el-form-item label="备案人身份证">
            <el-input v-model="priceForm.card" style="width:200px;" />
          </el-form-item>
          <el-form-item label="备案人电话">
            <el-input v-model="priceForm.phone" style="width:200px;" />
          </el-form-item>
          <el-form-item label="备案人地址">
            <el-input v-model="priceForm.addr" style="width:200px;" />
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
  name: 'SiteList',
  data() {
    return {
      dataList: [],
      total: 0,
      siteName: '',
      classValue: '',
      options: [],
      page: 1,
      size: 10,
      time: [],
      siteEditionList: [],
      serchForm: {
        siteName: '',
        contacts: '',
        domainPre: '',
        isEnable: '',
        isConnect: '',
        endDateStart: '',
        endDateEnd: ''
      },
      Visible: false,
      form: {
        siteID: null,
        siteName: '',
        domainID: '',
        endDate: null,
        contacts: '',
        phone: '',
        iDNumber: '',
        iDAddr: '',
        sitePackageID: '',
        domainPre: '',
        connectMoney: '',
        userName: '',
        login: '',
        password: '',
        siteType: 0
      },
      rules: {
        siteName: [
          { required: true, message: '请输入站点名称', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        domainID: [
          { required: true, message: '请选择系统域名', trigger: 'change' }
        ],
        sitePackageID: [
          { required: true, message: '请选择版本套餐', trigger: 'change' }
        ],
        domainPre: [
          { required: true, message: '请输入自定义域名', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入站长姓名', trigger: 'blur' }
        ],
        login: [
          { required: true, message: '请输入登录帐号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ]
        // date1: [
        //   { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        // ],
        // type: [//多选
        //   { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        // ],
        // resource: [//单选
        //   { required: true, message: '请选择活动资源', trigger: 'change' }
        // ]
      },
      sysDomainList: [],
      sitePackageList: [],
      checking: null,
      lines: null,
      show: false,
      rowIDLines: '',
      rowIDTime: '',
      renewalType: null,
      timeShow: false,
      timeArr: [{ key: 1, value: '一个月' }, { key: 2, value: '三个月' }, { key: 3, value: '半年' }, { key: 4, value: '一年' }],
      leveSitePackageList: null,
      leveVisible: false,
      rowIDLeve: '',
      leveSitePackageID: '',
      priceVisible: false,
      innerVisible: false,
      rowName: '',
      rowId: '',
      priceList: [],
      priceSize: 10,
      pricePage: 1,
      priceTotal: 0,
      priceForm: {
        siteAliasID: '',
        siteAliasAddr: '',
        siteID: '',
        name: '',
        card: '',
        phone: '',
        addr: ''
      }
    }
  },
  watch: {
    'form.domainID': {
      handler: function() {
        if (this.checking) {
          this.checking = null
        }
      }
    },
    'form.domainPre': {
      handler: function() {
        if (this.checking) {
          this.checking = null
        }
      }
    },
    Visible() {
      if (!this.Visible) {
        this.$refs['form'].resetFields()
        this.rest()
      }
    },
    innerVisible() {
      if (!this.innerVisible) {
        this.priceForm = {
          siteAliasID: '',
          siteAliasAddr: '',
          siteID: '',
          name: '',
          card: '',
          phone: '',
          addr: ''
        }
      }
    }
  },
  created() {
    this.getList()
    this.getSystemDomain()
    this.getSitePackageSize()
    this.getSiteEdition()
  },
  methods: {
    search() {
      this.page = 1
      this.getList()
    },
    rest() {
      this.form = {
        siteID: null,
        siteName: '',
        domainID: '',
        endDate: null,
        contacts: '',
        phone: '',
        iDNumber: '',
        iDAddr: '',
        sitePackageID: '',
        domainPre: '',
        connectMoney: '',
        userName: '',
        login: '',
        password: ''
      }
    },
    getList(page, size) {
      const form = Object.assign({}, this.serchForm, {
        pageNum: page || 1,
        pageSize: size || 10
      })
      this.POST(
        '/platform/site/page',
        form,
        data => {
          this.dataList = data.body.records
          this.dataList.forEach(el => {
            if (el.guests) {
              el.guestsArr = JSON.parse(el.guests)
            }
          })
          this.page = data.body.current
          this.size = data.body.size
          this.total = data.body.total
        }
      )
    },
    getSiteEdition() {
      this.GET(
        '/platform/siteEdition/list',
        {},
        data => {
          this.siteEditionList = data.body
        }
      )
    },
    changeTime(values) {
      if (values) {
        this.serchForm.endDateStart = values[0]
        this.serchForm.endDateEnd = values[1]
      } else {
        this.serchForm.endDateStart = ''
        this.serchForm.endDateEnd = ''
      }
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
    getSystemDomain() {
      this.GET(
        '/platform/systemDomain/list',
        {},
        data => {
          this.sysDomainList = data.body
        }
      )
    },
    getSitePackageSize() {
      this.GET(
        '/platform/sitePackage/list',
        {},
        data => {
          this.sitePackageList = data.body
        }
      )
    },
    isExist() {
      this.GET(
        '/platform/site/isExist',
        {
          domainPre: this.form.domainPre,
          domainID: this.form.domainID
        },
        data => {
          if (data.code) {
            this.checking = data.code
            if (this.checking === 1001) {
              this.$message({
                message: '域名可用！',
                type: 'success'
              })
            } else {
              this.$message.error('域名已被使用！')
            }
          }
        }
      )
    },
    checkingDomainPre() {
      if (!this.form.domainPre) {
        this.$message.error('请输入自定义域名')
        return
      }
      if (!this.form.domainID) {
        this.$message.error('请选择系统域名')
        return
      }
      this.isExist()
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.siteID) {
            const form = {
              siteID: this.form.siteID,
              siteName: this.form.siteName,
              contacts: this.form.contacts || '',
              phone: this.form.phone || '',
              iDNumber: this.form.iDNumber || '',
              iDAddr: this.form.iDAddr || '',
              connectMoney: this.form.connectMoney,
              siteType: this.form.siteType || 0
            }
            this.siteUpdate(form)
          } else {
            if (this.checking != 1001) {
              this.$message.error('请验证域名是否可用')
              return
            }
            this.siteAdd(this.form)
          }
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    siteAdd(form) {
      if (!form.endDate) {
        delete form['endDate']
      }
      this.POST(
        '/platform/site/add',
        form,
        data => {
          if (data.code == 1001) {
            this.$message({
              message: '新增成功！',
              type: 'success'
            })
            this.getList()
            this.Visible = false
            this.rest()
            this.$refs['form'].resetFields()
          }
        }
      )
    },
    siteUpdate(form) {
      this.POST(
        '/platform/site/update',
        form,
        data => {
          if (data.code == 1001) {
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
            this.getList()
            this.Visible = false
            this.rest()
            this.$refs['form'].resetFields()
          }
        }
      )
    },
    openClose(row) {
      this.GET(
        '/platform/site/enable',
        {
          siteID: row.siteID,
          isEnable: row.isEnable == 1 ? 0 : 1
        },
        data => {
          if (data.code == 1001) {
            this.$message({
              message: '操作成功！',
              type: 'success'
            })
            this.getList()
          }
        }
      )
    },
    toDetail(id) {
      this.Visible = true
      if (id) {
        this.GET(
          '/platform/site/get',
          {
            id: id
          },
          data => {
            if (data.body) {
              this.form = {
                siteID: data.body.siteID,
                siteName: data.body.siteName,
                domainID: data.body.domainID,
                endDate: data.body.endDate,
                contacts: data.body.contacts || '',
                phone: data.body.phone || '',
                iDNumber: data.body.iDNumber || '',
                iDAddr: data.body.iDAddr || '',
                sitePackageID: data.body.sitePackageID,
                domainPre: data.body.domainPre,
                connectMoney: data.body.connectMoney,
                userName: data.body.userName || '',
                login: data.body.login || '',
                password: data.body.password || '',
                siteType: data.body.siteType || 0
              }
            }
          }
        )
      }
    },
    showAddLines(id) {
      this.show = true
      this.rowIDLines = id
      this.lines = null
    },
    addlines(id) {
      if (!this.lines) {
        this.$message.error('请输入克隆额度')
        return
      }
      this.GET(
        '/platform/site/addLines',
        {
          siteID: id,
          lines: this.lines
        },
        data => {
          if (data.code == 1001) {
            this.$message({
              message: '操作成功！',
              type: 'success'
            })
            this.lines = null
            this.show = false
            this.getList()
          }
        }
      )
    },
    ShowaddTime(id) {
      this.timeShow = true
      this.rowIDTime = id
      this.renewalType = null
    },
    addTime(id) {
      if (!this.renewalType) {
        this.$message.error('请选择续费时间')
        return
      }
      this.GET(
        '/platform/site/renewal',
        {
          siteID: id,
          renewalType: this.renewalType
        },
        data => {
          if (data.code == 1001) {
            this.$message({
              message: '操作成功！',
              type: 'success'
            })
            this.renewalType = null
            this.timeShow = false
            this.getList()
          }
        }
      )
    },
    leveUp(id) {
      this.GET(
        '/platform/sitePackage/getLevel',
        {
          siteID: id
        },
        data => {
          this.leveSitePackageList = data.body
          this.leveVisible = true
          this.rowIDLeve = id
        }
      )
    },
    leveUpSave() {
      if (!this.leveSitePackageID) {
        this.$message.error('请选择套餐！')
        return
      }
      this.GET(
        '/platform/site/changelevel',
        {
          siteID: this.rowIDLeve,
          sitePackageID: this.leveSitePackageID
        },
        data => {
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
          this.rowIDLeve = null
          this.leveVisible = false
          this.leveSitePackageList = []
          this.leveSitePackageID = null
          this.getList()
        }
      )
    },
    getPriceList(id) {
      this.POST(
        '/platform/siteAlias/page',
        {
          siteID: this.rowId,
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
      this.getPriceList(this.pricePage, this.priceSize)
    },
    // 当前页面改变
    priceCurrentChange(val) {
      this.pricePage = val
      this.getPriceList(this.pricePage, this.priceSize)
    },

    price(row) {
      this.priceVisible = true
      this.rowName = row.siteName
      this.rowId = row.siteID
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
          '/platform/siteAlias/delete',
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
          siteAliasID: row.siteAliasID,
          siteAliasAddr: row.siteAliasAddr,
          siteID: this.rowId,
          name: row.name,
          card: row.card,
          phone: row.phone,
          addr: row.addr
        }
      }
      this.innerVisible = true
    },
    handlePriceClose() {
      var _this = this
      if (_this.priceForm.siteAliasID) {
        _this.POST(
          '/platform/siteAlias/update',
          this.priceForm,
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
        const form = this.priceForm
        form.siteID = this.rowId
        delete form['siteAliasID']
        _this.POST(
          '/platform/siteAlias/add',
          form,
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
              this.$alert(`重置成功！新的登录密码为：${data.msg}`, '提示', {
                confirmButtonText: '确定'
              })
            }
          }
        )
      })
    },
    resetDealPass(id) {
      var _this = this
      _this.$confirm('确定要重置交易密码吗?', '提示', {
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
