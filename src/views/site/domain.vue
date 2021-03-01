<template>
<div class="container menu6-1-container">
    <div class="filter-wrap">
        <el-button type="primary" @click="addLevel(null)">新增站点域名</el-button>
    </div>
    <el-table border row-key="id" ref="multipleTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" size="mini" :cell-style="{'text-align':'center'}">
        <el-table-column prop="siteAliasAddr" label="域名地址"></el-table-column>
        <el-table-column prop="siteID" label="站点编号"></el-table-column>
        <el-table-column prop="name" label="备案人名称"></el-table-column>
        <el-table-column prop="statuName" label="状态"> </el-table-column>
        <el-table-column prop="card" label="备案人身份证"></el-table-column>
        <el-table-column prop="phone" label="备案人电话"></el-table-column>
        <el-table-column prop="addr" label="备案人地址"></el-table-column>
        <el-table-column prop="label10" label="操作" width="300px" fixed="right">
            <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="addLevel(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="delLevel(scope.row.siteAliasID)">删除</el-button>
                <el-button v-if="scope.row.statu === 0" type="primary" size="mini" @click="checkStatus(scope.row.siteAliasID)">审核</el-button>
            </template>
        </el-table-column>
    </el-table>

    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>

    <!-- 新增价格组/编辑 -->
    <el-dialog :title="addEdit" :visible.sync="dialog1" class="wl-dialog-style" :close-on-click-modal="false">
        <el-form ref="form" :model="form" :rules="formRules" label-width="140px">
            <el-form-item label="站点选择" prop="siteName">
                <el-input disabled v-model="form.siteName" placeholder="请选择站点" style="max-width:350px">
                    <el-button slot="append" icon="el-icon-search" @click="showDialog2()"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="域名地址" prop="siteAliasAddr">
                <el-input v-model="form.siteAliasAddr" placeholder="请输入域名地址" style="max-width:350px"></el-input>
            </el-form-item>
            <el-form-item label="备案人名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入备案人名称" style="max-width:350px"></el-input>
            </el-form-item>
            <el-form-item label="备案人身份证" prop="card">
                <el-input v-model="form.card" placeholder="请输入备案人身份证" style="max-width:350px"></el-input>
            </el-form-item>
            <el-form-item label="备案人电话" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入备案人电话" style="max-width:350px"></el-input>
            </el-form-item>
            <el-form-item label="备案人地址" prop="addr">
                <el-input v-model="form.addr" placeholder="请输入备案人地址" style="max-width:350px"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeDilog('form')">取 消</el-button>
            <el-button type="primary" @click="goSetLevel('form')">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 选择站点 -->
    <el-dialog title="addEdit" :visible.sync="dialog2" width="60%" :close-on-click-modal="false">
        <el-table border row-key="id" ref="multipleTable" :data="sitePage" style="width: 100%" :header-cell-style="{background:'#f5f5f5',color:'#606266','text-align':'center'}" size="mini" :cell-style="{'text-align':'center'}">
            <el-table-column label="站点ID" width="120">
                <template scope="scope">
                    <el-radio :label="scope.row.siteID" v-model="radio" @change.native="getCurrentRow(scope.row)"></el-radio>
                </template>
            </el-table-column>
            <el-table-column align="center" label="站点名称" prop="siteName" width="200px" />
            <el-table-column align="center" label="站点域名" prop="domainPre" width="180px">
                <template slot-scope="scope">
                    <el-button style="padding:0;" type="text"><a target="_blank" :href="scope.row.systemDomain ? 'http://' + scope.row.domainPre + scope.row.systemDomain.domainAddr : '' ">{{ scope.row.systemDomain ? scope.row.domainPre + scope.row.systemDomain.domainAddr : '' }}</a></el-button>
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
            <el-table-column align="center" label="站长姓名" prop="adminUser" width="120px">
                <template slot-scope="scope">
                    <template>{{ scope.row.adminUser ? scope.row.adminUser.userName : "" }}</template>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background @size-change="handleSiteSizeChange" @current-change="handleSiteCurrentChange" :page-sizes="[10, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="siteTotal"> </el-pagination>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeDilog2()">取 消</el-button>
            <el-button type="primary" @click="handleOkSelect()">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog title="确认删除" :visible.sync="delDialog" width="30%">
        <span slot="footer" class="dialog-footer">
            <el-button @click="delDialog = false">取 消</el-button>
            <el-button type="primary" @click="delConfirm" :loading="delConfirmLoading">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 审核 -->
    <el-dialog title="请选择审核结果" :visible.sync="checkDialog" width="30%">
        <el-radio v-model="checkStatu" label="1">通过</el-radio>
        <el-radio v-model="checkStatu" label="4">拒绝</el-radio>
        <span slot="footer" class="dialog-footer">
            <el-button @click="checkDialog = false">取 消</el-button>
            <el-button type="primary" @click="checkConfirm" :loading="checkConfirmLoading">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
// import Tinymce from '@/components/Tinymce'
export default {
    data() {
        return {
            color: '#333',
            addEdit: '新增站点域名',
            form: {},
            delDialog: false,
            setPriceDialog: false,
            dialog1: false,
            dialog2: false,
            delConfirmLoading: false,
            delIds: '',
            currentPage: 1,
            total: 0,
            tableData: [],
            multipleSelection: [],
            // 域名分页
            queryParams: {
                pageNum: 1,
                pageSize: 10
            },
            // 站点分页
            siteParams: {
                pageNum: 1,
                pageSize: 10
            },
            sitePage: [],
            siteTotal: 0,
            userLevel: [], // 用户级别
            userLevelList: [], // 用户级别--使用
            formRules: {
                siteName: [{
                        required: true,
                        message: '请选择站点',
                        trigger: 'blur'
                    },
                    //   { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                siteAliasAddr: [{
                        required: true,
                        message: '请输入域名地址',
                        trigger: 'blur'
                    },
                    //   { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                card: [{
                    max: 18,
                    min: 18,
                    message: '身份证长度为18位',
                    trigger: 'blur'
                }],
            },
            radio: "",
            templateSelection: {},
            checkDialog: false,
            checkStatu: '1',
            siteAliasID: ''
        }
    },
    components: {
        // Tinymce
    },
    mounted() {
        this.getList()
    },
    methods: {

        closeDilog(form) {
            this.dialog1 = false;
            this.$refs[form].resetFields() // 将form表单重置
        },
        closeDilog2() {
            this.dialog2 = false;
            this.radio = '';
            this.templateSelection = {}
        },

        // 获取站点域名列表
        getList() {
            this.loading = true
            this.POST('/platform/siteAlias/page', this.queryParams, res => {
                if (res.code === 1001) {
                    this.tableData = res.body.records
                    this.total = res.body.total
                }
                this.loading = false
            }, err => {
                this.loading = false
            })
        },

        // 删除
        delLevel(id) {
            this.delIds = id
            this.delDialog = true
        },
        delConfirm() {
            this.delConfirmLoading = true
            this.GET('/platform/siteAlias/delete', {
                    id: this.delIds
                },
                res => {
                    if (res.code === 1001) {
                        this.$notify({
                            title: res.msg,
                            type: 'success'
                        })
                        this.getList()
                    } else {
                        this.$notify.error({
                            title: res.msg
                        })
                    }
                    this.delDialog = false
                    this.delConfirmLoading = false
                }, err => {
                    this.delDialog = false
                    this.delConfirmLoading = false
                })
        },
        // 新增-编辑级别
        addLevel(data) {
            this.form = {}
            this.dialog1 = true
            this.addEdit = "新增站点域名"
            this.radio = '';
            this.templateSelection = {}
            if (data) {
                this.radio = data.siteID;
                this.templateSelection = data.siteVo;
                this.addEdit = "编辑站点域名"
                this.form = {
                    siteAliasID: data.siteAliasID,
                    siteAliasAddr: data.siteAliasAddr,
                    name: data.name,
                    card: data.card,
                    siteID: data.siteID,
                    phone: data.phone,
                    addr: data.addr,
                    siteName: data.siteVO ? data.siteVO.siteName : ''
                }
            }
        },

        //
        showDialog2() {
            this.dialog2 = true;
            this.getSitePage();
        },

        // 新增编辑
        goSetLevel(form) {
            let url
            if (this.form.siteAliasID) {
                url = '/platform/siteAlias/update'
            } else {
                url = '/platform/siteAlias/add'
            }
            this.$refs[form].validate(async valid => {
                if (!valid) return null // 如果验证失败就不往下继续执行
                this.POST(url, this.form, res => {
                    if (res.code === 1001) {
                        this.$message({
                            message: res.msg,
                            type: 'success',
                        });
                        this.getList()
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'error',
                        });
                    }
                    this.dialog1 = false
                }, err => {
                    this.dialog1 = false
                })
            })
        },

        // 确认定价操作

        handleSizeChange(val) {
            this.queryParams.pageSize = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.queryParams.pageNum = val
            this.getList()
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        getCurrentRow(row) {
            console.log(666, row)
            //获取选中数据
            this.templateSelection = row;
        },
        // 
        getSitePage() {
            this.loading = true
            this.POST('/platform/site/page', this.siteParams, res => {
                if (res.code === 1001) {
                    this.sitePage = res.body.records
                    this.siteTotal = res.body.total
                }
                this.loading = false
            }, err => {
                this.loading = false
            })
        },
        handleOkSelect() {
            if (this.templateSelection.siteID) {
                this.form.siteID = this.templateSelection.siteID;
                this.form.siteName = this.templateSelection.siteName;
            }
            this.dialog2 = false;
            this.templateSelection = {};
            this.radio = '';
        },
        handleSiteSizeChange(val) {
            this.siteParams.pageSize = val
            this.getSitePage()
        },
        handleSiteCurrentChange(val) {
            this.siteParams.pageNum = val
            this.getSitePage()
        },
        checkStatus(siteAliasID) {
            this.checkDialog = true;
            this.siteAliasID = siteAliasID;

        },
        checkConfirm() {
            this.GET('/platform/siteAlias/audit', {
                    siteAliasID: this.siteAliasID,
                    statu: this.checkStatu
                },
                res => {
                    if (res.code === 1001) {
                        this.$message({
                            message: res.msg,
                            type: 'success',
                        });
                        this.checkDialog = false;
                        this.getList()
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'error',
                        });
                    }
                    this.checkStatu = '1'
                }, err => {
                    this.checkStatu = '1'
                }
            )
        }
    }
}
</script>

<style lang="scss" scoped>
.container {

    .filter-wrap {
        margin-top: 20px;
        margin-right: 16px;
    }

    .filter-wrap button {
        float: right;
        margin: 10px auto;
    }

    .handle-wrap {
        // margin-top:20px;
        margin-bottom: 20px;
    }

}
</style>
