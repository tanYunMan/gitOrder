<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="公告标题">
        <el-input v-model="serchForm.title" placeholder="请输入公告标题" clearable size="small" />
      </el-form-item>
      <el-form-item label="公告内容">
        <el-input v-model="serchForm.content" placeholder="请输入公告内容" clearable size="small" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click.stop="search()">查询</el-button>
      </el-form-item>
    </el-form>

    <div class="btn-box">
      <el-button type="success" size="small" @click.stop="dialogVisible = true">新增公告</el-button>
    </div>
    <el-table :data="dataList" style="width: 100%;margin-top:30px;" border size="mini">
      <el-table-column align="center" label="标题" prop="title" min-width="200px" />
      <el-table-column align="center" label="内容" prop="content" min-width="300px" />
      <el-table-column align="center" label="颜色" prop="color" min-width="100px" />
      <el-table-column align="center" label="是否置顶" prop="isTop" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.isTop == 1 ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" min-width="160px" />
      <el-table-column align="center" label="操作" width="160px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click.stop="_det(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click.stop="_del(scope.row.updateNoticeID)">删除</el-button>
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

    <el-dialog width="60%" :title="form.rechargeModeID ? '修改公告' : '新增公告' " :visible.sync="dialogVisible">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="标题" label-width="120px" prop="title">
          <el-input v-model="form.title" style="width:250px" size="small" />
        </el-form-item>
        <el-form-item label="颜色" label-width="120px">
          <colorPicker v-model="form.color"></colorPicker>
          <!-- <span>{{form.color}}</span> -->
        </el-form-item>
        <el-form-item label="内容" label-width="120px" prop="content">
          <div style="height: 410px;">
            <quill-editor v-model="form.content" ref="myQuillEditor" style="height: 300px;" >
          </quill-editor>
        </div>
        </el-form-item>
        <el-form-item label="是否置顶" label-width="120px">
          <el-radio-group v-model="form.isTop">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
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
import { quillEditor } from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
export default {
  data() {
    return {
      dataList: [],
      total: 0,
      page: 1,
      size: 10,
      serchForm: {
        title: '',
        content: ''
      },
      dialogVisible: false,
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      form: {
        title: '',
        content: '',
        isTop: 0,
        color: '#000000',
        updateNoticeID: null
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
  components: {
    quillEditor
  },
  methods: {
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
        '/platform/updateNotice/page',
        form,
        data => {
          this.dataList = data.body.records
          this.size = data.body.size
          this.page = data.body.current
          this.total = data.body.total
        }
      )
    },
    _det(row) {
      this.form = {
        title: row.title,
        content: row.content,
        isTop: row.isTop,
        color: row.color,
        updateNoticeID: row.updateNoticeID
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
          '/platform/updateNotice/delete',
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
            this.form.updateNoticeID ? '/platform/updateNotice/update' : '/platform/updateNotice/add',
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
        title: '',
        content: '',
        isTop: 0,
        color: '#000000',
        updateNoticeID: null
      }
      this.$refs['form'].resetFields()
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

    // headleChangeColor(val){
    //   this.form.color = 
    // }
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
