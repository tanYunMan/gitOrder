<template>
  <div class="upload-info">
    <div>
      <el-upload
        class="avatar-uploader"
        :action="domain"
        :data="QiniuData"
        :limit="1"
        :on-remove="handleRemove"
        :on-error="uploadError"
        :on-success="uploadSuccess"
        :before-remove="beforeRemove"
        :before-upload="beforeAvatarUpload"
        multiple
        :on-exceed="handleExceed"
        :file-list="fileList"
      >
        <img v-if="uploadPicUrl" :src="uploadPicUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon" />
      </el-upload>
    </div>
  </div>
</template>

<script>
// import { getDatas } from '@/api/price/price-1/common'
export default {
  props: ['imgList', 'imgName'],
  data() {
    return {
      loading: false,
      QiniuData: {
        key: '', // 图片名字处理
        token: '', // 七牛云token
        data: {}
      },
      domain: 'http://upload-z2.qiniup.com', // 七牛云的上传地址（华东区）
      qiniuaddr: 'http://qiniu.xinkashou.com', // 七牛云的图片外链地址 七牛云空间的外链地址
      uploadPicUrl: '', // 提交到后台图片地址
      fileList: []
    }
  },
  watch: {
    imgList() {
      this.uploadPicUrl = this.imgList ? this.imgList : ''
      if (this.imgList) {
        this.fileList = [{ status: 'success', name: this.imgName ? this.imgName + '.jpg' : 'thisImg.jpg', size: 63624, percentage: 100, uid: 1593691580290 }]
      } else {
        this.fileList = []
      }
    }
  },
  mounted() {
    this.getQiniuToken()
  },
  created() {
    this.uploadPicUrl = this.imgList ? this.imgList : ''

    if (this.imgList) {
      this.fileList = [{ status: 'success', name: this.imgName ? this.imgName + '.jpg' : 'thisImg.jpg', size: 63624, percentage: 100, uid: 1593691580290 }]
    } else {
      this.fileList = []
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.uploadPicUrl = ''
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `只允许上传一张图片`
      )
    },
    beforeAvatarUpload(file) { // 图片上传之前的方法
      const isPNG = file.type === 'image/png'
      const isJPEG = file.type === 'image/jpeg'
      const isJPG = file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 1

      if (!isPNG && !isJPEG && !isJPG) {
        this.$message.error('上传头像图片只能是 jpg、png、jpeg 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
        return false
      }

      const keyName = Date.parse(new Date()).toString() + Number.parseInt(Math.random() * 1000, 10) + '.jpg'

      this.QiniuData.data = file
      this.QiniuData.key = keyName// `${file.name}`;
    },
    uploadSuccess(response, file, fileList) { // 图片上传成功的方法
      this.uploadPicUrl = `${this.qiniuaddr}/${response.key}`
      // console.log(this.uploadPicUrl,111)
      this.$emit('listenTochildEvent', this.uploadPicUrl)
    },
    uploadError(err, file, fileList) { // 图片上传失败时调用
      this.$message({
        message: '上传出错，请重试！',
        type: 'error',
        center: true
      })
    },
    beforeRemove(file, fileList) {
      // return this.$confirm(`确定移除 ${ file.name }？`);
      this.$emit('listenTochildEvent', '')
    },
    // 提交数据到后台
    handleSubmit() {

    },
    // 请求后台拿七牛云token
    async getQiniuToken() { // token
      // getDatas({},'/platform/qiniu/getToken').then(res => {
      //   if (res.code===1001){

      //     this.QiniuData = {
      //       token: res.body.token,//七牛云token
      //       key: res.body.name
      //     }
      //   }
      // }).catch(err => {

      // })

      this.GET(
        '/platform/qiniu/getToken',
        {},
        data => {
          if (data.code === 1001) {
            this.QiniuData = {
              token: data.body.token, // 七牛云token
              key: data.body.name
            }
          }
        }
      )
    }
  }
}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 110px !important;
    height: 110px !important;
    line-height: 110px !important;
    text-align: center;
  }
  .avatar {
    width: 110px !important;
    height: 110px !important;
    display: block;
  }
  .el-upload-list{
    width: 220px;
  }
  .el-upload{
    height: 110px;
  }
</style>
